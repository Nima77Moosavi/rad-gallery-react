// Example inside SidebarUserPanel.jsx
import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./SidebarUserPanel.module.css";

const SidebarUserPanel = () => {
  return (
    <nav className={styles.sidebarNav}>
      <NavLink
        to="/user-panel"
        end
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        داشبورد
      </NavLink>
      <NavLink
        to="/user-panel/account-info"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        اطلاعات حساب
      </NavLink>
      <NavLink
        to="/user-panel/cart"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        سبد خرید
      </NavLink>
      <NavLink
        to="/user-panel/orders"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        سفارش‌ها
      </NavLink>
      <NavLink
        to="/user-panel/wishlist"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        علاقه‌مندی‌ها
      </NavLink>
      <NavLink
        to="/user-panel/reviews"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        دیدگاه‌ها
      </NavLink>
      <NavLink
        to="/user-panel/addresses"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        آدرس‌ها
      </NavLink>
    </nav>
  );
};

export default SidebarUserPanel;
