import React, { useContext, useEffect, useState } from "react";
import styles from "./StoriesList.module.css";
import { FaPlus } from "react-icons/fa";
import { useCollectionData } from "react-firebase-hooks/firestore";
import { Context } from "../..";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import StoryModal from "../StoryModal/StoryModal";
import { useSelector } from "react-redux";

function StoriesList({ openCreatingModal, currentUser }) {
  const { firestore } = useContext(Context);
  // const [stories, setStories] = useState([]);
  const [allStories] = useCollectionData(firestore.collection("stories"));
  const [oneUserStories, setOneUserStories] = useState([]);
  const [isWatchingStory, setIsWatchingStory] = useState(false);
  const [usersWhoHaveStories, setUsersWhoHaveStories] = useState([]);
  const { currentTheme } = useSelector(state => state.themeReducer);


  const settings = {
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
  };

  useEffect(() => {
    if (allStories && currentUser) {
      // setStories(
      //   allStories.filter((story) => {
      //     return currentUser.user.subscribes.includes(story.author);
      //   })
      // );
      const userSubscribesStories = allStories.filter((story) => {
        return currentUser.user.subscribes.includes(story.author);
      })
      const users = new Set(userSubscribesStories.map(story => story.author));
      setUsersWhoHaveStories([...users]);
    }
  }, [allStories]);

  return (
    <>
      {isWatchingStory && (
        <StoryModal closeStoryModal={() => setIsWatchingStory(false)} stories={oneUserStories} />
      )}

      <div className={styles.container}>
        <Slider {...settings}>
          <div onClick={openCreatingModal} className={styles.story}>
            <FaPlus size="1.3rem" color={currentTheme === "light" ? "#000" : "fff"} />
          </div>
          {usersWhoHaveStories.map((user) => {
            const userStories = allStories.filter(story => story.author === user)
            return (
              <div className={styles.story} key={user} onClick={() => {
                setOneUserStories(userStories)
                setIsWatchingStory(true);
              }}>
                <img src={userStories[0].previewImage} alt="" />
                <p style={currentTheme === "dark" ? {color: "#fff"} : {color: "#000"}}>{userStories[0].author}</p>
              </div>
            );
          })}
        </Slider>
      </div>
    </>
  );
}

export default StoriesList;
