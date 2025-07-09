import { GoHeart, GoHeartFill } from "react-icons/go";
import { IoShareSocialSharp } from "react-icons/io5";
import { BiSolidOffer } from "react-icons/bi";
import styles from "./IconsBox.module.css";

const IconsBox = ({ isLiked, onLikeClick }) => {
  return (
    <div className={styles.iconsContainer}>
      {isLiked ? (
        <GoHeartFill onClick={onLikeClick} className={styles.icon} />
      ) : (
        <GoHeart onClick={onLikeClick} className={styles.icon} />
      )}
      <IoShareSocialSharp className={styles.icon} />
      <BiSolidOffer className={styles.icon} />
    </div>
  );
};

export default IconsBox;