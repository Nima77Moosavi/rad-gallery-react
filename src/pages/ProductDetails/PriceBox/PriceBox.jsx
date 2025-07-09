import { AiOutlineSafety } from "react-icons/ai";
import { TbShieldStar } from "react-icons/tb";
import { BsBoxSeam } from "react-icons/bs";
import styles from "./PriceBox.module.css";

const PriceBox = ({ price, onAddToCart, inventoryText }) => {
  return (
    <div className={styles.priceContainer}>
      <p>
        بازگشت محصول تا 7 روز طبق شرایط مرجوعی
        <AiOutlineSafety className={styles.icon} />
      </p>
      <p>
        گارانتی ضمانت اصالت و سلامت فیزیکی کالا
        <TbShieldStar className={styles.icon} />
      </p>
      <p className={styles.inventory}>
        {inventoryText}
        <BsBoxSeam className={styles.icon} />
      </p>
      <button className={styles.price}>{price} تومان</button>
      <button className={styles.addToCart} onClick={onAddToCart}>
        افزودن به سبد خرید
      </button>
    </div>
  );
};

export default PriceBox;