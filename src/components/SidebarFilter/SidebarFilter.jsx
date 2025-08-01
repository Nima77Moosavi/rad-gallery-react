import React, { useEffect } from "react";
import styles from "./SidebarFilter.module.css";

const SidebarFilter = ({
  attributes,
  selectedAttributes,
  setSelectedAttributes,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  onFilterChange,
}) => {
  const handleAttributeChange = (attribute, value) => {
    setSelectedAttributes((prev) => {
      const updated = { ...prev };
      if (!updated[attribute]) {
        updated[attribute] = [];
      }
      // Toggle the value immutably
      if (updated[attribute].includes(value)) {
        updated[attribute] = updated[attribute].filter(
          (item) => item !== value
        );
      } else {
        updated[attribute] = [...updated[attribute], value];
      }
      return updated;
    });
  };

  useEffect(() => {
    // For each attribute, build individual "key:value" pairs
    const attributeFilter = Object.entries(selectedAttributes)
      .flatMap(([key, values]) => values.map((val) => `${key}:${val}`))
      .join(",");

    const filterParams = {
      attribute: attributeFilter,
      min_price: minPrice,
      max_price: maxPrice,
    };

    onFilterChange(filterParams);
  }, [selectedAttributes, minPrice, maxPrice, onFilterChange]);

  return (
    <div className={styles.sidebar}>
      <h3>فیلتر محصولات</h3>
      {attributes.map((attr) => (
        <div key={attr.id} className={styles.filterSection}>
          <h4>{attr.name}</h4>
          {attr.values.map((val) => (
            <label key={val.id} className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={
                  selectedAttributes[attr.name]?.includes(val.value) || false
                }
                onChange={() => handleAttributeChange(attr.name, val.value)}
              />
              {val.value}
            </label>
          ))}
        </div>
      ))}
      <div className={styles.filterSection}>
        <h4>قیمت</h4>
        <input
          type="number"
          placeholder="حداقل قیمت"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="حداکثر قیمت"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
      </div>
    </div>
  );
};

export default SidebarFilter;
