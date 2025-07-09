import React from "react";
import styles from "./FeaturesLine.module.css";
import installmentPng from "../../assets/investment.png";
import truckPng from "../../assets/delivery-truck.png";
import returnPng from "../../assets/undo.png";
import shieldPng from "../../assets/security.png";

const FeaturesLine = () => {
  const items = [
    { icon: <img src={installmentPng} alt="قسط" className={styles.pngIcon} />, text: "خرید اقساطی", id: 1 },
    { icon: <img src={truckPng} alt="ارسال" className={styles.pngIcon} />, text: "ارسال رایگان به سراسر کشور", id: 2 },
    { icon: <img src={returnPng} alt="مرجوعی" className={styles.pngIcon} />, text: "ضمانت مرجوعی", id: 3 },
    { icon: <img src={shieldPng} alt="امنیت" className={styles.pngIcon} />, text: "ضمانت کیفیت و اصالت", id: 4 },
  ];

  return (
    <div className={styles.featuresContainer}>
      <div className={styles.featuresLine}>
        {items.map(({ icon, text, id }) => (
          <div key={id} className={styles.featureItem}>
            <div className={styles.featureIcon}>{icon}</div>
            <span className={styles.featureText}>{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturesLine;