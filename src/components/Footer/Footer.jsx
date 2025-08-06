import React from "react";
import styles from "./Footer.module.css";

import { BsChatTextFill } from "react-icons/bs";
import { IoCallSharp } from "react-icons/io5";
import { AiFillInstagram } from "react-icons/ai";
import { RiWhatsappFill } from "react-icons/ri";
import EnamadSeal from "../EnamadSeal/EnamadSeal";

// تابع تبدیل اعداد انگلیسی به فارسی
const toPersianNumber = (num) => {
  const persianNumbers = ["۰", "۱", "۲", "۳", "۴", "۵", "۶", "۷", "۸", "۹"];
  return num.toString().replace(/\d/g, (x) => persianNumbers[x]);
};

const Footer = () => {
  return (
    <div className={styles.container}>
      <div className={styles.adresses}>
        <h2 className={styles.title}>آدرس حضوری</h2>
        <p>کارگاه تولیدی: اصفهان , شهرک نگین , خبابان صدر شمالی , کوچه امید</p>
      </div>
      <div className={styles.contactUs}>
        <h2 className={styles.title}>تماس با ما</h2>
        <p>شماره تماس : {toPersianNumber("09174189802")}</p>
      </div>
      <div className={styles.acricles}>
        <h2 className={styles.title}> مقالات برتر</h2>
        <p>نگه داری از سماور زغالی</p>
        <p> آیینه شمعدان طرح نقره چگونه است؟</p>
        <p> سرمایه گذاری روی صنایع دستی</p>
        <p>خاتم کاری اصفهان</p>
      </div>

      

      <div className={styles.socials}>
        <h2 className={styles.title}> راه های ارتباطی</h2>
        <BsChatTextFill className={styles.icon} />
        <IoCallSharp className={styles.icon} />
        <AiFillInstagram className={styles.icon} />
        <RiWhatsappFill className={styles.icon} />
      </div>
      <div className={styles.enamadWrapper}>
        <EnamadSeal />
      </div>
    </div>
  );
};

export default Footer;
