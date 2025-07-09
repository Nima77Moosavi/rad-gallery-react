import React from "react";
import styles from "./ProductCard.module.css"; // فرض کنید این فایل CSS را دارید
import { Link } from "react-router-dom";

const ProductCard = ({ product }) => {
  const productLink = `/productDetails/${product.url_title}-${product.id}`;
  
  // تابع برای فرمت کردن قیمت
  const formatPrice = (price) => {
    return new Intl.NumberFormat('fa-IR').format(price);
  };

  return (
    <Link to={productLink} className={styles.cardLink}>
      <div className={styles.card}>
        <img
          src={
            product.images.length > 0
              ? `${product.images[0].image}`
              : "/placeholder.jpg"
          }
          alt={product.title}
          className={styles.img}
        />
        <h4 className={styles.title}>{product.title}</h4>
        <button className={styles.price}>
          {formatPrice(product.variants[0].price)} تومان
        </button>
      </div>
    </Link>
  );
};

export default ProductCard;