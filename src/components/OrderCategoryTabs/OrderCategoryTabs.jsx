import React, { useState } from "react";
import styles from "./OrderCategoryTabs.module.css";

const OrderCategoryTabs = ({ onCategoryChange }) => {
  const [activeTab, setActiveTab] = useState("current");

  const handleTabClick = (category) => {
    setActiveTab(category);
    if (onCategoryChange) {
      onCategoryChange(category);
    }
  };

  return (
    <div className={styles.tabs}>
      <button
        className={activeTab === "current" ? styles.active : ""}
        onClick={() => handleTabClick("current")}
      >
        سفارش‌های جاری
      </button>
      <button
        className={activeTab === "delivered" ? styles.active : ""}
        onClick={() => handleTabClick("delivered")}
      >
        تحویل شده
      </button>
      <button
        className={activeTab === "returned" ? styles.active : ""}
        onClick={() => handleTabClick("returned")}
      >
        مرجوعی
      </button>
    </div>
  );
};

export default OrderCategoryTabs;