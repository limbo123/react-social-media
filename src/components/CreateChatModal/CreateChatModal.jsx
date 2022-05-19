import { current } from "@reduxjs/toolkit";
import React, { useContext, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import shortid from "shortid";
import { Context } from "../..";

import styles from "./CreateChatModal.module.css";

const modalRoot = document.querySelector("#createChatModal");

const CreateChatModal = ({ closeCreateChatModal, users, currentUser }) => {
  const { firestore } = useContext(Context);
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      closeCreateChatModal();
    }
  };

  const createChat = (e) => {
    e.preventDefault();
    const guest = users.find((user) => user.user.nickname === nickname);
    if (guest) {
      const newChatId = shortid.generate();
      firestore.collection("chats").doc(newChatId).set({
        members: [currentUser.user.nickname, nickname],
        messages: [],
        chatId: newChatId,
      });
    }
  };

  return createPortal(
    <>
      <div className={styles.Overlay} onClick={closeModal}>
        <div className={styles.Modal}>
          <h3 className={styles.modalTitle}>Create a chat</h3>
          {/* <p style={{color: "red", position: "relative", marginRight: "auto"}}>{error}</p> */}
          <form action="" onSubmit={createChat} className={styles.RegisterForm}>
            <input
              required
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Enter a nickname of user"
            />

            <button type="submit">Create</button>
          </form>
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default CreateChatModal;
