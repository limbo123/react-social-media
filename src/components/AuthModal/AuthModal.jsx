import { FormControl, FormHelperText, Input, InputLabel } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerSlice } from "../../redux/reducers/auth/registerSlice";
import LoginForm from "../LoginForm/LoginForm";
import RegisterForm from "../RegisterForm/RegisterForm";

import styles from "./AuthModal.module.css";

const modalRoot = document.querySelector("#authModal");

const AuthModal = () => {
  const dispatch = useDispatch();
  const { handleModal, setError } = registerSlice.actions;
  const [isLoggining, setIsLoggining] = useState(true);

  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      dispatch(handleModal(false));
    }
  };

  
  useEffect(() => {
    return () => {
      dispatch(setError(""));
    }
  }, [])

  return createPortal(
    <>
      <div className={styles.Overlay} onClick={closeModal}>
        <div className={styles.Modal}>
          {isLoggining ? <LoginForm redirectToLogin={() => setIsLoggining(false)}/> : <RegisterForm />}
        </div>
      </div>
      
    </>,
    modalRoot
  );
};

export default AuthModal;
