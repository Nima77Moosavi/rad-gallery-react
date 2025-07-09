import React from "react";
import ReactPlayer from "react-player";
import styles from "./MediaPlayer.module.css";

const MediaPlayer = ({ media }) => {
  if (media.media_type === "image") {
    return (
      <div className={styles.imageContainer}>
        <img src={media.media_file} alt={media.id} className={styles.image} />
      </div>
    );
  } else if (media.media_type === "video") {
    return (
      <div className={styles.videoContainer}>
        <ReactPlayer
          url={media.media_file}
          controls={true}
          width="100%"
          height="100%"
        />
      </div>
    );
  } else {
    return <div>Unsupported media type.</div>;
  }
};

export default MediaPlayer;
