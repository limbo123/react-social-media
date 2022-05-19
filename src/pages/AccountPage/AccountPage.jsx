import { Button } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";
import {
  useHistory,
  useLocation,
} from "react-router-dom/cjs/react-router-dom.min";
import { Context } from "../..";
import Navigation from "../../components/Navigation/Navigation";
import PostModal from "../../components/PostModal/PostModal";
import styles from "./AccountPage.module.css";
import QueryString from "qs";
import { BiEditAlt } from "react-icons/bi";
import { TiTick } from "react-icons/ti";
import { IoClose } from "react-icons/io5";
import { CHAT_PAGE } from "../../utils/paths";
import shortid from "shortid";
import classNames from "classnames";

function AccountPage({ currentUser }) {
  const { firestore, storage } = useContext(Context);
  const [userPosts, setUserPosts] = useState([]);
  const [userBio, setUserBio] = useState("");
  let location = useLocation();
  let history = useHistory();
  const [currentPost, setCurrentPost] = useState(null);
  const [isPostOpened, setIsPostOponed] = useState(false);
  const [userChats, setUserChats] = useState([]);
  const [newNickname, setNewNickname] = useState("");
  const [isNicknameChanging, setIsNicknameChanging] = useState(false);
  const [changeNicknameError, setChangeNicknameError] = useState("");

  const username = QueryString.parse(location.search, {
    ignoreQueryPrefix: true,
  }).name;
  const [user, setUser] = useState(null);
  const [isUserSubscribed, setIsUserSubscribed] = useState(false);
  useEffect(() => {
    if (username) {
      let findedUser = null;

      firestore.collection("users").onSnapshot((snapshot) => {
        const users = snapshot.docs.map((doc) => ({
          id: doc.id,
          user: doc.data(),
        }));
        findedUser = users.find((user) => user.user.nickname === username);
        setUser(findedUser);
      });

      firestore.collection("posts").onSnapshot((snapshot) => {
        const posts = snapshot.docs.map((doc) => ({
          id: doc.id,
          post: doc.data(),
        }));
        setUserPosts(
          posts.filter((post) => {
            return post.post.username === findedUser.user.nickname;
          })
        );
      });
    }
  }, [location.search]);
  useEffect(() => {
    if (user) {
      if (user.user.subscribers.includes(currentUser.user.nickname)) {
        setIsUserSubscribed(true);
      }
      if (user.user.about !== "") {
        setUserBio(user.user.about);
      } else {
        setUserBio("No bio yet...");
      }
    }
  }, [user]);
  useEffect(() => {
    if (currentUser) {
      firestore
        .collection("chats")
        .where("members", "array-contains", currentUser.user.nickname)
        .get()
        .then((res) => {
          setUserChats(
            res.docs.map((doc) => {
              return doc.data();
            })
          );
        });
    }
  }, [currentUser]);

  const handleSubscribe = () => {
    const currentUserSubscribes = currentUser.user.subscribes;
    const userSubscribers = user.user.subscribers;
    if (isUserSubscribed) {
      console.log("unsubscribe");
      const newSubscribes = currentUserSubscribes.filter(
        (subscribe) => subscribe !== user.user.nickname
      );
      console.log(currentUserSubscribes);
      firestore.collection("users").doc(currentUser.id).update({
        subscribes: newSubscribes,
      });

      const newSubscribers = userSubscribers.filter(
        (subscriber) => subscriber !== currentUser.user.nickname
      );
      firestore
        .collection("users")
        .doc(user.id)
        .update({
          subscribers: newSubscribers,
        })
        .then(() => setIsUserSubscribed(false));
    } else {
      console.log("subscribe");
      currentUserSubscribes.push(user.user.nickname);
      firestore.collection("users").doc(currentUser.id).update({
        subscribes: currentUserSubscribes,
      });
      userSubscribers.push(currentUser.user.nickname);
      firestore
        .collection("users")
        .doc(user.id)
        .update({
          subscribers: userSubscribers,
        })
        .then(() => setIsUserSubscribed(true));
    }
  };

  const handleChatUser = () => {
    const chat = userChats.find((chat) => chat.members.includes(username));
    if (chat) {
      history.push({
        pathname: `${CHAT_PAGE}/${chat.chatId}`,
        state: {
          chatId: chat.chatId,
        },
      });
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
        });
    }
  };

  const changeNickname = async () => {
    let isUserExists = false;
    await firestore
      .collection("users")
      .where("nickname", "==", newNickname)
      .get()
      .then((res) => {
        if (res.docs.length > 0) {
          isUserExists = true;
        }
      });
    if (!isUserExists) {
      firestore
        .collection("users")
        .where("nickname", "==", username)
        .get()
        .then((res) => {
          res.docs[0].ref
            .update({
              nickname: newNickname,
            })
            .then(() => {
              setNewNickname("");
              setChangeNicknameError("");
              setIsNicknameChanging(false);
              history.push(`?name=${newNickname}`);
              currentUser.user.nickname = newNickname;
            });
        });
    } else {
      setChangeNicknameError("username is already exists. Try another");
    }
  };

  const changeProfilePhoto = (e) => {
    if (e.target.files[0]) {
      const imageName = shortid.generate();
      const uploadTask = storage
        .ref(`images/${imageName}.jpg`)
        .put(e.target.files[0]);
      uploadTask.on(
        "state_changed",
        () => {},
        () => {},
        () => {
          storage
            .ref("images")
            .child(`${imageName}.jpg`)
            .getDownloadURL()
            .then((imageUrl) => {
              firestore.collection("users").doc(currentUser.id).update({
                profilePhoto: imageUrl,
              });
              console.log(imageUrl);
              currentUser.user.profilePhoto = imageUrl;
            });
        }
      );
    }
  };

  const changeBio = () => {
    console.log("hello");
    firestore
      .collection("users")
      .where("nickname", "==", username)
      .get()
      .then((res) => {
        res.docs[0].ref.update({
          about: userBio,
        })
        .then(() => {
          currentUser.user.about = userBio;
        })
      });
  };
  return (
    <>
      {user && (
        <>
          {isPostOpened && (
            <PostModal
              post={currentPost}
              closePostModal={() => setIsPostOponed(false)}
            />
          )}
          <div className={styles.Container}>
            <Navigation currentUser={currentUser} />
            <div className={styles.contentContainer}>
              <div className={styles.Overview}>
                <div className={styles.photoSect}>
                  <img
                    src={user.user.profilePhoto}
                    className={
                      user.user.nickname === currentUser.user.nickname
                        ? classNames(
                            styles.ProfileImage,
                            styles.currentUserImage
                          )
                        : styles.ProfileImage
                    }
                    alt=""
                  />
                  {user.user.nickname === currentUser.user.nickname && (
                    <div className={styles.changeImage}>
                      <label htmlFor="change-image">
                        <BiEditAlt size="1.5rem" />
                      </label>
                      <input
                        onChange={changeProfilePhoto}
                        type="file"
                        accept="image/*"
                        id="change-image"
                        style={{ display: "none" }}
                      />
                    </div>
                  )}
                </div>

                <div className={styles.profileInfo}>
                  <div className={styles.nicknameOverlay}>
                    <h1 className={styles.username}>
                      {user.user.nickname}
                      {user.user.nickname === currentUser.user.nickname && (
                        <div className={styles.changeNickame}>
                          <button
                            type="button"
                            onClick={() => setIsNicknameChanging(true)}
                            className={styles.changeNickameBtn}
                          >
                            <BiEditAlt size="1.5rem" />
                          </button>
                          {isNicknameChanging && (
                            <div className={styles.changeNicknameOverlay}>
                              <button
                                type="button"
                                className={styles.closeNicknameChanging}
                                onClick={() => setIsNicknameChanging(false)}
                              >
                                <IoClose size="1.2rem" color="grey" />
                              </button>
                              <p>{changeNicknameError}</p>

                              <div className={styles.ChangeNicknameForm}>
                                <input
                                  type="text"
                                  className={styles.changeNicknameInput}
                                  value={newNickname}
                                  onChange={(e) =>
                                    setNewNickname(e.target.value)
                                  }
                                  placeholder="type new nickname"
                                />
                                <button onClick={changeNickname}>
                                  <TiTick size="1.3rem" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </h1>
                  </div>
                  <div className={styles.bioOverlay}>
                    {user.user.nickname === currentUser.user.nickname ? (
                      //   <input
                      //   type="text"
                      //   className={styles.changeNicknameInput}
                      //   value={userBio}
                      //   // onChange={(e) =>

                      //   // }
                      //   placeholder="type new bio"
                      // />
                      <>
                        <textarea
                          name="bio"
                          maxLength="50"
                          className={styles.bioArea}
                          onFocus={() =>
                            (document.querySelector(
                              "#change-bio-btn"
                            ).style.display = "block")
                          }
                          onBlur={() =>
                            {
                              setTimeout(() => {
                                document.querySelector(
                                  "#change-bio-btn"
                                ).style.display = "none"
                              }, 500)
                            }
                          }
                          value={userBio}
                          placeholder="type new bio"
                          onChange={(e) => setUserBio(e.target.value)}
                          rows="3"
                        ></textarea>
                        <button
                          onClick={changeBio}
                          type="button"
                          id="change-bio-btn"
                          className={styles.changeBioBtn}
                        >
                          <TiTick size="1.3rem" />
                        </button>
                      </>
                    ) : (
                      <p>
                        {user.user.about !== ""
                          ? user.user.about
                          : "No bio yet..."}
                      </p>
                    )}
                  </div>
                  <div className={styles.statistics}>
                    <span>
                      <p>subscribers: </p>
                      <p>{user.user.subscribers.length}</p>
                    </span>
                    <span>
                      <p>posts: </p>
                      <p>{userPosts.length}</p>
                    </span>
                  </div>
                </div>
                {user.user.nickname !== currentUser.user.nickname && (
                  <div className={styles.profileButtons}>
                    <Button onClick={handleSubscribe} variant="contained">
                      {isUserSubscribed ? "Unsubscribe" : "Subscribe"}
                    </Button>
                    <Button onClick={handleChatUser} variant="contained">
                      chat
                    </Button>
                  </div>
                )}
              </div>
              <div
                className={
                  userPosts.length > 0
                    ? styles.userPosts
                    : styles.userWithoutPosts
                }
              >
                {userPosts.length > 0 ? (
                  userPosts.map(({ id, post }) => {
                    return (
                      <img
                        key={id}
                        onClick={() => {
                          setIsPostOponed(true);
                          setCurrentPost(post);
                        }}
                        className={styles.postImage}
                        src={post.imageURL}
                        alt=""
                      />
                    );
                  })
                ) : (
                  <p>user haven't posts yet</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default AccountPage;
