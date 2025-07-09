import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Collections.module.css";

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/store/collections/"
        );
        if (!response.ok) {
          throw new Error("مشکل در دریافت اطلاعات");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          setCollections(data);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCollections();
  }, []);

  if (error) {
    return <div className={styles.error}>خطا: {error}</div>;
  }
  if (loading) {
    return <div className={styles.loading}>در حال بارگذاری...</div>;
  }
  if (!collections || collections.length === 0) {
    return <div className={styles.empty}>هیچ کالکشنی یافت نشد.</div>;
  }

  // Calculate the number of rows ("3" rows for this example)
  // If you want a responsive design, you might instead use CSS grid auto-fit containers.
  const rows = 3;
  // Split collections data into 3 equal parts (or close to equal)
  const collectionsPerRow = Math.ceil(collections.length / rows);
  const rowsData = Array.from({ length: rows }, (_, rowIndex) =>
    collections.slice(
      rowIndex * collectionsPerRow,
      (rowIndex + 1) * collectionsPerRow
    )
  );

  return (
    <div className={styles.collections}>
      <h2 className={styles.sectionTitle}>دسته‌بندی محصولات</h2>
      <div className={styles.row}>
        {collections.map((collection) => (
          <Link
            to={`/shop?collection=${encodeURIComponent(collection.title)}`}
            key={collection.id}
            className={styles.collectionCard}
            style={{ backgroundImage: `url(${collection.image})` }}
          >
            <div className={styles.overlay}>
              <div className={styles.description}>
                {collection.description || collection.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Collections;
