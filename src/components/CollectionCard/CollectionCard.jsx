import React from "react";
import { Link } from "react-router-dom";
import styles from "./CollectionCard.module.css";

const CollectionCard = ({ collection }) => {
  return (
    <Link to={`/collection/${collection.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img
            src={collection.image}
            alt={collection.title}
            className={styles.image}
          />
          {/* Overlay تیره برای خوانایی بهتر متن */}
          <div className={styles.darkOverlay}></div>
          
          {/* محتوای متنی روی overlay */}
          <div className={styles.textContent}>
            <h3 className={styles.title}>{collection.title}</h3>
            {collection.date && (
              <span className={styles.date}>{collection.date}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default CollectionCard;