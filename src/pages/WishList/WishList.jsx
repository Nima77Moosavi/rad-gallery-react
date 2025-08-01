import React from "react";
import WishlistItems from "../../components/WishlistItems/WishlistItems";
import styles from "./WishList.module.css";

const Wishlist = () => {
  return (
    <div className={styles.wishlistPage}>
      {/* <h2>لیست علاقه‌مندی‌ها</h2> */}
     
       <WishlistItems />  
      
     
    </div>
  );
};

export default Wishlist;
