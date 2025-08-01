import React, { useState } from 'react';
import { BsBoxSeam } from "react-icons/bs";
import styles from "./PriceBox.module.css";

const PriceBox = () => {
  // داده‌های نمونه
  const price = "۲,۴۹۰,۰۰۰";
  const inventoryText = "موجود در انبار - ارسال امروز";
  const sizes = ["S", "M", "L", "XL", "XXL"];
  const colors = ["مشکی", "سفید", "آبی", "نقره‌ای"];
  
  // حالت‌های انتخابی
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert("لطفاً سایز و رنگ محصول را انتخاب کنید");
      return;
    }
    alert(`محصول با مشخصات:\nسایز: ${selectedSize}\nرنگ: ${selectedColor}\nبه سبد خرید اضافه شد`);
  };

  return (
    <div className={styles.priceCard}>
      {/* بخش انتخاب سایز */}
      <div className={styles.selectorGroup}>
        <label htmlFor="size-select" className={styles.selectorLabel}>
          <span className={styles.selectorTitle}>انتخاب سایز</span>
          <select
            id="size-select"
            className={styles.selector}
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
          >
            <option value="">-- سایز را انتخاب کنید --</option>
            {sizes.map((size) => (
              <option 
                key={size} 
                value={size}
                className={styles.dropdownOption}
              >
                {size}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* بخش انتخاب رنگ */}
      <div className={styles.selectorGroup}>
        <label htmlFor="color-select" className={styles.selectorLabel}>
          <span className={styles.selectorTitle}>انتخاب رنگ</span>
          <select
            id="color-select"
            className={styles.selector}
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
          >
            <option value="">-- رنگ را انتخاب کنید --</option>
            {colors.map((color) => (
              <option 
                key={color} 
                value={color}
                className={styles.dropdownOption}
              >
                {color}
              </option>
            ))}
          </select>
        </label>
      </div>

      {/* بخش اطلاعات قیمت و موجودی */}
      <div className={styles.infoSection}>
        <div className={styles.inventoryBadge}>
          <BsBoxSeam className={styles.inventoryIcon} />
          <span className={styles.inventoryText}>{inventoryText}</span>
        </div>
        <div className={styles.priceTag}>{price} تومان</div>
      </div>

      {/* دکمه افزودن به سبد خرید */}
      <button 
        className={styles.ctaButton}
        onClick={handleAddToCart}
        disabled={!selectedSize || !selectedColor}
      >
        افزودن به سبد خرید
      </button>
    </div>
  );
};

export default PriceBox;