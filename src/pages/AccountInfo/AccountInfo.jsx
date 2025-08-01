import React from "react";
import Header from "../../components/Header/Header"; // هدر
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel"; // سایدبار
import UserInfoForm from "../../components/UserInfoForm/UserInfoForm"; // فرم اطلاعات مشتری
import styles from "./AccountInfo.module.css";
import Footer from "../../components/Footer/Footer";

const AccountInfo = () => {
  return (
    <div className={styles.container}>
      
      <div className={styles.main}>
        {/* <aside className={styles.sidebar}>
          
        </aside> */}
        <div className={styles.content}>
          <UserInfoForm />
        </div>
      </div>
      
    </div>
  );
};

export default AccountInfo;
