import React, { useState, useEffect } from "react";
import styles from "./Banner.module.css"
import image1 from "../../assets/banner1.png";
import image3 from "../../assets/img.png";


const Banner = () => {

  const [isMobile, setIsMobile] = useState(false);

  return (
    <div className={styles.container}>
      <img src={image3} alt="" className={styles.dastImg}/>
      <img src={image1} alt="" className={styles.textImg}/>
    </div>
  )
}

export default Banner