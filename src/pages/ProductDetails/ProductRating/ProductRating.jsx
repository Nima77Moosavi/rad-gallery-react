// components/ProductRating/ProductRating.jsx
import { FaStar } from "react-icons/fa";
import styles from "./ProductRating.module.css";

const ProductRating = ({ rating = 4 }) => {
  // تابع تبدیل اعداد به فارسی
  const toPersianNumber = (num) => {
    return new Intl.NumberFormat('fa-IR').format(num);
  };

  // داده‌های پیش‌فرض برای نمودار امتیازها
  const ratingData = [
    { stars: 1, value: 0 },
    { stars: 2, value: 20 },
    { stars: 3, value: 0 },
    { stars: 4, value: 80 },
    { stars: 5, value: 70 },
  ];

  return (
    <div className={styles.rateContainer}>
      <div className={styles.rightPart}>
        {ratingData.map((item) => (
          <p key={item.stars}>
            {toPersianNumber(item.stars)} {/* تبدیل عدد به فارسی */}
            <FaStar className={styles.icon} />
            <progress
              value={item.value}
              max={100}
              className={styles.progress}
            />
          </p>
        ))}
      </div>
      <div className={styles.leftPart}>
        <p>{toPersianNumber(rating)}</p> {/* تبدیل عدد به فارسی */}
      </div>
    </div>
  );
};

export default ProductRating;