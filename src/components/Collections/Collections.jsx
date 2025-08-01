import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Collections.module.css";
import CollectionCardSkeleton from "./CollectionCard.Skeleton"; // ← new

const Collections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "https://rad-gallery-api.liara.run/api/store/collections/"
        );
        if (!response.ok) {
          throw new Error("مشکل در دریافت اطلاعات");
        }
        const data = await response.json();
        if (Array.isArray(data)) {
          // فقط کالکشن‌های والد را فیلتر می‌کنیم (parent: null)
          const parentCollections = data.filter(
            (collection) => collection.parent === null
          );
          setCollections(parentCollections);
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

  return (
    <div className={styles.collections}>
      <h2 className={styles.sectionTitle}>دسته‌بندی محصولات</h2>
      <div className={styles.row}>
        {loading
          ? Array.from({ length: 9 }).map((_, i) => (
              <CollectionCardSkeleton key={i} />
            ))
          : collections.map((collection) => (
              <Link
                to={`/collections/${collection.id}`}
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
