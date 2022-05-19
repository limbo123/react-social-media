import React, { useContext, useRef, useState } from "react";
import styles from "./RegisterForm.module.css";
import { FcGoogle } from "react-icons/fc";
import { registerUser } from "../../redux/reducers/auth/registerActions";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import firebase from "firebase/compat/app";
import { Context } from "../..";
import {registerSlice} from "../../redux/reducers/auth/registerSlice";
import { MdOutlinePhotoCameraFront } from "react-icons/md"


function RegisterForm() {
  const { auth } = useContext(Context);
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const dispatch = useDispatch();
  const { error } = useSelector(state => state.registerUser);
  const image = document.querySelector("#image"); 

  const authWithGoogle = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
  };

  const handleProfileImageChange = (e) => {
    if(e.target.files[0]) {
      setProfileImage(e.target.files[0]);
      const imageURL = URL.createObjectURL(e.target.files[0]);
      image.src = imageURL;
      image.style.display = "block"
    }
  }


  const handleRegister = (e) => {
    e.preventDefault();
    dispatch(registerUser({ email, password, nickname, profileImage}));
  };
  return (
    <>
      <h3 className={styles.modalTitle}>Register</h3>
      <p style={{color: "red", position: "relative", marginRight: "auto"}}>{error}</p>
      <form
        action=""
        onSubmit={(e) => handleRegister(e)}
        className={styles.RegisterForm}
      >
        <input
          required
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter Your Email"
        />
        <input
        required
        name="file"
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
          placeholder="Enter Your Nickname"
        />
        <input
        required
          type="text"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter Your Password"
        />
        <label htmlFor="profileImageInput" className={styles.imageLabel}>
          <MdOutlinePhotoCameraFront size="1.4rem" color="#000" />Set profile Image
          <img src="" id="image" style={{display: "none", width: "40px", height: "40px", objectFit: "cover", borderRadius: "50px"}} alt="" />
        </label>
        
        <input
        required
        id="profileImageInput"
        style={{display: "none"}}
          type="file"
          accept="image/*"
          onChange={handleProfileImageChange}
          placeholder="Enter Your Password"
        />
        <button type="submit">Register</button>
      </form>
      <div className={styles.loginWith}>
        <button className={styles.googleLoginBtn} onClick={authWithGoogle} type="button">
          Auth with Google
          <FcGoogle size="1.3rem" style={{ marginLeft: "5px" }} />
        </button>
      </div>
    </>
  );
}

export default RegisterForm;
