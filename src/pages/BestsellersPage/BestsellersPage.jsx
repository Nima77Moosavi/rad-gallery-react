import React, { useState, useEffect, useRef } from "react";
import styles from "./BestsellersPage.module.css";
import Header from "../../components/Header/Header";
import Footer from '../../components/Footer/Footer'
import ProductCard from "../../components/ProductCard/ProductCard";

const BestsellersPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/store/products/"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setProducts(data.results);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/store/collections/"
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setCollections(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <div>
      <div className={styles.circle}></div>
      <Header />
      <h2 className={styles.title}>محصولات پرفروش</h2>
      <div className={styles.container}>
        <div className={styles.productContainer}>
            {products.map((product) => (
                <ProductCard product={product} key={product.id} />    
            ))}
        </div>
        <div className={styles.sidebarContainer}>
          <div className={styles.collections}>
            <h2 className={styles.collectionsTitle}>همه محصولات پرفروش</h2>
            {collections.map((collection) => (
            <p key={collection.id}>{collection.title}</p>    
            ))}
          </div>
          <div className={styles.sort}>
            <h2 className={styles.sortTitle}>مرتب کردن بر اساس</h2>
            <p>ارزان ترین</p>
            <p>گرانترین</p>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default BestsellersPage;
