import { useState } from "react";
import { createPortal } from "react-dom";
import styles from "./StoryModal.module.css";
import { FiChevronRight, FiChevronLeft } from "react-icons/fi";

const modalRoot = document.querySelector("#storyModal");

const StoryModal = ({ closeStoryModal, stories }) => {
  const [storyIndex, setStoryIndex] = useState(0);
  const closeModal = (e) => {
    if (e.target === e.currentTarget) {
      closeStoryModal();
    }
  };
  return createPortal(
    <>
      <div className={styles.Overlay} onClick={closeModal}>
        <div className={styles.modal}>
          <div className={styles.storyInterface}>
            <img src={stories[0].previewImage} alt="" />
            <p>{stories[0].author}</p>
          </div>
          {stories.length > 1 && (
            <div className={styles.storySwitches}>
              <button
                type="button"
                disabled={storyIndex === 0}
                onClick={() => setStoryIndex(storyIndex - 1)}
              >
                <FiChevronLeft size="1.2rem" />
              </button>
              <button
                type="button"
                disabled={storyIndex === stories.length - 1}
                onClick={() => setStoryIndex(storyIndex + 1)}
              >
                <FiChevronRight size="1.2rem" />
              </button>
            </div>
          )}
          <img
            className={styles.storyImage}
            src={stories[storyIndex].story}
            alt=""
          />
        </div>
      </div>
    </>,
    modalRoot
  );
};

export default StoryModal;
