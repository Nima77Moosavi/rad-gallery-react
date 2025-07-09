import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./ManageCollections.module.css";

const ManageCollections = () => {
  const [collections, setCollections] = useState([]);

  useEffect(() => {
    // Fetch collections from the backend API
    fetch("http://127.0.0.1:8000/api/store/collections/")
      .then((response) => response.json())
      .then((data) => setCollections(data));
  }, []);

  return (
    <div className={styles.manageCollectionsContainer}>
      <h1>مدیریت مجموعه‌ها</h1>
      <Link to="/admin/collections/create" className={styles.createLink}>
        ایجاد مجموعه جدید
      </Link>
      <ul className={styles.collectionList}>
        {collections.map((collection) => (
          <li key={collection.id} className={styles.collectionItem}>
            <h4>{collection.title}</h4>
            <p>{collection.description}</p>
            <Link to={`/admin/collections/edit/${collection.id}`} className={styles.editLink}>
              ویرایش
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageCollections;
