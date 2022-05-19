import React, { useEffect, useState } from "react";
import { useDrag } from "react-use-gesture";
import { animated, useSpring } from "@react-spring/web";

import styles from "./StoryInput.module.css";

function StoryInput({ setControls, inputAngle, inputTextSize }) {
  const [{ x, y }, api] = useSpring(() => ({ x: 0, y: 0 }));
  const [container, setContainer] = useState(null);
  const containerWidth = container?.offsetWidth;
  const containerHeight = container?.offsetHeight;
  const inputWidth = document?.querySelector("#story-text")?.offsetWidth;
  const inputHeight = document?.querySelector("#story-text")?.offsetHeight;

  useEffect(() => {
    setContainer(document?.querySelector("#container"));
  }, [document?.querySelector("#container")]);

  const bindInput = useDrag(
    ({ down, offset: [ox, oy] }) =>
      api.start({
        x: ox,
        y: oy,
      }),
    {
      bounds: {
        left: -containerWidth,
        right: containerWidth,
        top: -70,
        bottom: containerHeight - inputHeight - 100,
      },
    }
  );
  return (
    <>
      {container && (
        <animated.div {...bindInput()} style={{ x, y }}>
          {/* <p draggable="false" id="story-text" className={styles.storyText}>
      d
    </p> */}
          <input
            onClick={(e) => setControls(e.target)}
            type="text"
            draggable="false"
            placeholder="Type Here..."
            id="story-text"
            className={styles.storyText}
            style={{
              fontSize: `${inputTextSize}px`,
              transform: `rotate(${inputAngle}deg)`,
            }}
          />
          {/* <textarea
            onClick={(e) => setControls(e.target)}
            type="text"
            draggable="false"
            placeholder="Type Here..."
            id="story-text"
            className={styles.storyText}
            style={{
              fontSize: `${inputTextSize}px`,
              transform: `rotate(${inputAngle}deg)`,
            }}
            cols="24"
            rows="10"
          ></textarea> */}
        </animated.div>
      )}
    </>
  );
}

export default StoryInput;
