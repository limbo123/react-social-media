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
  // firebase config(private information)
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
