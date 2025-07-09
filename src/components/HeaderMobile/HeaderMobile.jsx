import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { IoMenu, IoSearch, IoClose } from "react-icons/io5";
import styles from "./HeaderMobile.module.css";
import Banner from "../Banner/Banner";
import image1 from "../../assets/banner11.png";

const HeaderMobile = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close the menu if clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <header className={styles.headerMobile}>
      <div className={styles.logoContainer}>
          <img src={image1} alt="کیمیاترنج" className={styles.logo} />
        </div>
      {/* Center: Search box */}
      <div className={styles.searchContainer}>
        <div className={styles.searchBox} dir="rtl">
          <input type="text" placeholder="در کیمیاترنج جستجو کنید ..." />
          <IoSearch className={styles.searchIcon} />
        </div>
      </div>

      {/* Right: Hamburger Button (only if menu is closed) */}
      {!isMenuOpen && (
        <div className={styles.hamburgerContainer}>
          <button
            className={styles.hamburgerButton}
            onClick={() => setIsMenuOpen(true)}
            aria-label="Navigation menu"
          >
            <IoMenu size={56} color="#002147" />
          </button>
        </div>
      )}

      {/* Menu Overlay with sliding panel */}
      {isMenuOpen && (
        <div className={styles.menuOverlay}>
          <div className={styles.menuPanel} ref={menuRef}>
            <button
              className={styles.closeButton}
              onClick={() => setIsMenuOpen(false)}
              aria-label="Close menu"
            >
              <IoClose size={36} color="#023047" />
            </button>
            <ul className={styles.menuList}>
              <li className={styles.menuItem}>
                <Link to="/" onClick={() => setIsMenuOpen(false)}>
                  صفحه اصلی
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                  درباره ما
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/about" onClick={() => setIsMenuOpen(false)}>
                  اخذ نمایندگی
                </Link>
              </li>
              <li className={styles.menuItem}>
                <Link to="/blog" onClick={() => setIsMenuOpen(false)}>
                  مقالات
                </Link>
              </li>
              {/* New menu item for gift selection */}
              <li className={styles.menuItem}>
                <Link to="/gift-selector" onClick={() => setIsMenuOpen(false)}>
                  کادو چی بخرم؟
                </Link>
              </li>
              {/* Add more items as needed */}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderMobile;
