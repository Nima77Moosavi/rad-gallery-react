import React, { useState } from "react";
import OrderCategoryTabs from "../../components/OrderCategoryTabs/OrderCategoryTabs";
import OrderDetails from "../../components/OrderDetails/OrderDetails";
import styles from "./UserOrders.module.css";

const UserOrders = () => {
  const [selectedCategory, setSelectedCategory] = useState("current"); // دسته‌بندی سفارش‌ها

  const renderOrders = () => {
    switch (selectedCategory) {
      case "current":
        return <OrderDetails type="current" />;
      case "delivered":
        return <OrderDetails type="delivered" />;
      case "returned":
        return <OrderDetails type="returned" />;
      default:
        return <OrderDetails type="current" />;
    }
  };

  return (
    <div className={styles.ordersPage}>
      <h2>سفارش‌های من</h2>
      <OrderCategoryTabs setSelectedCategory={setSelectedCategory} />
      {renderOrders()}
    </div>
  );
};

export default UserOrders;
