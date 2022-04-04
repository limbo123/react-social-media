import { Button } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";
import styles from "./DeletePostAlertModal.module.css";

const modalRoot = document.querySelector("#deletePostAlertModal");

function DeletePostAlertModal({ deletePost, cancelDeleting }) {
  return createPortal(
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        <p>Are you sure to delete this post?</p>
        <div className={styles.buttons}>
        <Button size="small" variant="contained" color="info" onClick={cancelDeleting}>Cancel</Button>
        <Button size="small" variant="contained" style={{marginLeft: "10px", background: "#e6273d"}} onClick={deletePost}>Delete</Button>
      
        </div>
        </div>
    </div>,
    modalRoot
  );
}

export default DeletePostAlertModal;
