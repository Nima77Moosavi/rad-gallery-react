import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { MdLocalOffer } from "react-icons/md";
import { GrFormPrevious, GrFormNext } from "react-icons/gr";
import ProductCard from "../ProductCard/ProductCard";
import ProductCardSkeleton from "../ProductCard/ProductCard.Skeleton"; // import اسکلتون
import styles from "./SpecialProducts.module.css";

const SpecialProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const sliderRef = useRef(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          "https://rad-gallery-api.liara.run/api/store/products/"
        );
        if (!res.ok) throw new Error("Network error");
        const { results } = await res.json();
        setProducts(results.slice(0, 10));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  const slide = (dir) => {
    const wrapper = sliderRef.current;
    if (!wrapper) return;
    const slider = wrapper.querySelector(`.${styles.slider}`);
    const first = slider?.children[0];
    if (!first) return;

    const itemW = first.getBoundingClientRect().width;
    const gap = parseFloat(getComputedStyle(slider).gap) || 0;

    wrapper.scrollBy({
      left: (itemW + gap) * dir,
      behavior: "smooth",
    });
  };

  if (error) return <div className={styles.error}>خطا: {error}</div>;

  return (
    <div className={styles.container}>
      {/* HEADER */}
      <div className={styles.header}>
        <div className={styles.titleContainer}>
          <h2 className={styles.title}>محصولات تخفیف دار</h2>
          <MdLocalOffer className={styles.icon} />
          <span className={styles.percent}>%</span>
        </div>
        <Link to="/shop" className={styles.shopLink}>
          مشاهده همه محصولات
        </Link>
      </div>

      {/* SLIDER */}
      <div className={styles.sliderWrapper} ref={sliderRef}>
        <button
          className={styles.arrowLeft}
          onClick={() => slide(1)}
          aria-label="قبلی"
        >
          <GrFormNext />
        </button>
        <button
          className={styles.arrowRight}
          onClick={() => slide(-1)}
          aria-label="بعدی"
        >
          <GrFormPrevious />
        </button>
        <div className={styles.slider}>
          {loading
            ? // نمایش اسکلتون‌ها در حالت لودینگ
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className={styles.slideItem}>
                    <ProductCardSkeleton />
                  </div>
                ))
            : // نمایش محصولات واقعی پس از لودینگ
              products.map((product) => (
                <div key={product.id} className={styles.slideItem}>
                  <ProductCard product={product} />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export default SpecialProducts;