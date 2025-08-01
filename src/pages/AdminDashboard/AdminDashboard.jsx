import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    // Fetch collections from the backend API
    fetch("http://127.0.0.1:8000/api/store/collections/")
      .then((response) => response.json())
      .then((data) => setCollections(data));
  }, []);

  const handleCollectionChange = (collectionId) => {
    setSelectedCollection(collectionId);
    // Fetch products based on the selected collection
    fetch(
      `http://127.0.0.1:8000/api/store/collections/${collectionId}/products/`
    )
      .then((response) => response.json())
      .then((data) => setProducts(data));
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* <div className={styles.sidebar}>
        <h2>مدیریت</h2>
        <ul>
          <li>
            <Link to="/admin/collections" className={styles.sidebarLink}>
              مدیریت مجموعه‌ها
            </Link>
          </li>
          <li>
            <Link to="/admin/products" className={styles.sidebarLink}>
              مدیریت محصولات
            </Link>
          </li>
        </ul>
      </div> */}

      <div className={styles.mainContent}>
        <h1>🛠 داشبورد ادمین</h1>
        <p>شما به عنوان مدیر وارد شده‌اید.</p>

        <button
          className={styles.logoutButton}
          onClick={() => {
            localStorage.clear();
            window.location.href = "/login"; // Redirect to login
          }}
        >
          خروج از حساب
        </button>

        {/* Collections Section */}
        <div className={styles.contentSection}>
          <h2>مدیریت مجموعه‌ها</h2>
          <div className={styles.createCollectionLink}>
            <Link to="/admin/collections/create">ایجاد مجموعه جدید</Link>
          </div>
          <div className={styles.collectionList}>
            <ul>
              {collections.map((collection) => (
                <li key={collection.id} className={styles.collectionItem}>
                  <button
                    className={styles.collectionButton}
                    onClick={() => handleCollectionChange(collection.id)}
                  >
                    {collection.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Products Section (for selected collection) */}
        {selectedCollection && (
          <div className={styles.productsSection}>
            <h3>
              مدیریت محصولات مجموعه "
              {collections.find((c) => c.id === selectedCollection)?.title}"
            </h3>
            <div className={styles.createProductLink}>
              <Link to={`/admin/products/create/${selectedCollection}`}>
                ایجاد محصول جدید
              </Link>
            </div>
            <ul className={styles.productList}>
              {products.map((product) => (
                <li key={product.id} className={styles.productItem}>
                  <h4>{product.title}</h4>
                  <p>{product.description}</p>
                  <Link
                    to={`/admin/products/${product.id}`}
                    className={styles.editLink}
                  >
                    ویرایش
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
