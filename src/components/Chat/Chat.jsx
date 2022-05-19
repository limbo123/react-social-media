import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Chat.module.css";
import { BiSend } from "react-icons/bi";
import { Context } from "../..";
import shortid from "shortid";
import classNames from "classnames";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { withRouter } from "react-router-dom"

function Chat({ currentUser, users, history }) {
  const { firestore } = useContext(Context);
  let location = useLocation();
  const [messageInputValue, setMessageInputValue] = useState("");
  const [allChats, loading] = useCollectionData(firestore.collection("chats"));
  const [chat, setChat] = useState({});
  useEffect(() => {
    if(allChats) {
      setChat(allChats.find(currentChat => {
        return currentChat.chatId === location.state.chatId
      }))
    }
  }, [location.pathname])
  useEffect(() => {
    if (allChats) {
      setChat(
        allChats.find(
          (currentChat) => currentChat.chatId === location.state.chatId
        )
      );
      const messageArea = document.getElementById("chat-messages");
      messageArea.scroll({ top: messageArea.scrollHeight, behavior: "smooth" });
    }
  }, [allChats]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (messageInputValue !== "") {
      const chatMessages = chat.messages;
      chatMessages.push({
        nickname: currentUser.user.nickname,
        message: messageInputValue,
      });
      firestore
        .collection("chats")
        .doc(location.state.chatId)
        .update({
          messages: chatMessages,
        })
        .finally(() => {
          setMessageInputValue("");
        });
    }
  };
  return (
    <>
      {chat && (
        <>
          <div className={styles.chatArea}>
            <div id="chat-messages" className={styles.chatMessages}>
              {chat.messages &&
                chat.messages.map((message) => {
                  return (
                    <div
                      key={shortid.generate()}
                      className={
                        message.nickname === currentUser.user.nickname
                          ? classNames(styles.myMessage, styles.message)
                          : classNames(styles.guestMessage, styles.message)
                      }
                    >
                      <p style={{ margin: "0" }}>{message.message}</p>
                    </div>
                  );
                })}
            </div>
            <form
              className={styles.messageForm}
              onSubmit={sendMessage}
              action=""
            >
              <input
                type="text"
                value={messageInputValue}
                onChange={(e) => setMessageInputValue(e.target.value)}
              />
              <button type="submit">
                <BiSend size="1.4rem" />
              </button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default withRouter(Chat);
