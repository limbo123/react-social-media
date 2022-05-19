import { Button } from "@mui/material";
import React, { useContext, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { Context } from "../../../index";
import styles from "./CreatePost.module.css";
import { MdOutlinePhotoSizeSelectActual } from "react-icons/md";
import shortId from "shortid";
import firebase from "firebase/compat/app";
import { ReactNotifications, Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css";
import { showNotification } from "../../../utils/notification";
import { useSelector } from "react-redux";

function CreatePost({ currentUser }) {
  const { auth, storage, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const imagePreview = document.querySelector("#image-preview");
  const { currentTheme } = useSelector(state => state.themeReducer);
  

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);

      let selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
    }
  };

  const handleUpload = async () => {
    if (imageFile && currentUser) {
      let imageName = shortId.generate();
      const uploadTask = storage.ref(`images/${imageName}.jpg`).put(imageFile);
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = Math.round(
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          );
          setProgressPercent(progress);
        },
        (error) => {
          console.log(error);
        },
        () => {
          storage
            .ref("images")
            .child(`${imageName}.jpg`)
            .getDownloadURL()
            .then((imageURL) => {
              firestore.collection("posts").add({
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                postText,
                userAvatar: currentUser.user.profilePhoto,
                username: currentUser.user.nickname,
                userEmail: user.email,
                imageURL,
                likes: 0,
              });
              setImageFile(null);
              imagePreview.src = null;
              imagePreview.style.display = "none";
              setPostText("");
              // showNotification(true, "Post Success", "The posting was complated successfully");
            });
        }
      );
    } else {
      showNotification(false, "Post Error", "The image wasn't chosen")
    }
  };
  return (
    <>
    <ReactNotifications />
      
      <div className={styles.container} style={currentTheme === "light" ? {background: "#fff"} : {background: "#203A4F", color: "#fff"}}>
        <h3 className={styles.contTitle}>Create Post </h3>
        <textarea
        style={{background: "inherit", color: "inherit"}}
          placeholder="Type text there..."
          value={postText}
          onChange={(e) => setPostText(e.target.value)}
        ></textarea>
        <div className={styles.imagePreview}>
          <img id="image-preview" alt="" />
        </div>
        <label className={styles.uploadFileIcon} htmlFor="uploadFile">
          <MdOutlinePhotoSizeSelectActual size="1.6rem" />
        </label>
        <input
          type="file"
          onChange={handleChange}
          accept="image/*"
          id="uploadFile"
          className={styles.uploadFileInput}
        />

        <Button
          onClick={handleUpload}
          style={{
            background: currentTheme === "light" ? "#eb5e54" : "#145996",
            width: "fit-content",
            position: "absolute",
            bottom: "20px",
            right: "20px",
          }}
          variant="contained"
        >
          {"Post"}
        </Button>
      </div>
    </>
  );
}

export default CreatePost;
