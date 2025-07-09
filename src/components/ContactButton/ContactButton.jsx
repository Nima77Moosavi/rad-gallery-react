// src/components/ContactButton/ContactButton.jsx
import React, { useState } from "react";
import {
  FaTelegramPlane,
  FaWhatsapp,
  FaPhoneAlt,
  FaInstagram,
} from "react-icons/fa";
import styles from "./ContactButton.module.css";

const ContactButton = () => {
  const [open, setOpen] = useState(false);
  const toggleOptions = () => setOpen((prev) => !prev);

  return (
    <div className={`${styles.contactContainer} ${open ? styles.open : ""}`}>
      <button className={styles.contactMainButton} onClick={toggleOptions}>
        <span>تماس با ما</span>
      </button>

      <a
        href="https://t.me/+989130095238"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactOption} ${styles.option1}`}
      >
        <FaTelegramPlane size={22} />
      </a>

      <a
        href="https://wa.me/989130095238"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactOption} ${styles.option2}`}
      >
        <FaWhatsapp size={22} />
      </a>

      <a
        href="tel:989920784900"
        className={`${styles.contactOption} ${styles.option3}`}
      >
        <FaPhoneAlt size={22} />
      </a>

      <a
        href="https://instagram.com/kimia.toranj"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.contactOption} ${styles.option4}`}
      >
        <FaInstagram size={22} />
      </a>
    </div>
  );
};

export default ContactButton;
