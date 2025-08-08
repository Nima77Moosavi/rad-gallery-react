import React from "react";
import styles from "./CollectionCard.module.css";

const CollectionCardSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.skeletonImage}>
        <div className={styles.skeletonShimmer}></div>
      </div>
      <div className={styles.skeletonTitle}></div>
      <div className={styles.skeletonDate}></div>
    </div>
  );
};

export default CollectionCardSkeleton;