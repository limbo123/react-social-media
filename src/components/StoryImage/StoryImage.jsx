import React from "react";
import { useDrag } from "react-use-gesture";
import { animated, useSpring } from "@react-spring/web";

import styles from "./StoryImage.module.css";

function StoryImage({ imageSize, image, setControls, imageAngle }) {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const container = document?.querySelector("#container");
  const containerWidth = container?.offsetWidth;
  const containerHeight = container?.offsetHeight;
  const imageWidth = document?.querySelector("#story-image")?.offsetWidth;
  const imageHeight = document?.querySelector("#story-image")?.offsetHeight;

  const bindImage = useDrag(
    ({ offset: [ox, oy] }) =>
      api.start({
        x: ox,
        y: oy,
      }),
    {
      bounds: {
        left: -10,
        right: containerWidth - imageWidth - 30,
        top: -70,
        bottom: containerHeight - imageHeight - 100,
      },
    }
  );
  return (
    <animated.div {...bindImage()} style={{ x, y }}>
      <img
      
        draggable="false"
        width={`${imageSize}%`}
        style={{ transform: `rotate(${imageAngle}deg)` }}
        onClick={(e) => setControls(e.target)}
        className={styles.storyImage}
        id="story-image"
        src={image}
      />
    </animated.div>
  );
}

export default StoryImage;
