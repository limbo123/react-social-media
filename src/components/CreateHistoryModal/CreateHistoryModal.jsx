import React, { useContext, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { IoImageSharp } from "react-icons/io5";
import { BsTextareaT } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { useScreenshot } from "use-react-screenshot";
import * as htmlToImage from "html-to-image";

import styles from "./CreateHistoryModal.module.css";
import StoryImage from "../StoryImage/StoryImage";
import StoryInput from "../StoryInput/StoryInput";
import shortid from "shortid";
import { Context } from "../..";

const modalRoot = document.querySelector("#createHistoryModal");

const CreateHistoryModal = ({ closeCreateHistoryModal, currentUser }) => {
  const { storage, firestore } = useContext(Context);
  const [background, setBackground] = useState("#000");
  const [photo, setImage] = useState("");
  const [imageSize, setImageSize] = useState(0);
  const [imageAngle, setImageAngle] = useState(0);
  const [inputTextSize, setInputTextSize] = useState(20);
  const [inputAngle, setInputAngle] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [controlsType, setControlsType] = useState("");
  const [image, takeScreenshot] = useScreenshot();
  const storyAreaRef = useRef(null);
  // useEffect(() => {
  //   if(document.querySelector("#div")) {
  //     console.log(document.querySelector("#div"));
  //   }
  // }, [document.querySelector("#div")])
  const setControls = (target) => {
    setIsEditing(true);
    document.querySelector("#element-controls").style.display = "block";
    if (target.tagName === "IMG") {
      setControlsType("image");
    }
    if (target.tagName === "INPUT") {
      setControlsType("input");
    }
  };

  const resetControlls = (e) => {
    if (e.target === e.currentTarget) {
      setIsEditing(false);
      setControlsType("");
    }
  };

  // const changeSize = (target) => {
  //   document.querySelector("#change-image-size-range").style.display = "block";
  // };
  const changeImage = (e) => {
    if (e.target.files[0]) {
      const imageUrl = URL.createObjectURL(e.target.files[0]);
      setImage(imageUrl);
    }
  };

  const handleInput = () => {
    document.querySelector("#story-text").style.display = "block";
  };
  const createStory = async () => {
    document.querySelectorAll("#creatingInterface").forEach((el) => {
      el.style.display = "none";
    });
    if (document.querySelector("#element-controls")) {
      document.querySelector("#element-controls").style.display = "none";
    }
    await takeScreenshot(storyAreaRef.current)
      .then((data) => {
        const image = data;
        const imageName = shortid.generate();
        const uploadTask = storage.ref(`stories/${imageName}.jpeg`).putString(image.split(",")[1], "base64", {contentType: "image/jpeg"});
        uploadTask.on(
          "state_changed",
          () => {},
          () => {},
          async () => {
            await storage
              .ref("stories")
              .child(`${imageName}.jpeg`)
              .getDownloadURL()
              .then(async (imageURL) => {
                console.log(imageURL);
                firestore.collection("stories").doc(imageName).set({
                  author: currentUser.user.nickname,
                  id: imageName,
                  previewImage: currentUser.user.profilePhoto,
                  story: imageURL,
                });
              })
              .finally(() => {
                closeCreateHistoryModal();
              });
          }
        );
      });
  };

  return createPortal(
    <>
      <div className={styles.Overlay}>
        <div
          ref={storyAreaRef}
          className={styles.modal}
          id="container"
          style={{ background: background }}
          onClick={resetControlls}
        >
          <button
            id="creatingInterface"
            type="button"
            className={styles.closeModalBtn}
            onClick={closeCreateHistoryModal}
          >
            <IoIosClose color="#fff" size="2rem" />
          </button>
          <div id="creatingInterface" className={styles.creatingTools}>
            <button onClick={handleInput} className={styles.createInput}>
              <BsTextareaT size="1.5rem" color="#fff" />
            </button>
            <label className={styles.createImageLabel} htmlFor="create-image">
              <IoImageSharp size="1.5rem" color="#fff" />
            </label>
            <input
              type="file"
              id="create-image"
              accept="image/*"
              className={styles.createImage}
              onChange={changeImage}
            />
            <input
              type="color"
              id="change-color"
              className={styles.changeColor}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>
          {isEditing && (
            <div className={styles.contentControls} id="element-controls">
              {controlsType === "image" && (
                <>
                  <input
                    type="range"
                    min="10"
                    id="change-image-size-range"
                    onChange={(e) => setImageSize(e.target.value)}
                  />
                  <input
                    type="range"
                    min="0"
                    max="360"
                    id="change-image-angle-range"
                    onChange={(e) => setImageAngle(e.target.value)}
                  />
                </>
              )}
              {controlsType === "input" && (
                <>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    id="change-input-size-range"
                    onChange={(e) => setInputTextSize(e.target.value)}
                  />
                  <input
                    type="range"
                    min="0"
                    max="360"
                    id="change-input-angle-range"
                    onChange={(e) => setInputAngle(e.target.value)}
                  />
                </>
              )}
            </div>
          )}

          <StoryImage
            image={photo}
            imageSize={imageSize}
            setControls={setControls}
            imageAngle={imageAngle}
          />
          <StoryInput
            setControls={setControls}
            inputTextSize={inputTextSize}
            inputAngle={inputAngle}
          />
          <button
            id="creatingInterface"
            className={styles.createStoryBtn}
            onClick={createStory}
          >
            Upload Story
          </button>
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default CreateHistoryModal;
