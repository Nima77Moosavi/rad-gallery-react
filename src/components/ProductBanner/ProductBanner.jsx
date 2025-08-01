import React from "react";
import styles from "./ProductBanner.module.css";

const ProductBanner = ({ product }) => {
  if (!product) {
    return <div>Loading...</div>; // Handle case where no product is passed
  }

  return (
    <div className={styles.bannerContainer}>
      {/* Left Section: Product Image and Attributes */}
      <div className={styles.leftSection}>
        <img
          src={
            product.images.length > 0
              ? product.images[0].image
              : "/placeholder.jpg"
          }
          alt={product.title}
          className={styles.productImage}
        />
        <div className={styles.attributesContainer}>
          {product.variants.map((variant) =>
            variant.attributes.map((attribute) => (
              <div key={attribute.id} className={styles.attribute}>
                <span className={styles.attributeName}>
                  {attribute.attribute_name}:
                </span>
                <span className={styles.attributeValue}>{attribute.value}</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Section: Product Details and Add to Cart Button */}
      <div className={styles.rightSection}>
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productDescription}>{product.description}</p>

        <div className={styles.buttonContainer}>
          <button className={styles.addToCartButton}>افزودن به سبد خرید</button>
          <span className={styles.priceValue}>
            {product.variants[0]?.price} تومان
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProductBanner;
