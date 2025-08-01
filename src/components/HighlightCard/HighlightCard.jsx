import React from "react";
import { Link } from "react-router-dom";
import styles from "./HighlightCard.module.css";

const HighlightCard = ({ highlight }) => {
  return (
    <Link to={`/highlight/${highlight.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <div className={styles.imageContainer}>
          <img
            src={highlight.cover_image}
            alt={highlight.title}
            className={styles.image}
          />
        </div>
        <h3 className={styles.title}>{highlight.title}</h3>
        {/* <small className={styles.date}>{highlight.created_at}</small> */}
      </div>
    </Link>
  );
};

export default HighlightCard;
