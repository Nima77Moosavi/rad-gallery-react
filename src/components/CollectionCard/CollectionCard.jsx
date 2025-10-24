import React from "react";
import { Link } from "react-router-dom";
import styles from "./CollectionCard.module.css";

const CollectionCard = ({ collection }) => {
  const getCollectionLink = () => {
    switch(collection.id) {
      case 3: return '/nojavan';
      case 1: return '/bozorgsal';
      case 6: return '/madarkodak';
      case 7: return '/ebadat';
      case 4: return '/kifkafsh';
      default: return `/collections/${collection.id}`;
    }
  };

  return (
    <Link to={getCollectionLink()} className={styles.cardLink}>
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