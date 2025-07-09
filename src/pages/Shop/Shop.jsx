import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Shop.module.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  // Get and update query parameters.
  const [searchParams, setSearchParams] = useSearchParams();

  // Set a default ordering (cheapest first) if not set.
  useEffect(() => {
    if (!searchParams.get("order_by")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("order_by", "price");
      setSearchParams(newParams);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Helper: build query string from searchParams and current page.
  const buildQueryString = () => {
    const qs = searchParams.toString();
    return qs ? `?${qs}&page=${page}` : `?page=${page}`;
  };

  // Fetch products when search parameters or page changes.
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const query = buildQueryString();
        const response = await fetch(
          `https://kimiatoranj-api.liara.run/api/store/products/${query}`
        );

        // If a 404 is returned (often meaning no more products), set hasMore to false.
        if (!response.ok) {
          if (response.status === 404) {
            setHasMore(false);
            setLoading(false);
            return;
          }
          throw new Error("مشکل در دریافت محصولات");
        }

        const data = await response.json();

        // Clear any previous error on a successful fetch.
        setError(null);

        if (page === 1) {
          setProducts(data.results);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.results]);
        }

        // If no products were returned, assume there are no further pages.
        if (data.results.length === 0) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, page]);

  // Fetch collections for filtering (only once).
  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/store/collections/"
        );
        if (!response.ok) throw new Error("مشکل در دریافت مجموعه‌ها");
        const data = await response.json();
        setCollections(data);
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
    };
    fetchCollections();
  }, []);

  // When filtering by collection, update query parameters and reset product list.
  const filterByCollection = (collectionTitle) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("collection", collectionTitle);
    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setShowFilters(false);
  };

  // Handlers for sorting.
  const sortCheapest = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", "price");
    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setShowFilters(false);
  };

  const sortExpensive = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("order_by", "-price");
    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setShowFilters(false);
  };

  // Intersection Observer for lazy loading of additional pages.
  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  return (
    <div>
      <div className={styles.circle}></div>
      <Header />
      <div className={styles.content}>
        <h2 className={styles.title}>فروشگاه</h2>
        <div className={styles.filterDropdownMobile}>
          <button
            className={styles.filterToggleButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? "بستن فیلتر" : "فیلترها"}
          </button>
          {showFilters && (
            <div className={styles.dropdownFilters}>
              <div className={styles.collections}>
                <h2 className={styles.collectionsTitle}>
                  فیلتر بر اساس مجموعه
                </h2>
                {collections.map((collection) => (
                  <p
                    key={collection.id}
                    onClick={() => filterByCollection(collection.title)}
                    className={styles.collectionFilter}
                  >
                    {collection.title}
                  </p>
                ))}
              </div>
              <div className={styles.sort}>
                <h2 className={styles.sortTitle}>مرتب کردن بر اساس</h2>
                <p onClick={sortCheapest} className={styles.sortOption}>
                  ارزان‌ترین
                </p>
                <p onClick={sortExpensive} className={styles.sortOption}>
                  گران‌ترین
                </p>
              </div>
            </div>
          )}
        </div>
        <div className={styles.container}>
          <div className={styles.productContainer}>
            {products.map((product, index) => {
              if (products.length === index + 1) {
                return (
                  <div ref={lastProductElementRef} key={product.id}>
                    <ProductCard product={product} />
                  </div>
                );
              } else {
                return <ProductCard product={product} key={product.id} />;
              }
            })}
            {loading && (
              <div className={styles.loading}>در حال بارگذاری...</div>
            )}
            {error && <div className={styles.error}>خطا: {error}</div>}
            {/* Render "empty" message if no product is found on page 1 */}
            {!loading && products.length === 0 && (
              <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
            )}
            {/* If products exist and hasMore is false, display end-of-content message */}
            {!loading && !hasMore && products.length > 0 && (
              <div className={styles.endMessage}>
                هیچ محصول بیشتری موجود نیست
              </div>
            )}
          </div>

          {/* Desktop sidebar for filters */}
          <div className={styles.sidebarContainer}>
            <div className={styles.sidebarInner}>
              <div className={styles.collections}>
                <h2 className={styles.collectionsTitle}>
                  فیلتر بر اساس مجموعه
                </h2>
                {collections.map((collection) => (
                  <p
                    key={collection.id}
                    onClick={() => filterByCollection(collection.title)}
                    className={styles.collectionFilter}
                  >
                    {collection.title}
                  </p>
                ))}
              </div>
              <div className={styles.sort}>
                <h2 className={styles.sortTitle}>مرتب کردن بر اساس</h2>
                <p onClick={sortCheapest} className={styles.sortOption}>
                  ارزان‌ترین
                </p>
                <p onClick={sortExpensive} className={styles.sortOption}>
                  گران‌ترین
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Shop;
