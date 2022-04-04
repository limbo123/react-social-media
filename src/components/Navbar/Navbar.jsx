import React, { useContext, useState } from "react";
import { AppBar, Toolbar, Grid, Button } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../../index";
import firebase from "firebase/compat/app";
import styles from "./Navbar.module.css";
import { IoLogOutOutline } from "react-icons/io5"
import { FaReact } from "react-icons/fa"
import LogoutAlertModal from "../LogoutAlertModal/LogoutAlertModal"

function Navbar() {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  const [isLogout, setIsLogout] = useState(false);

  const handleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
  };

  return (
    <>
      {isLogout && <LogoutAlertModal logout={() => auth.signOut()} cancelLogout={() => setIsLogout(false)}/>}
    <AppBar color="default" variant="dense" position="static" style={{ background: "#eb5e54"}}>
      <Toolbar>
        <Grid container>
          <h3 style={{ color: "white", display: "flex", alignItems: "center" }} className="logo">
            <FaReact size="1.5rem"/> React Social Network
          </h3>
        </Grid>
        <Grid container style={{ display: "flex", justifyContent: "flex-end" }}>
          {user ? (
            <>
              <div className={styles.userInfo}>
                
                <h5 className={styles.userNickname}>{user.email.replace("@gmail.com", "")}</h5>
                <img src={user.photoURL} className={styles.userPhoto} alt="" />
                <button className={styles.logoutBtn} type="button" onClick={() => setIsLogout(true)}>Logout <IoLogOutOutline style={{marginLeft: "5px"}} size="1.3rem" /></button>
              </div>
            </>
          ) : (
            <Button
              onClick={handleLogin}
              color="warning"
              size="small"
              variant="outlined"
              style={{ border: "1px solid #fff", color: "#fff" }}
            >
              Sign In with Google
            </Button>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
    </>
  );
}

export default Navbar;
