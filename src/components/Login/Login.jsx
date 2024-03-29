import { Button } from "@mui/material";
import React, { useContext } from "react";
import { Context } from "../..";
import firebase from "firebase/compat/app";
import { registerSlice } from "../../redux/reducers/auth/registerSlice";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom/cjs/react-router-dom.min";

function Login() {
  const { auth } = useContext(Context);
  const { handleModal } = registerSlice.actions;
  const dispatch = useDispatch();
  const { currentTheme } = useSelector(state => state.themeReducer);

  // const handleLogin = async () => {
  //   const provider = new firebase.auth.GoogleAuthProvider();
  //   const { user } = await auth.signInWithPopup(provider);
  // };

  return (
    <>
        <Button
          onClick={() => dispatch(handleModal(true))}
          style={{ background: "#f51b4f" }}
          size="small"
          variant="contained"
        >
          Sign In
        </Button>
      <span style={currentTheme === "dark" ? {color: "#fff"} : {color: "#000"}}>And you will be able to create, like and comment posts</span>
    </>
  );
}

export default Login;
