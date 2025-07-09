import React from "react";
import styles from "./WishlistItems.module.css";
import { FiTrash2 } from "react-icons/fi";
import img1 from "../../assets/f1.jpg";
import img2 from "../../assets/f2.jpg";

const WishlistItems = () => {
  const wishlist = [
    { id: 1, name: "محصول ۱", price: "۲۰۰,۰۰۰ تومان", image: img1 },
    { id: 2, name: "محصول ۲", price: "۳۰۰,۰۰۰ تومان", image: img2 },
  ];

  const handleRemoveItem = (id) => {
    // Add your remove item logic here
    console.log(`Removing item ${id}`);
  };

  return (
    <div className={styles.wishlist}>
      <h3>لیست علاقه‌مندی‌ها</h3>
      {wishlist.length === 0 ? (
        <div className={styles.emptyMessage}>لیست علاقه‌مندی‌های شما خالی است</div>
      ) : (
        <ul>
          {wishlist.map((item) => (
            <li key={item.id}>
              <div className={styles.itemImage}>
                <img src={item.image} alt={item.name} />
              </div>
              <div className={styles.itemDetails}>
                <span className={styles.itemName}>{item.name}</span>
                <span className={styles.itemPrice}>{item.price}</span>
              <button className={styles.addToCart}>افزودن به سبد خرید</button>
              </div>
              <button 
                className={styles.deleteButton}
                onClick={() => handleRemoveItem(item.id)}
                aria-label="حذف از لیست علاقه‌مندی‌ها"
              >
                <FiTrash2 />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default WishlistItems;