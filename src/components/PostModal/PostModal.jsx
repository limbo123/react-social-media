import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Post from "../PostComponents/Post/Post";

import styles from "./PostModal.module.css";

const modalRoot = document.querySelector("#postModal");

const PostModal = ({ post, closePostModal }) => {
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
        closePostModal()
    }
  };

  return createPortal(
    <>
      <div className={styles.Overlay} onClick={closeModal}>
            <Post post={post}/>
      </div>
      
    </>,
    modalRoot
  );
};

export default PostModal;
