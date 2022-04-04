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

function CreatePost() {
  const { auth, storage, firestore } = useContext(Context);
  const [user] = useAuthState(auth);
  const [postText, setPostText] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const imagePreview = document.querySelector("#image-preview");

  const handleChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);

      let selectedImageSrc = URL.createObjectURL(e.target.files[0]);
      imagePreview.src = selectedImageSrc;
      imagePreview.style.display = "block";
    }
  };

  const showNotification = (statusSuccess = true) => {
    Store.addNotification({
      title: statusSuccess ? "Post Success" : "Post Error",
      message: statusSuccess ? "The posting was complated successfully" : "The image wasn't chosen",
      type: statusSuccess ? "success":"danger",
      container: "top-right",
      insert: "top",
      animationIn: ['animate__animated animate__fadeIn'],
      animationOut: ['animate__animated animate__fadeOut'],
      dismiss: {
        duration: 3000,
        onScreen: true,
        showIcon: true,
      }
    })
  }

  const handleUpload = async () => {
    if (imageFile) {
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
                userAvatar: user.photoURL,
                username: user.email.replace("@gmail.com", ""),
                imageURL,
                likes: 0,
              });
              setImageFile(null);
              imagePreview.src = null;
              imagePreview.style.display = "none";
              setPostText("");
              showNotification();
            });
        }
      );
    } else {
      showNotification(false)
    }
  };
  return (
    <>
    <ReactNotifications />
      
      <div className={styles.container}>
        <h3 className={styles.contTitle}>Create Post </h3>
        <textarea
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
            background: "#eb5e54",
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
