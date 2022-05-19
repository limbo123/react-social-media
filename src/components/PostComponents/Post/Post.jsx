import React, { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import shortid from "shortid";
import { Context } from "../../..";
import CommentInput from "../CommentInput/CommentInput";
import DeletePostAlertModal from "../DeletePostAlertModal/DeletePostAlertModal";
import styles from "./Post.module.css";
import { AiOutlineDelete } from "react-icons/ai";
import { AiOutlineLike, AiFillLike } from "react-icons/ai";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";
import { PROFILE_PAGE } from "../../../utils/paths";
import { Link } from "react-router-dom";

function Post({ post, id }) {
  const { auth, storage, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [isDeleting, setIsDeleting] = useState(false);
  const [likes, setLikes] = useState(post.likes ? post.likes : []);
  const [isLikeLeaved, setIsLikeLeaved] = useState(false);

  useEffect(() => {
    if (user) {
      if (likes.includes(user.email)) {
        setIsLikeLeaved(true);
      } else {
        setIsLikeLeaved(false);
      }
    }
  });

  const deletePost = () => {
    let imageRef = storage.refFromURL(post.imageURL);
    imageRef.delete();

    firestore.collection("posts").doc(id).delete();
  };

  const leaveLike = () => {
    if (likes.includes(user.email)) {
      const newLikes = likes.filter((email) => {
        return email !== user.email;
      });
      setLikes(newLikes);
      firestore.collection("posts").doc(id).update(
        {
          likes: newLikes,
        },
        0
      );
      setIsLikeLeaved(false);
    } else {
      likes.push(user.email);
      firestore.collection("posts").doc(id).update({
        likes: likes,
      });
      setIsLikeLeaved(true);
    }
  };

  return (
    <>
      {isDeleting && (
        <DeletePostAlertModal
          cancelDeleting={() => setIsDeleting(false)}
          deletePost={deletePost}
        />
      )}
      <div className={styles.container}>
        <div className={styles.userInfo}>
          <Link className={styles.Link} to={{
            pathname: PROFILE_PAGE,
            search: `?name=${post.username}`,

            state: {currentUser: post.username}
          }}>
            <img className={styles.userAvatar} src={post.userAvatar} alt="" />
            <span className={styles.userName}>{post.username}</span>
          </Link>
          {user && post.userEmail === user.email && (
            <div
              style={{ right: "20px", position: "absolute", cursor: "pointer" }}
              onClick={() => setIsDeleting(true)}
            >
              <AiOutlineDelete size="1.3rem" color="#bd291e" />
            </div>
          )}
        </div>
        <div className={styles.content}>
          <img className={styles.postImage} src={post.imageURL} alt="" />
          {user && (
            <div className={styles.postLikes} onClick={leaveLike}>
              {isLikeLeaved ? (
                <AiFillLike
                  color="#5e69ff"
                  style={{ marginRight: "5px" }}
                  size="1.6rem"
                />
              ) : (
                <AiOutlineLike
                  color="#5e69ff"
                  style={{ marginRight: "5px" }}
                  size="1.6rem"
                />
              )}
              <span>{post.likes ? post.likes.length : 0}</span>
            </div>
          )}
          <p className={styles.postText}>
            <span>{post.username}</span>: {post.postText}
          </p>
          {post?.comments?.reverse().map((comment) => {
            return (
              <p key={shortid.generate()} className={styles.postText}>
                <span>{comment.username}</span>: {comment.comment}
              </p>
            );
          })}
          {user && (
            <CommentInput
              comments={post.comments}
              id={id}
              username={post.username}
            />
          )}
        </div>
      </div>
    </>
  );
}

export default Post;
