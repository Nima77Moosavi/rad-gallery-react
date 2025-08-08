// src/components/SpecialOffer/SpecialOffer.jsx
import React from "react";
import styles from "./SpecialOffer.module.css";
import img from "../../assets/banner2.jpeg";
import img1 from "../../assets/banner23.jpeg";

const SpecialOffer = () => {
  return (
    <div className={styles.container}>
      <img src={img} alt="پیشنهاد ویژه ۱" className={styles.img} />
      <img src={img1} alt="پیشنهاد ویژه ۲" className={styles.img} />
      <img src={img} alt="پیشنهاد ویژه ۳" className={styles.img} />
    </div>
  );
};

export default SpecialOffer;