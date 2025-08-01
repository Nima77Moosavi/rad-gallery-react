import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./GiftSelector.module.css";

const GiftSelector = () => {
  // Define the available price ranges with the updated labels:
  const priceRanges = [
    { label: "کمتر از یک میلیون", min: 0, max: 1000000 },
    { label: "از یک تا پنج میلیون", min: 1000000, max: 5000000 },
    { label: "از پنج تا ده میلیون", min: 5000000, max: 10000000 },
    { label: "بالاتر از ده میلیون", min: 10000000, max: "max" },
  ];

  const [selectedRange, setSelectedRange] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedRange) return;

    const range = priceRanges.find((r) => r.label === selectedRange);
    if (range) {
      let query = `?min_price=${range.min}`;
      // If max is a number (not our placeholder "max"), include it in the query.
      if (range.max !== "max") {
        query += `&max_price=${range.max}`;
      }
      // Navigate to your shop page with the price range query applied.
      navigate(`/shop${query}`);
    }
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>کادو چی بخرم؟</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        {priceRanges.map((range) => (
          <div key={range.label} className={styles.radioOption}>
            <input
              type="radio"
              id={range.label}
              name="priceRange"
              value={range.label}
              onChange={(e) => setSelectedRange(e.target.value)}
            />
            <label htmlFor={range.label}>{range.label}</label>
          </div>
        ))}
        <button type="submit" className={styles.submitButton}>
          تایید
        </button>
      </form>
    </div>
  );
};

export default GiftSelector;
