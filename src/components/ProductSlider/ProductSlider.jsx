import React, { useState } from "react";
import styles from "./ProductSlider.module.css";
import ProductCard from "../ProductCard/ProductCard";

const BASE_URL = "https://kimiatoranj-api.liara.run/api/"; // Ensure you set the correct backend URL

const ProductSlider = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const productsPerPage = 5; // Number of products to show at a time

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + productsPerPage >= products.length
        ? 0
        : prevIndex + productsPerPage
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - productsPerPage < 0
        ? products.length -
          (products.length % productsPerPage || productsPerPage)
        : prevIndex - productsPerPage
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index * productsPerPage);
  };

  // Calculate the total number of slides
  const totalSlides = Math.ceil(products.length / productsPerPage);

  // Get the current products to display
  const currentProducts = products.slice(
    currentIndex,
    currentIndex + productsPerPage
  );

  // Pad the currentProducts array with empty placeholders if necessary
  const paddedProducts = [...currentProducts];
  while (paddedProducts.length < productsPerPage) {
    paddedProducts.push({
      id: `placeholder-${paddedProducts.length}`,
      isEmpty: true,
    });
  }

  return (
    <div className={styles.productSlider}>
      <div className={styles.sliderContent}>
        {paddedProducts.map((product) =>
          product.isEmpty ? (
            <div key={product.id} className={styles.productCard}></div>
          ) : (
            <ProductCard key={product.id} product={product} />
          )
        )}
      </div>

      <div className={styles.dotsContainer}>
        {Array.from({ length: totalSlides }).map((_, index) => (
          <span
            key={index}
            className={`${styles.dot} ${
              currentIndex === index * productsPerPage ? styles.activeDot : ""
            }`}
            onClick={() => goToSlide(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default ProductSlider;
