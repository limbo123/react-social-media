import { useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from ".";
import "./App.css";
import Loader from "./components/Loader/Loader";
import Navbar from "./components/Navbar/Navbar";
import OverviewPage from "./components/OverviewPage/OverviewPage";

function App() {

  const { auth } = useContext(Context);
  const [user, loading] = useAuthState(auth);
  if(loading) {
    return <Loader />
  }
  return (
    <>
      <Navbar />
      <OverviewPage />
    </>
  );
}

export default App;
