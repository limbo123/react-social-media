import React, { useContext, useEffect, useRef, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../../index";
import CreatePost from "../PostComponents/CreatePost/CreatePost";
import Login from "../Login/Login";
import styles from "./OverviewPage.module.css";
import Post from "../PostComponents/Post/Post";
import Navigation from "../Navigation/Navigation";
import StoriesList from "../StoriesList/StoriesList";
import CreateHistoryModal from "../CreateHistoryModal/CreateHistoryModal";
import { useSelector } from "react-redux";

function OverviewPage({ currentUser }) {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [lastPost, setLastPost] = useState({});
  const [isCreatingHistory, setIsCreatingHistory] = useState(false);
  const { currentTheme } = useSelector(state => state.themeReducer);


  useEffect(() => {
    if (currentUser) {
      firestore
        .collection("posts")
        .where("username", "!=", currentUser.user.nickname)
        .limit(1)
        .onSnapshot((snapshot) => {
          setLastPost(snapshot.docs[snapshot.docs.length - 1]);
          const allPosts = snapshot.docs.map((doc) => ({
            id: doc.id,
            post: doc.data(),
          }));
          const friendsPosts = allPosts.filter((post) => {
            if (currentUser.user.subscribes.includes(post.post.username)) {
              return post;
            }
          });
          setPosts(friendsPosts);
        });
    }
  }, [currentUser]);

  useEffect(() => {
    if (document.querySelectorAll("#post")) {
      if (posts.length === 1) {
        const observer = new IntersectionObserver(
          (entries, observer) => {
            entries.forEach((entry) => {
              if (
                entry.target === document.querySelector(".lastPost") &&
                entry.isIntersecting
              ) {
                firestore
                  .collection("posts")
                  .where("username", "!=", currentUser.user.nickname)

                  .startAfter(lastPost)
                  .limit(1)
                  .onSnapshot((snapshot) => {
                    if (snapshot.docs.length > 0) {
                      setLastPost(snapshot.docs[snapshot.docs.length - 1]);
                      const resultAllPosts = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        post: doc.data(),
                      }));

                      const resultFriendsPosts = resultAllPosts.filter(
                        (post) => {
                          if (
                            currentUser.user.subscribes.includes(
                              post.post.username
                            )
                          ) {
                            return post;
                          }
                        }
                      );
                      setPosts([...posts, ...resultFriendsPosts]);
                    }
                  });
              }
            });
          },
          {
            threshold: 0.1,
          }
        );
        const post = document.querySelector(".lastPost");
        observer.observe(post);
      }
    }
  }, [posts]);



  return (
    <>
      <div className={styles.Container} style={currentTheme === "dark" ? {background: "#100f24"} : {background: "rgb(245, 237, 237)"}}>
    {isCreatingHistory && <CreateHistoryModal closeCreateHistoryModal={() => setIsCreatingHistory(false)} currentUser={currentUser}/>}

        {user && <Navigation currentUser={currentUser} />}

        {user && currentUser && <StoriesList openCreatingModal={() => setIsCreatingHistory(true)} currentUser={currentUser} />}

        {user ? <CreatePost currentUser={currentUser} /> : <Login />}

        <div id="postsArea">
          {posts &&
            posts.map(({ id, post }) => {
              if (id === lastPost.id) {
                return (
                  <div id="post" className="lastPost" key={id}>
                    <Post id={id} post={post} />
                  </div>
                );
              }
              return (
                <div id="post" key={id}>
                  <Post id={id} post={post} />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
}

export default OverviewPage;
