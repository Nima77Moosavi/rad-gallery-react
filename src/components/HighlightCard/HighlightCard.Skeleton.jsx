// src/components/HighlightCard/HighlightCard.Skeleton.jsx
import React from "react";
import styles from "./HighlightCard.module.css";

export default function HighlightCardSkeleton() {
  return (
    <div className={styles.card}>
      {/* Use the same circle container + skeleton */}
      <div className={`${styles.imageContainer} skeleton`} />

      {/* Mimic the title slot */}
      <div
        className="skeleton"
        style={{
          width: "70%",
          height: "16px",
          marginTop: "8px",
          borderRadius: "4px",
        }}
      />
    </div>
  );
}
