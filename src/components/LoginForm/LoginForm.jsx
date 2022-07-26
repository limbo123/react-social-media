import React, { useContext, useState } from "react";
import styles from "./LoginForm.module.css";
import { FcGoogle } from "react-icons/fc";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/reducers/auth/registerActions";
import firebase from "firebase/compat/app";
import { Context } from "../..";
import {registerSlice} from "../../redux/reducers/auth/registerSlice";
import { sendPasswordResetEmail } from "firebase/auth";
import { showNotification } from "../../utils/notification";


function LoginForm({ redirectToLogin }) {
  const { auth } = useContext(Context);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.registerUser)


  // const authWithGoogle = async () => {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   const { user } = await auth.signInWithPopup(provider);
  // };


  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };
  const recoverPassword = () => {
    const recoverEmail = prompt("Enter your email there");
    sendPasswordResetEmail(auth, recoverEmail).then(() => {
      showNotification(true, "Request was sent", `We sent the request to ${recoverEmail}`)
    })
  } 
  return (
    <>
      <h3 className={styles.modalTitle}>Login</h3>
      <p style={{color: "red", position: "relative", marginRight: "auto"}}>{error}</p>
      <form
        action=""
        onSubmit={(e) => handleRegister(e)}
        className={styles.RegisterForm}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Your Password"
        />
        <button type="submit">Login</button>
      </form>
      <a onClick={recoverPassword} className={styles.recoverPassword}>Recover Password</a>
      <a onClick={redirectToLogin} className={styles.RegistrationLink}>Don't have account yet? Register</a>

      {/* <div className={styles.loginWith}>
        <button className={styles.googleLoginBtn} onClick={authWithGoogle} type="button">
          Auth with Google
          <FcGoogle size="1.3rem" style={{ marginLeft: "5px" }} />
        </button>
      </div> */}
    </>
  );
}

export default LoginForm;
