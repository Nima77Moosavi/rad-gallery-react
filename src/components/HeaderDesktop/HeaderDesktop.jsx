import React, { useState, useRef, useEffect, useContext } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import styles from "./HeaderDesktop.module.css";
import { Link } from "react-router-dom";

// React icons import
import { IoMenu, IoSearch } from "react-icons/io5";
import { FaCartShopping } from "react-icons/fa6";
import { FiHome } from "react-icons/fi";
import { BsFileEarmarkPerson } from "react-icons/bs";
import { TbDeviceIpadHorizontalStar } from "react-icons/tb";
import { PiArticleBold } from "react-icons/pi";
import { FavoritesContext } from "../../context/FavoritesContext";
import { IoBagOutline } from "react-icons/io5";
import { GoGift } from "react-icons/go";
import image1 from "../../assets/banner11.png";

const HeaderDesktop = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Search autocomplete state
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Debounce ref
  const debounceRef = useRef();

  const menuRef = useRef();
  const suggestionsRef = useRef();

  // بستن منوها هنگام کلیک بیرون
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // بستن منوها هنگام اسکرول
    const handleScroll = () => {
      setIsMenuOpen(false);
    };
    document.addEventListener("scroll", handleScroll);

    if (!showSuggestions) return;
    const q = searchTerm.trim();
    if (q.length < 2) {
      setSuggestions([]);
      return;
    }
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const { data } = await axiosInstance.get(
          `${API_URL}api/store/products/?title=${encodeURIComponent(q)}`
        );
        console.log(data);

        setSuggestions(data.results.slice(0, 3));
        console.log(suggestions);
      } catch {
        setSuggestions([]);
      }
    }, 300);

    return () => {
      clearTimeout(debounceRef.current);
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("scroll", handleScroll);
    };
  }, [searchTerm, showSuggestions]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setShowSuggestions(true);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const q = searchTerm.trim();
    if (q) {
      navigate(`/shop?search=${encodeURIComponent(q)}`);
      setShowSuggestions(false);
      setSearchTerm("");
    }
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        {/* آیکن‌ها */}
        <div className={styles.icons}>
          <Link to="/user-panel/cart">
            <span
              onClick={() => toggleCartPopup(!isCartOpen)}
              className={styles.cartIcon}
            >
              <FaCartShopping />
            </span>
          </Link>
        </div>
        <div className={styles.logoContainer}>
          <img src={image1} alt="کیمیاترنج" className={styles.logo} />
        </div>

        {/* دکمه ورود/ثبت نام */}
        <div className={styles.loginButton}>
          <Link to="/login">
            <button>ورود | ثبت نام</button>
          </Link>
        </div>

        {/* جعبه جستجو */}
        <div className={styles.searchContainer} ref={suggestionsRef}>
          <div className={styles.searchBox}>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder="جستجو کنید..."
            />
            <span className={styles.searchIcon}>
              <IoSearch />
            </span>
          </div>
          {showSuggestions && suggestions.length > 0 && (
            <ul className={styles.suggestionsList}>
              {suggestions.map((prod) => (
                <li
                  key={prod.id}
                  className={styles.suggestionItem}
                  onClick={() => {
                    // navigate or link to product details
                    navigate(`/productDetails/${prod.url_title}-${prod.id}`);
                    setShowSuggestions(false);
                    setSearchTerm("");
                  }}
                >
                  <Link to={`/productDetails/${prod.url_title}-${prod.id}`}>
                    {/* Show title and optionally price or collection */}
                    <div className={styles.suggestionTitle}>{prod.title}</div>
                    <div className={styles.suggestionMeta}>
                      {prod.collection?.title} •{" "}
                      {prod.variants[0]?.price.toLocaleString()} تومان
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* منوی همبرگر */}
        <div className={styles.hamburgerMenu}>
          <span onClick={() => setIsMenuOpen(true)}>
            <IoMenu />
          </span>
        </div>
      </div>

      {/* منوی بازشو همبرگری */}
      {isMenuOpen && (
        <div className={styles.overlay}>
          <div className={styles.menu} ref={menuRef}>
            <ul>
              <Link to="/">
                <li>
                  صفحه اصلی <FiHome />
                </li>
              </Link>
              <Link to="/about">
                <li>
                  درباره ما <BsFileEarmarkPerson />
                </li>
              </Link>
              <Link to="/">
                <li>
                  اخذ نمایندگی <TbDeviceIpadHorizontalStar />
                </li>
              </Link>
              <Link to="/shop">
                <li>
                  فروشگاه <IoBagOutline />
                </li>
              </Link>
              <Link to="/blog">
                <li>
                  مقالات <PiArticleBold />
                </li>
              </Link>
              <Link to="/gift-selector">
                <li>
                  کادو چی بخرم <GoGift />
                </li>
              </Link>
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default HeaderDesktop;
