import shortid from "shortid";
import { CHAT_PAGE } from "../utils/paths";


export const chatUser = async(history, firestore, currentUser, username) => {
    let userChats;
    await firestore
        .collection("chats")
        .where("members", "array-contains", currentUser.user.nickname)
        .get()
        .then((res) => {
          userChats =
            res.docs.map((doc) => {
              return doc.data();
            })
        });
  return new Promise((resolve) => {
    const chat = userChats.find((chat) => chat.members.includes(username));
    if (chat) {
      history.push({
        pathname: `${CHAT_PAGE}/${chat.chatId}`,
        state: {
          chatId: chat.chatId,
        },
      });
      resolve();
    } else {
      const newChatId = shortid.generate();
      firestore
        .collection("chats")
        .doc(newChatId)
        .set({
          members: [currentUser.user.nickname, username],
          messages: [],
          chatId: newChatId,
        })
        .then(() => {
          history.push({
            pathname: `${CHAT_PAGE}/${newChatId}`,
            state: {
              chatId: newChatId,
            },
          });
          resolve();
        });
    }
  });
};
