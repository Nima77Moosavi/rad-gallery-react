import React from "react";
import { Link } from "react-router-dom"; // For navigation
import styles from "./CollectionCard.module.css"; // Optional: Add styling

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
        </div>
        <h3 className={styles.title}>{collection.title}</h3>
      </div>
    </Link>
  );
};

export default CollectionCard;