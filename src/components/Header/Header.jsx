import React, { useState, useEffect } from "react";
import HeaderDesktop from "../HeaderDesktop/HeaderDesktop";
import HeaderMobile from "../HeaderMobile/HeaderMobile";
import { FaPhone, FaWhatsapp, FaInstagram, FaTelegram } from "react-icons/fa";
import styles from "./Header.module.css"; // import استایل‌ها

const Header = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.header}>
      {isMobile ? <HeaderMobile /> : <HeaderDesktop />}
      
      {/* کادر شبکه‌های اجتماعی */}
      <div className={styles.socialContainer}>
        <a href="https://facebook.com" className={styles.socialLink}>
          <FaPhone className={styles.socialIcon} />
        </a>
        <a href="https://twitter.com" className={styles.socialLink}>
          <FaWhatsapp className={styles.socialIcon} />
        </a>
        <a href="https://instagram.com" className={styles.socialLink}>
          <FaInstagram className={styles.socialIcon} />
        </a>
        <a href="https://linkedin.com" className={styles.socialLink}>
          <FaTelegram className={styles.socialIcon} />
        </a>
      </div>
    </div>
  );
};

export default Header;