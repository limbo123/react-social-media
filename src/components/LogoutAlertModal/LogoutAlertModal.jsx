import { Button } from "@mui/material";
import React from "react";
import { createPortal } from "react-dom";
import styles from "./LogoutAlertModal.module.css";

const modalRoot = document.querySelector("#logoutAlertModal");

function LogoutAlertModal({ logout, cancelLogout }) {
    const logoutAndCloseModal = () => {
        logout();
        cancelLogout();
    }
  return createPortal(
    <div className={styles.Overlay}>
      <div className={styles.Modal}>
        <p>Do you want to logout?</p>
        <div className={styles.buttons}>
        <Button size="small" variant="contained" color="info" onClick={cancelLogout}>Cancel</Button>
        <Button size="small" variant="contained" style={{marginLeft: "10px", background: "#e6273d"}} onClick={logoutAndCloseModal}>Logout</Button>
      
        </div>
        </div>
    </div>,
    modalRoot
  );
}

export default LogoutAlertModal;