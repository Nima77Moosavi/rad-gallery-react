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
        <a href="tel:989174189802" className={styles.socialLink}>
          <FaPhone className={styles.socialIcon} />
        </a>
        <a href="https://wa.me/989174189802" className={styles.socialLink}>
          <FaWhatsapp className={styles.socialIcon} />
        </a>
        <a href="https://instagram.com/rad_gallery_" className={styles.socialLink}>
          <FaInstagram className={styles.socialIcon} />
        </a>
        <a href="https://eitaa.com/radgallery" className={styles.socialLink} alt="ایتا">
          <FaTelegram className={styles.socialIcon} />
        </a>
      </div>
    </div>
  );
};

export default Header;