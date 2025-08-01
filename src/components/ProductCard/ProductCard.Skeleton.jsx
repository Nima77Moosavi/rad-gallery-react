import React from "react";
import styles from "./ProductCard.module.css";

const ProductCardSkeleton = () => {
  return (
    <div className={styles.card}>
      <div className={`${styles.img} ${styles.skeleton}`}></div>
      <div className={`${styles.title} ${styles.skeletonText}`}></div>
      <div className={`${styles.price} ${styles.skeletonButton}`}></div>
    </div>
  );
};

export default ProductCardSkeleton;