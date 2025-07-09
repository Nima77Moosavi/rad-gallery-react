import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import styles from "./ManageProducts.module.css";

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const { collectionId } = useParams(); // Get collection ID from URL

  useEffect(() => {
    // Fetch products for the selected collection
    fetch(`http://127.0.0.1:8000/api/store/products/`)
      .then((response) => response.json())
      .then((data) => setProducts(data));
  }, [collectionId]);

  return (
    <div className={styles.manageProductsContainer}>
      <h1>مدیریت محصولات</h1>
      <Link
        to={`/admin/products/create/${collectionId}`}
        className={styles.createLink}
      >
        ایجاد محصول جدید
      </Link>
      <ul className={styles.productList}>
        {products.map((product) => (
          <li key={product.id} className={styles.productItem}>
            <h4>{product.title}</h4>
            <p>{product.description}</p>
            <Link
              to={`/admin/products/edit/${product.id}`}
              className={styles.editLink}
            >
              ویرایش
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ManageProducts;
