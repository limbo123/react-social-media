import React, { createContext } from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";
import { Provider } from "react-redux";
import { setupStore } from "./redux/store";
import { BrowserRouter } from "react-router-dom/cjs/react-router-dom.min";

firebase.initializeApp({
  apiKey: "AIzaSyCfZvhE-s5B3wa009aiNsLNUOOAKHdyXog",
  authDomain: "react-social-media-c2855.firebaseapp.com",
  projectId: "react-social-media-c2855",
  storageBucket: "react-social-media-c2855.appspot.com",
  messagingSenderId: "982795037283",
  appId: "1:982795037283:web:2503a9e3d46a7687e46656",
  measurementId: "G-870KFTB0T6",
});

export const Context = createContext(null);

const auth = firebase.auth();
const firestore = firebase.firestore();
const storage = firebase.storage();
const store = setupStore();

ReactDOM.render(
    <BrowserRouter>
      <Provider store={store}>
        <Context.Provider
          value={{
            firebase,
            firestore,
            auth,
            storage,
          }}
        >
          <React.StrictMode>
          <App />
          </React.StrictMode>
        </Context.Provider>
      </Provider>
    </BrowserRouter>,
  document.getElementById("root")
);
