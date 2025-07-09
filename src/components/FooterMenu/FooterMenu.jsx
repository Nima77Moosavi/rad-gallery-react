import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { 
  IoHomeOutline, 
  IoBagOutline, 
  IoCartOutline, 
  IoPersonOutline 
} from "react-icons/io5";
import styles from "./FooterMenu.module.css";

const FooterMenu = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    checkScreenSize();

    const handleResize = () => checkScreenSize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (!isMobile) return null;

  return (
    <div className={styles.container}>
      <ul className={styles.footerul}>
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => `${styles.footerLink} ${isActive ? styles.active : ""}` }
          >
            <IoHomeOutline size={24} />
            <span>خانه</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/shop" 
            className={({ isActive }) => `${styles.footerLink} ${isActive ? styles.active : ""}` }
          >
            <IoBagOutline size={24} />
            <span>فروشگاه</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/user-panel/cart" 
            className={({ isActive }) => `${styles.footerLink} ${isActive ? styles.active : ""}` }
          >
            <IoCartOutline size={24} />
            <span>سبد خرید</span>
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/login" 
            className={({ isActive }) => `${styles.footerLink} ${isActive ? styles.active : ""}` }
          >
            <IoPersonOutline size={24} />
            <span>ورود</span>
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default FooterMenu;
