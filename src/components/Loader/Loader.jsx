import React from "react";
import { BallTriangle } from "react-loader-spinner";
import styles from "./Loader.module.css";

function Loader() {
  return (
    <div className={styles.Container}>
      <BallTriangle color="rgb(34, 33, 45)" />
      <h1>Loading, please wait...</h1>
    </div>
  );
}

export default Loader;
