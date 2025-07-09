import React, { useState } from "react";
import styles from "./OrderDetails.module.css";

const OrderDetails = () => {
  const [activeLink, setActiveLink] = useState("current");

  const handleLinkClick = (e, link) => {
    e.preventDefault();
    setActiveLink(link);
  };

  return (
    <div className={styles.orderList}>
      <a
        href="/current"
        className={activeLink === "current" ? `${styles.link} ${styles.active}` : styles.link}
        onClick={(e) => handleLinkClick(e, "current")}
      >
        جاری
      </a>
      <a
        href="/sent"
        className={activeLink === "sent" ? `${styles.link} ${styles.active}` : styles.link}
        onClick={(e) => handleLinkClick(e, "sent")}
      >
        ارسال شده
      </a>
      <a
        href="/returned"
        className={activeLink === "returned" ? `${styles.link} ${styles.active}` : styles.link}
        onClick={(e) => handleLinkClick(e, "returned")}
      >
        مرجوعی
      </a>
    </div>
  );
};

export default OrderDetails;