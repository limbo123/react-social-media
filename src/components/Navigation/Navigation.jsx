import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  CHAT_PAGE,
  HOME_PAGE,
  PROFILE_PAGE,
} from "../../utils/paths";
import styles from "./Navigation.module.css";
import {
  AiOutlineHome,
  AiOutlineMessage,
} from "react-icons/ai";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../..";
import { useSelector } from "react-redux";

function Navigation({ currentUser }) {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  const { currentTheme } = useSelector((state) => state.themeReducer);

  return (
    <>
      {user && currentUser && (
        <div
          className={styles.Navigation}
          style={
            currentTheme === "light"
              ? { background: "#fff" }
              : { background: "#203a4f", boxShadow: "none" }
          }
        >
          <NavLink
            className={styles.NavLink}
            style={
              currentTheme === "light"
                ? {
                    borderBottom: "1px solid rgb(193, 192, 192)",
                    color: "rgb(129, 129, 129)",
                  }
                : { borderBottom: "1px solid #041524", color: "#fff" }
            }
            activeStyle={currentTheme === "dark" ? { background: "#0e2b45" } : { background: "#dbd9d9" }}
            exact
            to={{
              pathname: `${PROFILE_PAGE}`,
              search: `?name=${currentUser.user.nickname}`,
              state: {
                currentUser: currentUser.user.nickname,
              },
            }}
          >
            <img
              className={styles.profilePhoto}
              src={currentUser.user.profilePhoto}
              alt=""
            />
            {
              <p style={{ fontSize: "15px", fontWeight: "bold" }}>
                {currentUser.user.nickname}
              </p>
            }
          </NavLink>
          <NavLink
            style={
              currentTheme === "light"
                ? {
                    borderBottom: "1px solid rgb(193, 192, 192)",
                    color: "rgb(129, 129, 129)",
                  }
                : { borderBottom: "1px solid #041524", color: "#fff" }
            }
            className={styles.NavLink}
            activeStyle={currentTheme === "dark" ? { background: "#0e2b45" } : { background: "#dbd9d9" }}

            to={HOME_PAGE}
          >
            Home <AiOutlineHome size="1.1rem" />
          </NavLink>
          <NavLink
            style={
              currentTheme === "light"
                ? {
                    borderBottom: "1px solid rgb(193, 192, 192)",
                    color: "rgb(129, 129, 129)",
                  }
                : { borderBottom: "1px solid #041524", color: "#fff" }
            }
            className={styles.NavLink}
            activeStyle={currentTheme === "dark" ? { background: "#0e2b45" } : { background: "#dbd9d9" }}

            to={CHAT_PAGE}
          >
            Chat <AiOutlineMessage size="1.1rem" />
          </NavLink>
        </div>
      )}
    </>
  );
}

export default Navigation;
