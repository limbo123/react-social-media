import React, { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../../..";
import styles from "./CommentInput.module.css";
import { BiSend } from "react-icons/bi"

function CommentInput({ id, comments }) {
  const { auth, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [comment, setComment] = useState("");
  const [commentsArray] = useState(comments ? comments : []);

  const postComment = () => {
    if (comment !== "") {
      commentsArray.push({
        comment,
        username: user.email.replace("@gmail.com", ""),
      });
      firestore.collection("posts").doc(id).update({
        comments: commentsArray,
      })
      .then(() => {
        setComment("");
      });
    }
  };
  return (
    <div className={styles.commentInput}>
      <input
        type="text"
        placeholder="Leave a comment..."
        className={styles.input}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="button"
        onClick={postComment}
        className={styles.postCommentBtn}
      >
        <BiSend size="1.3rem" color="#5562ab"/>
      </button>
    </div>
  );
}

export default CommentInput;
