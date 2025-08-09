import React, { useCallback } from "react";
import styles from "./CollectionProducts.module.css";

const Filters = ({ 
  sortOption, 
  priceRange, 
  onSortChange, 
  onPriceFilterChange 
}) => {
  const handleSortChange = useCallback((e) => {
    onSortChange(e.target.value);
  }, [onSortChange]);

  const handlePriceFilterChange = useCallback((e) => {
    onPriceFilterChange(e.target.value);
  }, [onPriceFilterChange]);

  return (
    <div className={styles.filters}>
      <div className={styles.filterGroup}>
        <label htmlFor="sort">مرتب‌سازی:</label>
        <select
          id="sort"
          value={sortOption}
          onChange={handleSortChange}
          className={styles.select}
        >
          <option value="newest">جدیدترین</option>
          <option value="oldest">قدیمی‌ترین</option>
          <option value="price-high">گران‌ترین</option>
          <option value="price-low">ارزان‌ترین</option>
        </select>
      </div>

      <div className={styles.filterGroup}>
        <label htmlFor="price">فیلتر قیمت:</label>
        <select
          id="price"
          value={priceRange}
          onChange={handlePriceFilterChange}
          className={styles.select}
        >
          <option value="all">همه قیمت‌ها</option>
          <option value="under-50">زیر 50 هزار تومان</option>
          <option value="50-100">50 تا 100 هزار تومان</option>
          <option value="100-200">100 تا 200 هزار تومان</option>
          <option value="over-200">بالای 200 هزار تومان</option>
        </select>
      </div>
    </div>
  );
};

export default React.memo(Filters);
