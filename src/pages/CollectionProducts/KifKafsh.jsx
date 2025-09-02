import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CollectionProducts.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/ProductCard/ProductCard.Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SubCollections from "./SubCollections";
import Filters from "./Filters";

const KifKafsh = () => {
  const collectionId = 4; // ID ثابت برای کیف و کفش
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
        c => c.id === collectionId
      );
      if (!currentCollection) throw new Error("Collection not found");
      
      const subs = collectionsArray.filter(c => {
        const parentId = c.parent?.id || c.parent;
        return parentId === collectionId;
      });

      setCollection(currentCollection);
      setDirectSubCollections(subs);

      // 3. Fetch products ONLY for the selected sub-collection if one is selected
      // Otherwise fetch for main collection and all sub-collections
      const collectionIdsToFetch = selectedSubCollection 
        ? [parseInt(selectedSubCollection)]
        : [collectionId, ...subs.map(sub => sub.id)];

      // Fetch products for each collection in parallel
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

      // Remove duplicates
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
        <h1 className={styles.title}>کیف و کفش</h1>
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
      
      {/* بخش جدید توضیحات SEO برای کیف و کفش */}
      <section className={styles.seoSection}>
        <div className={styles.seoContainer}>
          <div className={styles.seoHeader}>
            <h2 className={styles.seoTitle}>کیف و کفش: تکمیل کننده استایل شما</h2>
            <div className={styles.seoDivider}></div>
          </div>
          
          <div className={styles.seoContent}>
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>تنوع بی‌نظیر در طراحی کیف و کفش</h3>
                <p>
                  در دنیای کیف و کفش، ما مجموعه‌ای کامل از محصولات شیک و کاربردی ارائه می‌دهیم که 
                  مناسب برای تمام سلیقه‌ها و موقعیت‌های مختلف است. از کفش‌های راحت روزمره 
                  تا کیف‌های مجلسی و اداری، هر محصول با دقت طراحی شده تا ترکیبی از 
                  زیبایی، کیفیت و کارایی را ارائه دهد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>کیفیت و دوام بی‌نظیر</h3>
                <p>
                  برای کیف و کفش، کیفیت و دوام از اهمیت ویژه‌ای برخوردار است. 
                  تمامی محصولات ما از بهترین مواد اولیه و چرم‌های مرغوب تهیه شده‌اند که 
                  نه تنها در برابر استفاده روزمره مقاوم هستند، بلکه با گذشت زمان 
                  کیفیت اولیه خود را حفظ می‌کنند. از چرم طبیعی گرفته تا 
                  پارچه‌های باکیفیت و پایدار، همگی تضمین کننده رضایت مشتری هستند.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>مناسب برای هر موقعیت و استایل</h3>
                <p>
                  چه برای محیط کار، مهمانی‌های رسمی، گردش‌های روزمره یا مناسبت‌های خاص، 
                  مجموعه کیف و کفش ما پاسخگوی تمام نیازهای شماست. 
                  طراحی‌های مدرن و کلاسیک، رنگ‌های متنوع و الگوهای به روز، 
                  امکان انتخاب بر اساس سلیقه شخصی و سبک زندگی را فراهم می‌آورد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>راحتی و کاربردی بودن</h3>
                <p>
                  ما به راحتی و کاربردی بودن محصولاتمان اهمیت ویژه‌ای می‌دهیم. 
                  کفش‌های ما با کفی‌های ارگونومیک و کیف‌هایمان با طراحی‌های هوشمند 
                  تهیه شده‌اند تا نه تنها زیبا باشند، بلکه استفاده از آنها در طول روز 
                  کاملاً راحت و لذت‌بخش باشد. از بخش‌بندی‌های داخلی کیف‌ها تا 
                  پشتیبانی‌های قوسی کفش‌ها، همه‌چیز برای تجربه‌ای بهتر طراحی شده است.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoHighlight}>
              <h3>چرا کیف و کفش ما را انتخاب کنید؟</h3>
              <ul>
                <li>تنوع بی‌نظیر در طراحی و مدل‌های متنوع</li>
                <li>استفاده از بهترین مواد اولیه و چرم‌های مرغوب</li>
                <li>تطابق کامل با استانداردهای کیفیت و دوام</li>
                <li>قیمت‌های مناسب با توجه به کیفیت بی‌نظیر محصولات</li>
                <li>راحتی و کاربردی بودن در طراحی‌ها</li>
                <li>مناسب برای تمام سنین و سلیقه‌ها</li>
                <li>گارانتی کیفیت و خدمات پس از فروش</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default React.memo(KifKafsh);