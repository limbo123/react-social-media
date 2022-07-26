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
import classNames from "classnames";
import { useSelector } from "react-redux";
import { handleSubscribe } from "../../functions/subscribe";
import { changeNickname } from "../../functions/changeNickname";
import { chatUser } from "../../functions/chatUser";
import { changeAvatar } from "../../functions/changeAvatar";

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
  const { currentTheme } = useSelector((state) => state.themeReducer);

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
      
    }
  }, [currentUser]);

  const subscribe = async () => {
    const result = await handleSubscribe(
      currentUser,
      user,
      firestore,
      isUserSubscribed
    );
    setIsUserSubscribed(result);
  };

  const handleChatUser = async() => {
    await chatUser(history, firestore, currentUser, username);
  };

  const renameProfile = async () => {
    try {
      await changeNickname(firestore, username, newNickname);
      setNewNickname("");
      setChangeNicknameError("");
      setIsNicknameChanging(false);
      history.push(`?name=${newNickname}`);
      currentUser.user.nickname = newNickname;
    } catch (error) {
      console.log(error);
      setChangeNicknameError(error.message);
    }
  };

  const changeProfilePhoto = async(e) => {
    if (e.target.files[0]) {
      await changeAvatar(storage, e.target.files[0], firestore, currentUser);
    }
  };

  const changeBio = () => {
    firestore
      .collection("users")
      .where("nickname", "==", username)
      .get()
      .then((res) => {
        res.docs[0].ref
          .update({
            about: userBio,
          })
          .then(() => {
            currentUser.user.about = userBio;
          });
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
          <div
            style={
              currentTheme === "dark"
                ? { background: "#100f24" }
                : { background: "rgb(245, 237, 237)" }
            }
            className={styles.Container}
          >
            <Navigation currentUser={currentUser} />
            <div
              className={styles.contentContainer}
              style={
                currentTheme === "dark"
                  ? { background: "#203A4F", color: "#fff" }
                  : { background: "#fff" }
              }
            >
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
                        <BiEditAlt
                          size="1.5rem"
                          color={currentTheme === "dark" ? "#fff" : "#000"}
                        />
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
                                <button onClick={renameProfile}>
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
                          onBlur={() => {
                            setTimeout(() => {
                              document.querySelector(
                                "#change-bio-btn"
                              ).style.display = "none";
                            }, 500);
                          }}
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
                    <Button onClick={subscribe} variant="contained">
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
