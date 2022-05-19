import { createAsyncThunk } from "@reduxjs/toolkit";
import firebase from "firebase/compat/app";
import shortid from "shortid";

export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, thunkAPI) => {
    try {
      let isUserExists = false;
      await firebase.firestore().collection("users").where("nickname", "==", userData.nickname).get()
      .then(res => {
        if(res.docs.length > 0) {
          isUserExists = true;
        }
      });

      if(isUserExists) {
        return "Nickname is already exist. Try another one";
      } else {
        const user = firebase
          .auth()
          .createUserWithEmailAndPassword(userData.email, userData.password)
          .then((registeredUser) => {
            let imageName = shortid.generate();
            const uploadTask = firebase
              .storage()
              .ref(`images/${imageName}.jpg`)
              .put(userData.profileImage);
            uploadTask.on(
              "state_changed",
              () => {},
              () => {},
              async () => {
                await firebase
                  .storage()
                  .ref("images")
                  .child(`${imageName}.jpg`)
                  .getDownloadURL()
                  .then(async (imageURL) => {
                    firebase
                      .firestore()
                      .collection("users")
                      .doc(registeredUser.user.uid)
                      .set({
                        uid: registeredUser.user.uid,
                        profilePhoto: imageURL,
                        nickname: userData.nickname,
                        about: "",
                        subscribers: [],
                        subscribes: [],
                      });
                  })
                  .finally(() => {});
              }
            );
          });
        return user;
      
      }
        
    } catch (error) {
      thunkAPI.rejectWithValue("register Error");
    }
  }
);

export const loginUser = createAsyncThunk(
  "user/login",
  async (userData, thunkAPI) => {
    try {
      const user = firebase
        .auth()
        .signInWithEmailAndPassword(userData.email, userData.password)
        .then(() => {
          window.location.reload();
        });
      return user;
    } catch (error) {
      thunkAPI.rejectWithValue("login Error");
    }
  }
);
