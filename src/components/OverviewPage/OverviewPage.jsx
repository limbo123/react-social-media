import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../../index";
import CreatePost from "../PostComponents/CreatePost/CreatePost";
import Login from "../Login/Login";
import styles from "./OverviewPage.module.css";
import Post from "../PostComponents/Post/Post";

function OverviewPage() {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  useEffect(() => { 
    firestore.collection("posts").onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id, post: doc.data()
      })))
    })
  }, [])

  return (
    <div className={styles.Container}>
      {user ? <CreatePost /> : <Login />}
      
      {posts && posts.map(({id, post}) => {
        return <Post key={id} id={id} post={post}/>
      })}
    </div>
  );
}

export default OverviewPage;
