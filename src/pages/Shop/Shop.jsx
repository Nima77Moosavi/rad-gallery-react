import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { FiChevronDown, FiChevronRight, FiFilter } from "react-icons/fi";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ProductCard from "../../components/ProductCard/ProductCard";
import styles from "./Shop.module.css";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [nestedCollections, setNestedCollections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [expandedCollections, setExpandedCollections] = useState({});

  const [searchParams, setSearchParams] = useSearchParams();

  // تابع برای ساختاردهی سلسله‌مراتبی دسته‌بندی‌ها
  const buildNestedCollections = (flatCollections) => {
    if (!flatCollections || flatCollections.length === 0) return [];
    
    const map = {};
    const roots = [];
    
    flatCollections.forEach(collection => {
      map[collection.id] = { ...collection, children: [] };
    });
    
    flatCollections.forEach(collection => {
      if (collection.parent && map[collection.parent]) {
        map[collection.parent].children.push(map[collection.id]);
      } else {
        roots.push(map[collection.id]);
      }
    });
    
    return roots;
  };

  useEffect(() => {
    if (!searchParams.get("order_by")) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("order_by", "price");
      setSearchParams(newParams);
    }
  }, [searchParams, setSearchParams]);

  const buildQueryString = () => {
    const qs = searchParams.toString();
    return qs ? `?${qs}&page=${page}` : `?page=${page}`;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      try {
        const query = buildQueryString();
        const response = await fetch(
          `https://rad-gallery-api.liara.run/api/store/products/${query}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            setHasMore(false);
            setLoading(false);
            return;
          }
          throw new Error("مشکل در دریافت محصولات");
        }

        const data = await response.json();
        setError(null);

        if (page === 1) {
          setProducts(data.results);
        } else {
          setProducts((prevProducts) => [...prevProducts, ...data.results]);
        }

        setHasMore(data.results.length > 0);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [searchParams, page]);

  useEffect(() => {
    const fetchCollections = async () => {
      try {
        const response = await fetch(
          "https://rad-gallery-api.liara.run/api/store/collections/"
        );
        if (!response.ok) throw new Error("مشکل در دریافت مجموعه‌ها");
        const data = await response.json();
        setCollections(data);
        setNestedCollections(buildNestedCollections(data));
      } catch (err) {
        console.error("Error fetching collections:", err);
        setError(err.message);
      }
    };
    
    fetchCollections();
  }, []);

  const filterByCollection = (collectionTitle) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("collection", collectionTitle);
    setSearchParams(newParams);
    setProducts([]);
    setPage(1);
    setShowFilters(false);
  };

  const toggleCollection = (collectionId) => {
    setExpandedCollections(prev => ({
      ...prev,
      [collectionId]: !prev[collectionId]
    }));
  };

  const CollectionItem = ({ collection, level = 0 }) => {
    const hasChildren = collection.children && collection.children.length > 0;
    const isExpanded = expandedCollections[collection.id];
    
    return (
      <div key={collection.id} className={styles.collectionWrapper}>
        <div 
          className={`${styles.collectionItem} ${level > 0 ? styles.subCollection : ''}`}
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => {
            if (hasChildren) {
              toggleCollection(collection.id);
            } else {
              filterByCollection(collection.title);
            }
          }}
        >
          {hasChildren ? (
            <span className={styles.collectionToggle}>
              {isExpanded ? <FiChevronDown /> : <FiChevronRight />}
            </span>
          ) : (
            <span className={styles.collectionTogglePlaceholder} />
          )}
          
          <span className={`${styles.collectionName} ${isExpanded ? styles.activeCollection : ''}`}>
            {collection.title}
            {level === 0 && <span className={styles.collectionCount}>({collection.children?.length || 0})</span>}
          </span>
        </div>
        
        {hasChildren && isExpanded && (
          <div className={styles.subCollections}>
            {collection.children.map(child => (
              <CollectionItem 
                key={child.id} 
                collection={child} 
                level={level + 1} 
              />
            ))}
          </div>
        )}
      </div>
    );
  };

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
      <Header />
      <div className={styles.content}>
        <h2 className={styles.title}>فروشگاه</h2>
        
        {/* Mobile filters */}
        <div className={styles.filterDropdownMobile}>
          <button
            className={styles.filterToggleButton}
            onClick={() => setShowFilters(!showFilters)}
          >
            <FiFilter />
            {showFilters ? "بستن فیلتر" : "فیلترها"}
          </button>
          {showFilters && (
            <div className={styles.dropdownFilters}>
              <div className={styles.filterSection}>
                <h2 className={styles.sectionTitle}>
                  <FiChevronDown />
                  دسته‌بندی‌ها
                </h2>
                <div className={styles.collectionsList}>
                  {nestedCollections.length > 0 ? (
                    nestedCollections.map(collection => (
                      <CollectionItem key={collection.id} collection={collection} />
                    ))
                  ) : (
                    <p className={styles.noCollections}>دسته‌بندی‌ای یافت نشد</p>
                  )}
                </div>
              </div>
              
              <div className={styles.filterSection}>
                <h2 className={styles.sectionTitle}>
                  <FiChevronDown />
                  مرتب‌سازی
                </h2>
                <div className={styles.sortOptions}>
                  <button 
                    onClick={sortCheapest} 
                    className={`${styles.sortButton} ${searchParams.get("order_by") === "price" ? styles.activeSort : ''}`}
                  >
                    ارزان‌ترین
                  </button>
                  <button 
                    onClick={sortExpensive} 
                    className={`${styles.sortButton} ${searchParams.get("order_by") === "-price" ? styles.activeSort : ''}`}
                  >
                    گران‌ترین
                  </button>
                </div>
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
            {loading && <div className={styles.loading}>در حال بارگذاری...</div>}
            {error && <div className={styles.error}>خطا: {error}</div>}
            {!loading && products.length === 0 && (
              <div className={styles.empty}>هیچ محصولی یافت نشد.</div>
            )}
            {!loading && !hasMore && products.length > 0 && (
              <div className={styles.endMessage}>
                هیچ محصول بیشتری موجود نیست
              </div>
            )}
          </div>

          {/* Desktop filters */}
          <div className={styles.sidebarContainer}>
            <div className={styles.sidebarInner}>
              <div className={styles.filterSection}>
                <h2 className={styles.sectionTitle}>
                  <FiChevronDown />
                  دسته‌بندی‌ها
                </h2>
                <div className={styles.collectionsList}>
                  {nestedCollections.length > 0 ? (
                    nestedCollections.map(collection => (
                      <CollectionItem key={collection.id} collection={collection} />
                    ))
                  ) : (
                    <p className={styles.noCollections}>دسته‌بندی‌ای یافت نشد</p>
                  )}
                </div>
              </div>
              
              <div className={styles.filterSection}>
                <h2 className={styles.sectionTitle}>
                  <FiChevronDown />
                  مرتب‌سازی
                </h2>
                <div className={styles.sortOptions}>
                  <button 
                    onClick={sortCheapest} 
                    className={`${styles.sortButton} ${searchParams.get("order_by") === "price" ? styles.activeSort : ''}`}
                  >
                    ارزان‌ترین
                  </button>
                  <button 
                    onClick={sortExpensive} 
                    className={`${styles.sortButton} ${searchParams.get("order_by") === "-price" ? styles.activeSort : ''}`}
                  >
                    گران‌ترین
                  </button>
                </div>
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