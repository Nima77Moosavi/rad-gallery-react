import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./CollectionProducts.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/ProductCard/ProductCard.Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const CollectionProducts = () => {
  const { collectionId } = useParams();
  const navigate = useNavigate();
  const [collection, setCollection] = useState(null);
  const [directSubCollections, setDirectSubCollections] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedSubCollection, setSelectedSubCollection] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Fetch collections data
      const collectionsRes = await fetch(
        `https://rad-gallery-api.liara.run/api/store/collections/`
      );
      if (!collectionsRes.ok) throw new Error("Failed to fetch collections");
      
      const collectionsData = await collectionsRes.json();
      const collectionsArray = Array.isArray(collectionsData.results) 
        ? collectionsData.results 
        : Array.isArray(collectionsData) 
          ? collectionsData 
          : [];

      // 2. Find current collection and its sub-collections
      const currentCollection = collectionsArray.find(
        c => c.id === parseInt(collectionId)
      );
      if (!currentCollection) throw new Error("Collection not found");
      
      const subs = collectionsArray.filter(c => {
        const parentId = c.parent?.id || c.parent;
        return parentId === parseInt(collectionId);
      });

      setCollection(currentCollection);
      setDirectSubCollections(subs);

      // 3. Fetch products for this collection and its sub-collections
      const collectionTreeIds = [
        parseInt(collectionId),
        ...subs.map(sub => sub.id)
      ];

      // Fetch products for each collection in parallel
      const productPromises = collectionTreeIds.map(async (id) => {
        const res = await fetch(
          `https://rad-gallery-api.liara.run/api/store/products/?collection_id=${id}`
        );
        if (!res.ok) throw new Error(`Failed to fetch products for collection ${id}`);
        const data = await res.json();
        return Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
      });

      const productsArrays = await Promise.all(productPromises);
      const mergedProducts = productsArrays.flat();

      // Remove duplicates (in case a product is in multiple collections)
      const uniqueProducts = mergedProducts.filter(
        (product, index, self) => index === self.findIndex(p => p.id === product.id)
      );

      setAllProducts(uniqueProducts);
    } catch (err) {
      setError(err.message || "خطا در دریافت اطلاعات");
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, [collectionId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];

    let result = [...allProducts];

    // Apply subcollection filter
    if (selectedSubCollection) {
      result = result.filter(product => {
        const productCollectionId = product.collection_id || product.collection?.id || product.collection;
        return productCollectionId && parseInt(productCollectionId) === parseInt(selectedSubCollection);
      });
    }

    // Apply price filter
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

    // Apply sorting
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
  }, [allProducts, selectedSubCollection, sortOption, priceRange]);

  const handleSortChange = useCallback((e) => {
    setSortOption(e.target.value);
  }, []);

  const handlePriceFilterChange = useCallback((e) => {
    setPriceRange(e.target.value);
  }, []);

  const handleSubCollectionSelect = useCallback((subCollectionId) => {
    setSelectedSubCollection(prev => 
      prev === subCollectionId ? null : subCollectionId
    );
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
        <h1 className={styles.title}>{collection?.title}</h1>
        {collection?.description && (
          <p className={styles.description}>{collection.description}</p>
        )}
      </div>

      {directSubCollections.length > 0 && (
        <div className={styles.subCollections}>
          <h3>زیردسته‌های {collection?.title}:</h3>
          <div className={styles.subCollectionList}>
            <button
              className={`${styles.subCollectionButton} ${
                !selectedSubCollection ? styles.active : ""
              }`}
              onClick={() => handleSubCollectionSelect(null)}
            >
              همه محصولات
            </button>
            {directSubCollections.map(sub => (
              <button
                key={sub.id}
                className={`${styles.subCollectionButton} ${
                  selectedSubCollection === sub.id ? styles.active : ""
                }`}
                onClick={() => handleSubCollectionSelect(sub.id)}
              >
                {sub.title}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className={styles.filters}>
        <div className={styles.filterGroup}>
          <label htmlFor="sort">مرتب‌سازی:</label>
          <select
            id="sort"
            value={sortOption}
            onChange={handleSortChange}
            className={styles.select}
          >
            <option value="newest">جدیدترین</option>
            <option value="oldest">قدیمی‌ترین</option>
            <option value="price-high">گران‌ترین</option>
            <option value="price-low">ارزان‌ترین</option>
          </select>
        </div>

        <div className={styles.filterGroup}>
          <label htmlFor="price">فیلتر قیمت:</label>
          <select
            id="price"
            value={priceRange}
            onChange={handlePriceFilterChange}
            className={styles.select}
          >
            <option value="all">همه قیمت‌ها</option>
            <option value="under-50">زیر 50 هزار تومان</option>
            <option value="50-100">50 تا 100 هزار تومان</option>
            <option value="100-200">100 تا 200 هزار تومان</option>
            <option value="over-200">بالای 200 هزار تومان</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className={styles.productsGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className={styles.empty}>
          {selectedSubCollection 
            ? "هیچ محصولی در این زیردسته یافت نشد." 
            : "هیچ محصولی در این دسته‌بندی یافت نشد."}
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

export default React.memo(CollectionProducts);