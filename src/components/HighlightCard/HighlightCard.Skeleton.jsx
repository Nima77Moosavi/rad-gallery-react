import React from "react";
import styles from "./HighlightCard.module.css";

const HighlightCardSkeleton = () => {
  return (
    <div className={styles.skeletonContainer}>
      <div className={styles.skeletonImage}></div>
      <div className={styles.skeletonTitle}></div>
    </div>
  );
};

export default HighlightCardSkeleton;