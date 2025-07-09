import React from 'react'
import styles from './HomePageHeader.module.css'
import image1 from "../../assets/banner1.png";
import image3 from "../../assets/img.png";


const HomePageHeader = () => {
  return (
    <div className={styles.images}>
    <img src={image3} alt="Image 3" className={styles.dast} />
    <img src={image1} alt="Image 1" className={styles.txt1} />
  </div>
  )
}

export default HomePageHeader