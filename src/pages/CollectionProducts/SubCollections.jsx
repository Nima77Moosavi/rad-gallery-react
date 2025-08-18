import React, { useCallback } from "react";
import styles from "./CollectionProducts.module.css";

const SubCollections = ({ 
  directSubCollections, 
  selectedSubCollection, 
  collectionTitle,
  onSelectSubCollection 
}) => {
  const handleSelect = useCallback((id) => {
    onSelectSubCollection(id);
  }, [onSelectSubCollection]);

  if (!directSubCollections?.length) return null;

  return (
    <div className={styles.subCollections}>
      <h3>زیردسته‌های {collectionTitle}:</h3>
      <div className={styles.subCollectionList}>
        <button
          className={`${styles.subCollectionButton} ${
            !selectedSubCollection ? styles.active : ""
          }`}
          onClick={() => handleSelect(null)}
        >
          همه محصولات
        </button>
        {directSubCollections.map(sub => (
          <button
            key={sub.id}
            className={`${styles.subCollectionButton} ${
              selectedSubCollection === sub.id ? styles.active : ""
            }`}
            onClick={() => handleSelect(sub.id)}
          >
            {sub.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default React.memo(SubCollections);