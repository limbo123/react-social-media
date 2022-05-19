import React, { useContext, useEffect, useState } from "react";
import { AppBar, Toolbar, Grid, Button } from "@mui/material";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../../index";
import styles from "./Navbar.module.css";
import { IoLogOutOutline } from "react-icons/io5";
import { FaReact } from "react-icons/fa";
import LogoutAlertModal from "../LogoutAlertModal/LogoutAlertModal";
import { useDispatch, useSelector } from "react-redux";
import { registerSlice } from "../../redux/reducers/auth/registerSlice";
import { themeSlice } from "../../redux/reducers/theme/themeSlice";
import { Link } from "react-router-dom";
import { PROFILE_PAGE } from "../../utils/paths";
import "react-toggle/style.css"; 
import Toggle from "react-toggle";


function Navbar({ currentUser, users }) {
  const { auth } = useContext(Context);
  const [user] = useAuthState(auth);
  const [isLogout, setIsLogout] = useState(false);
  const { handleModal } = registerSlice.actions;
  const { changeTheme } = themeSlice.actions;
  const { currentTheme } = useSelector(state => state.themeReducer);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSwitchActivated, setIsSwitchActivated] = useState(false);
  const dispatch = useDispatch();


  useEffect(() => {
    if(currentTheme === "dark") {
      setIsSwitchActivated(true);
    }
  }, [])

  const toggleTheme = (toggleState) => {
    setIsSwitchActivated(toggleState);
    dispatch(changeTheme())

  }

  const handleSearch = (e) => {
    setSearchValue(e.target.value);

    if (e.target.value !== "") {
      const filteredResults = users.filter((currUser) => {
        return currUser.user.nickname.includes(e.target.value);
      });
      if (filteredResults.length > 10) {
        filteredResults.length = 10;
      }
      setSearchResults(filteredResults);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <>
      {isLogout && (
        <LogoutAlertModal
          logout={() => auth.signOut()}
          cancelLogout={() => setIsLogout(false)}
        />
      )}
      <AppBar
        color="default"
        variant="dense"
        position="static"
        style={currentTheme === "light" ? { background: "#eb5e54" } : { background: "#193a57"}}
      >
        <Toolbar>
          <Grid container>
            <h3
              style={{ color: "white", display: "flex", alignItems: "center" }}
              className="logo"
            >
              <FaReact size="1.5rem" /> React Social Network
            </h3>
            <Toggle checked={isSwitchActivated} onChange={(e) => toggleTheme(e.target.checked) } icons={false}  />
          </Grid>
          <Grid
            container
            style={{ display: "flex", justifyContent: "flex-end" }}
          >
            {user && currentUser ? (
              <>
                <div className={styles.searchSect}>
                  <input
                    className={styles.searchUsersBar}
                    type="text"
                    placeholder="Search user..."
                    value={searchValue}
                    onChange={handleSearch}
                    onFocus={() =>
                      (document.querySelector(
                        "#search-results"
                      ).style.opacity = 1)
                    }
                    onBlur={() =>
                      (document.querySelector(
                        "#search-results"
                      ).style.opacity = 0)
                    }
                  />
                  <ul id="search-results" className={styles.searchResults}>
                    {searchResults.map((res) => {
                      return (
                        <li key={res.id}>
                          <Link
                            className={styles.Link}
                            to={{
                              pathname: PROFILE_PAGE,
                              search: `?name=${res.user.nickname}`,
                              state: { currentUser: res.user.nickname },
                            }}
                          >
                            <img
                              src={res.user.profilePhoto}
                              className={styles.searchItemAvatar}
                              alt=""
                            />
                            <p>{res.user.nickname}</p>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
                <div className={styles.userInfo}>
                  <Link
                    className={styles.currentUserLink}
                    to={{
                      pathname: `${PROFILE_PAGE}`,
                      search: `?name=${currentUser.user.nickname}`,
                      state: {
                        currentUser: currentUser.user.nickname,
                      },
                    }}
                  >
                    <h5 className={styles.userNickname}>
                      {currentUser && currentUser.user.nickname}
                    </h5>
                    <img
                      src={currentUser && currentUser.user.profilePhoto}
                      className={styles.userPhoto}
                      alt=""
                    />
                  </Link>

                  <button
                    className={styles.logoutBtn}
                    type="button"
                    onClick={() => setIsLogout(true)}
                  >
                    Logout{" "}
                    <IoLogOutOutline
                      style={{ marginLeft: "5px" }}
                      size="1.3rem"
                    />
                  </button>
                </div>
              </>
            ) : (
              <Button
                onClick={() => dispatch(handleModal(true))}
                color="warning"
                size="small"
                variant="outlined"
                style={{ border: "1px solid #fff", color: "#fff" }}
              >
                Sign In
              </Button>
            )}
          </Grid>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Navbar;
