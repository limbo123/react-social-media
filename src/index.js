import React, { createContext } from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import 'firebase/compat/storage';


firebase.initializeApp({
  apiKey: "AIzaSyCfZvhE-s5B3wa009aiNsLNUOOAKHdyXog",
  authDomain: "react-social-media-c2855.firebaseapp.com",
  projectId: "react-social-media-c2855",
  storageBucket: "react-social-media-c2855.appspot.com",
  messagingSenderId: "982795037283",
  appId: "1:982795037283:web:2503a9e3d46a7687e46656",
  measurementId: "G-870KFTB0T6"
});

export const Context = createContext(null);

const auth = firebase.auth();
const firestore = firebase.firestore()
const storage = firebase.storage();

ReactDOM.render(
  <React.StrictMode>
    <Context.Provider value={{
        firebase,
        firestore,
        auth,
        storage
      }}>
        <App />
      </Context.Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
