import React, { useContext, useEffect, useState } from "react";
import Navigation from "../../components/Navigation/Navigation";
import styles from "./ChatPage.module.css";
import { IoCreateOutline } from "react-icons/io5";
import CreateChatModal from "../../components/CreateChatModal/CreateChatModal";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { CHAT, CHAT_PAGE } from "../../utils/paths";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Switch } from "react-router-dom";
import { Route } from "react-router-dom";
import { Redirect } from "react-router-dom";
import Chat from "../../components/Chat/Chat";
import { Context } from "../..";
import { useSelector } from "react-redux";

function ChatPage({ currentUser, users }) {
  const { firestore } = useContext(Context)
  const [isChatCreating, setIsChatCreating] = useState(false);
  const [allChats, loading] = useCollectionData(
    firestore.collection("chats")
  );
  const [chats, setChats] = useState([])
  const { currentTheme } = useSelector(state => state.themeReducer);


  useEffect(() => {
    if(currentUser) {
      if(allChats) {
        setChats(allChats.filter(chat => chat.members.includes(currentUser.user.nickname)))
      }
    }
  }, [allChats])


  return (
    <>
      {currentUser && (
        <>
          {isChatCreating && (
            <CreateChatModal
              users={users}
              currentUser={currentUser}
              closeCreateChatModal={() => setIsChatCreating(false)}
            />
          )}
          <div className={styles.Container} style={currentTheme === "dark" ? {background: "#100f24"} : {background: "rgb(245, 237, 237)"}} >
            <Navigation currentUser={currentUser} />
            <div className={styles.contentContainer} style={currentTheme === "dark" ? {background: "#203A4F", color: '#fff'} : {background: "#fff"}}>
              <div className={styles.chatsList}>
                {chats.length > 0 ? (
                  chats.map((chat) => {
                    const chatGuest = chat.members.find(member => member !== currentUser.user.nickname)
                    return (
                      <NavLink
                        className={styles.chatLink}
                        key={chat.chatId}
                        activeClassName={currentTheme === "light" ? styles.activeChatLink: styles.activeDarkChatLink}
                        
                        to={{
                          pathname: `${CHAT_PAGE}/${chat.chatId}`,
                          state: {
                            chatId: chat.chatId,
                          }
                        }}
                      >
                        <img
                          className={styles.chatImage}
                          src={
                            users.find(
                              (user) => user.user.nickname === chatGuest
                            ).user.profilePhoto
                          }
                          alt=""
                        />
                        <p className={styles.chatTitle}>{chatGuest}</p>
                        {/* <p className={styles.chatLastMessage}>{chat.messages[chat.messages.length - 1].message}</p>  */}
                      </NavLink>
                    );
                  })
                ) : (
                  <p>
                    User Haven't chats. To create - click on "
                    {<IoCreateOutline />}" button below
                  </p>
                )}
                <button
                  className={styles.createChatBtn}
                  onClick={() => setIsChatCreating(true)}
                  type="button"
                >
                  <IoCreateOutline color="#fff" size="1.3rem" />
                </button>
              </div>
              <div className={styles.Chat}>
                <Switch>
                  <Route
                    path="/chats/:chatId"
                    render={(props) => <Chat currentUser={currentUser} users={users}/>}
                  />
                  <Redirect to={CHAT_PAGE} />
                </Switch>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default ChatPage;
