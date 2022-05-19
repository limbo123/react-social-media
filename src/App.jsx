import { useContext, useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDispatch, useSelector } from "react-redux";
import { Route } from "react-router-dom";
import { Switch } from "react-router-dom";
import { Context } from ".";
import "./App.css";
import AuthModal from "./components/AuthModal/AuthModal";
import Loader from "./components/Loader/Loader";
import Navbar from "./components/Navbar/Navbar";
import HomePage from "./pages/HomePage";
import SettingsPage from "./pages/SettingsPage";
import AccountPage from "./pages/AccountPage/AccountPage";
import { CHAT_PAGE, HOME_PAGE, PROFILE_PAGE, SETTINGS_PAGE } from "./utils/paths";
import { Redirect } from "react-router-dom";
import ChatPage from "./pages/ChatPage/ChatPage";
import { themeSlice } from "./redux/reducers/theme/themeSlice";



function App() {
  const { auth, firestore } = useContext(Context);
  const [user, loading] = useAuthState(auth);
  const { isModalOpened } = useSelector(state => state.registerUser); 
  const [users, setUsers] = useState([]);
  const [extUser, setExtUser] = useState(null);
  const dispatch = useDispatch();
  const { setInitialTheme } = themeSlice.actions;
  
  useEffect(() => {
    dispatch(setInitialTheme(localStorage.getItem("theme") ? localStorage.getItem("theme") : "light"))
  }, [])


  useEffect(() => { 
    firestore.collection("users").onSnapshot(snapshot => {
      setUsers(snapshot.docs.map(doc => ({
        id: doc.id, user: doc.data()
      })))
    })
  }, []);
  useEffect(() => {
    if(user) {
      if(user && users.length > 0) {
        const res = users.find(({ id }) => id === user.uid)
        setExtUser(res)
      }
    }
  }, [users])

  

  if(loading) {
    return <Loader />
  }
  return (
    <>
    {isModalOpened && <AuthModal />}
      <Navbar currentUser={extUser} users={users}/>

      <Switch>
        <Route path={HOME_PAGE} exact render={(props) => <HomePage {...props} currentUser={extUser}/>}/>
        <Route path={PROFILE_PAGE} render={(props) => <AccountPage {...props} currentUser={extUser}/>}/>
        <Route path={SETTINGS_PAGE} component={SettingsPage}/>
        <Route path={CHAT_PAGE} render={(props) => <ChatPage {...props} currentUser={extUser} users={users}/>}/>
        <Redirect to={HOME_PAGE}/>
      </Switch>
    </>
  );
}

export default App;
