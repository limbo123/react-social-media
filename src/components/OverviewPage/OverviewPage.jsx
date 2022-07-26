import React, { useContext, useEffect, useState } from "react";
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

  return (
    <>
      <div className={styles.Container} style={currentTheme === "dark" ? {background: "#100f24"} : {background: "rgb(245, 237, 237)"}}>
    {isCreatingHistory && <CreateHistoryModal closeCreateHistoryModal={() => setIsCreatingHistory(false)} currentUser={currentUser}/>}

        {user && <Navigation currentUser={currentUser} />}

        {user && currentUser && <StoriesList openCreatingModal={() => setIsCreatingHistory(true)} currentUser={currentUser} />}

        {user ? <CreatePost currentUser={currentUser} /> : <Login />}

        <div id="postsArea">
          {currentUser && posts.length > 0 &&
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
            {currentUser && posts.length === 0 && <h2 style={currentTheme === "dark" ? {color: "#fff"} : {color: "#000"}}>Your friends haven't posts yet. You can subscribe to another people to see their posts</h2>}
        </div>
      </div>
    </>
  );
}

export default OverviewPage;
