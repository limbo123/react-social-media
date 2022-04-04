import { Button } from "@mui/material";
import React, { useContext } from "react";
import { Context } from "../..";
import firebase from "firebase/compat/app";

function Login() {
  const { auth } = useContext(Context);

  const handleLogin = async () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    const { user } = await auth.signInWithPopup(provider);
  };

  return (
    <>
      <Button
        onClick={handleLogin}
        style={{background: "#f51b4f"}}
        size="small"
        variant="contained"
      >
        Sign In with Google
      </Button>
      And you will be able to create, like and comment posts
    </>
  );
}

export default Login;
