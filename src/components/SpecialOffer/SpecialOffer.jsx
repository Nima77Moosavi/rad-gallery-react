// src/components/SpecialOffer/SpecialOffer.jsx
import React from "react";
import styles from "./SpecialOffer.module.css";
import img from "../../assets/special.png";

// Helper: replaces Latin digits with Persian ones
const toPersianDigits = (str) =>
  str.toString().replace(/\d/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[d]);

const SpecialOffer = () => {
  // numeric values
  const price = 113000000;
  const plateDiameter = 50;
  const bowlDiameter = 34;
  const bowlHeight = 23;

  return (
    <div className={styles.container}>
      {/* Right side */}
      <div className={styles.rightDiv}>
        <h1 className={styles.title}>کاسه بشقاب لاله</h1>
        <p className={styles.description}>
          <span>کار فاخر و خاص
          , جنس محصول برنج ضخیم
          , قمزنی صورت با روکش قلع
          , دور رنگ کارشده و تماما دست ساز
          دارای شناسنامه
          </span>

          <span>
            قطر بشقاب {toPersianDigits(plateDiameter)} سانتی‌متر،
            دهانه کاسه {toPersianDigits(bowlDiameter)} سانتی‌متر،
            ارتفاع {toPersianDigits(bowlHeight)} سانتی‌متر
          </span>
        </p>
        <div className={styles.priceContainer}>
          <button className={styles.price}>
            {toPersianDigits(price.toLocaleString("en-US"))} تومان
          </button>
          <button className={styles.addtocard}>
            افزودن به سبد خرید
          </button>
        </div>
      </div>

      {/* Left side */}
      <div className={styles.leftDiv}>
        <img src={img} alt="" className={styles.img} />
        <div className={styles.attrContainer}>
          <div className={styles.attr1}>
            قلم {toPersianDigits("صورت")}
          </div>
          <div className={styles.attr2}>
            قطر {toPersianDigits(plateDiameter)} cm
          </div>
          <div className={styles.attr3}>نقش و نگار زیبا</div>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
