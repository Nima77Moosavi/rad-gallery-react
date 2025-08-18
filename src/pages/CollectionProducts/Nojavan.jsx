import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./nojavan.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/ProductCard/ProductCard.Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import Filters from "./Filters";

const NojavanProducts = () => {
  const NOJAVAN_COLLECTION_ID = 123; // ID دسته‌بندی نوجوان را اینجا قرار دهید
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // دریافت اطلاعات دسته‌بندی نوجوان
      const collectionRes = await fetch(
        `https://rad-gallery-api.liara.run/api/store/collections/${NOJAVAN_COLLECTION_ID}/`
      );
      if (!collectionRes.ok) throw new Error("خطا در دریافت اطلاعات دسته‌بندی نوجوان");
      
      const collectionData = await collectionRes.json();
      setCollection(collectionData);

      // دریافت محصولات نوجوان
      const productsRes = await fetch(
        `https://rad-gallery-api.liara.run/api/store/products/?collection_id=${NOJAVAN_COLLECTION_ID}`
      );
      if (!productsRes.ok) throw new Error("خطا در دریافت محصولات نوجوان");
      
      const productsData = await productsRes.json();
      const productsArray = Array.isArray(productsData.results) 
        ? productsData.results 
        : Array.isArray(productsData) 
          ? productsData 
          : [];

      setAllProducts(productsArray);
    } catch (err) {
      setError(err.message || "خطا در دریافت اطلاعات");
      console.error("خطای دریافت:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];

    let result = [...allProducts];

    // فیلتر قیمت
    if (priceRange !== "all") {
      result = result.filter(product => {
        const price = product.variants?.[0]?.price 
          ? Number(product.variants[0].price) 
          : 0;
        
        switch (priceRange) {
          case "under-50": return price < 50000;
          case "50-100": return price >= 50000 && price <= 100000;
          case "100-200": return price > 100000 && price <= 200000;
          case "over-200": return price > 200000;
          default: return true;
        }
      });
    }

    // مرتب‌سازی
    return result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      const priceA = a.variants?.[0]?.price ? Number(a.variants[0].price) : 0;
      const priceB = b.variants?.[0]?.price ? Number(b.variants[0].price) : 0;

      switch (sortOption) {
        case "newest": return dateB - dateA;
        case "oldest": return dateA - dateB;
        case "price-high": return priceB - priceA;
        case "price-low": return priceA - priceB;
        default: return 0;
      }
    });
  }, [allProducts, sortOption, priceRange]);

  const handleSortChange = useCallback((value) => {
    setSortOption(value);
  }, []);

  const handlePriceFilterChange = useCallback((value) => {
    setPriceRange(value);
  }, []);

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.error}>{error}</div>
        <button onClick={() => navigate(-1)} className={styles.backButton}>
          بازگشت به صفحه قبل
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.header}>
        <h1 className={styles.title}>محصولات نوجوان</h1>
        {collection?.description && (
          <p className={styles.description}>{collection.description}</p>
        )}
      </div>

      <Filters 
        sortOption={sortOption}
        priceRange={priceRange}
        onSortChange={handleSortChange}
        onPriceFilterChange={handlePriceFilterChange}
      />

      {loading ? (
        <div className={styles.productsGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.empty}>
          هیچ محصولی در دسته‌بندی نوجوان یافت نشد.
        </div>
      ) : (
        <div className={styles.productsGrid}>
          {filteredProducts.map(product => (
            <ProductCard 
              key={product.id} 
              product={{
                ...product,
                price: product.variants?.[0]?.price || "0",
                image: product.images?.[0]?.image || ""
              }} 
              onClick={() => navigate(`/product/${product.id}`)}
            />
          ))}
        </div>
      )}
      <Footer />
    </div>
  );
};

export default React.memo(NojavanProducts);