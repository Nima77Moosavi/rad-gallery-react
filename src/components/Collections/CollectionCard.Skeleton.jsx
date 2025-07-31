// src/components/Collections/CollectionCard.Skeleton.jsx
import React from 'react';
import styles from './Collections.module.css'; // reuse the same card sizing

export default function CollectionCardSkeleton() {
  return (
    <div className={styles.collectionCard}>
      {/* full‐card placeholder */}
      <div
        className="skeleton"
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px'
        }}
      />
    </div>
  );
}
