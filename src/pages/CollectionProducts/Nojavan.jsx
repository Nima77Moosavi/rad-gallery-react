import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CollectionProducts.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/ProductCard/ProductCard.Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SubCollections from "./SubCollections";
import Filters from "./Filters";

const Nojavan = () => {
  const collectionId = 3;
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

      const currentCollection = collectionsArray.find(
        c => c.id === collectionId
      );
      if (!currentCollection) throw new Error("Collection not found");
      
      const subs = collectionsArray.filter(c => {
        const parentId = c.parent?.id || c.parent;
        return parentId === collectionId;
      });

      setCollection(currentCollection);
      setDirectSubCollections(subs);

      const collectionIdsToFetch = selectedSubCollection 
        ? [parseInt(selectedSubCollection)]
        : [collectionId, ...subs.map(sub => sub.id)];

      const productPromises = collectionIdsToFetch.map(async (id) => {
        const res = await fetch(
          `https://rad-gallery-api.liara.run/api/store/products/?collection_id=${id}`
        );
        if (!res.ok) throw new Error(`Failed to fetch products for collection ${id}`);
        const data = await res.json();
        return Array.isArray(data.results) ? data.results : Array.isArray(data) ? data : [];
      });

      const productsArrays = await Promise.all(productPromises);
      const mergedProducts = productsArrays.flat();

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
  }, [selectedSubCollection]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];

    let result = [...allProducts];

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
        <h1 className={styles.title}>پوشاک نوجوان</h1>
        {collection?.description && (
          <p className={styles.description}>{collection.description}</p>
        )}
      </div>

      <SubCollections 
        directSubCollections={directSubCollections}
        selectedSubCollection={selectedSubCollection}
        collectionTitle={collection?.title}
        onSelectSubCollection={handleSubCollectionSelect}
      />

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
      
      {/* بخش جدید توضیحات SEO با طراحی فارسی و راست‌چین */}
      <section className={styles.seoSection}>
        <div className={styles.seoContainer}>
          <div className={styles.seoHeader}>
            <h2 className={styles.seoTitle}>جهان پوشاک نوجوان: سبک‌های مدرن و با حجاب</h2>
            <div className={styles.seoDivider}></div>
          </div>
          
          <div className={styles.seoContent}>
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>تنوع بی‌نظیر در طراحی</h3>
                <p>
                  در دنیای پوشاک نوجوان، ما مجموعه‌ای بی‌نظیر از لباس‌های شیک و مدرن ارائه می‌دهیم که 
                  هماهنگ با سلیقه نوجوانان امروزی و مطابق با ارزش‌های فرهنگی طراحی شده‌اند. 
                  از تونیک‌های مجلسی تا لباس‌های روزمره، هر قطعه با دقت انتخاب شده تا 
                  ترکیبی از مد، راحتی و حجاب را ارائه دهد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>کیفیت و اصالت مواد اولیه</h3>
                <p>
                  کیفیت برای ما یک تعهد است. تمامی محصولات از پارچه‌های درجه یک و طبیعی 
                  تهیه شده‌اند که نه تنها لطافت و راحتی بی‌نظیری دارند، 
                  بلکه برای پوست حساس نوجوانان کاملاً مناسب هستند. 
                  از پارچه‌های نخی و کتان گرفته تا انواع مرغوب دیگر، 
                  همگی تضمین کننده کیفیت و رضایت هستند.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>مناسب برای هر مناسبت</h3>
                <p>
                  چه برای مدرسه، مهمانی، گردش با دوستان یا مناسبت‌های خانوادگی، 
                  مجموعه پوشاک نوجوان ما پاسخگوی تمام نیازهای شماست. 
                  طراحی‌های جوانپسند و رنگ‌های شاد و متنوع، 
                  امکان بیان فردیت و سلیقه شخصی را فراهم می‌آورد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>حجاب به سبک امروزی</h3>
                <p>
                  ما به حجاب به عنوان یک ارزش و یک انتخاب زیبا نگاه می‌کنیم. 
                  طراحی‌های ما ثابت می‌کند که می‌توان هم محجبه بود و هم بسیار شیک و به‌روز. 
                  پوشاک نوجوان ما این پیام را به نسل جدید منتقل می‌کند که حجاب نه تنها محدودیت نیست، 
                  بلکه می‌تواند منبعی برای خلاقیت و بیان فردیت باشد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoHighlight}>
              <h3>چرا پوشاک نوجوان ما را انتخاب کنید؟</h3>
              <ul>
                <li>تنوع بی‌نظیر در طراحی و مدل‌ها</li>
                <li>استفاده از بهترین مواد اولیه و پارچه‌های طبیعی</li>
                <li>تطابق کامل با معیارهای حجاب اسلامی</li>
                <li>قیمت‌های مناسب و کیفیت بی‌نظیر</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default React.memo(Nojavan);