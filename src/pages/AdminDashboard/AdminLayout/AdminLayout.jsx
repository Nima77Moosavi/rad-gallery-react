import React from "react";
import { Link, Outlet } from "react-router-dom";
import styles from "./AdminLayout.module.css";

const AdminLayout = () => {
  return (
    <div className={styles.adminLayoutContainer}>
      {/* Sidebar */}
      <div className={styles.sidebar}>
        <Link to="admin-dashboard" className={styles.sidebarLink}>
          <h2>مدیریت</h2>
        </Link>
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
      </div>

      {/* Main Content Area */}
      <div className={styles.mainContent}>
        <Outlet /> {/* This will render the content of each admin page */}
      </div>
    </div>
  );
};

export default AdminLayout;
