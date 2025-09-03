import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CollectionProducts.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/ProductCard/ProductCard.Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SubCollections from "./SubCollections";
import Filters from "./Filters";

const Ebadat = () => {
  const collectionId = 7; // ID ثابت برای ست عبادت
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
        <h1 className={styles.title}>ست عبادت</h1>
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
      
      {/* بخش جدید توضیحات SEO برای ست عبادت */}
      <section className={styles.seoSection}>
        <div className={styles.seoContainer}>
          <div className={styles.seoHeader}>
            <h2 className={styles.seoTitle}>ست عبادت: وقار و زیبایی در پرستش</h2>
            <div className={styles.seoDivider}></div>
          </div>
          
          <div className={styles.seoContent}>
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>تنوع در ست‌های عبادی</h3>
                <p>
                  در دنیای ست‌های عبادت، ما مجموعه‌ای کامل از لباس‌های مناسب برای مراسم مذهبی، 
                  نماز و مناسک دینی ارائه می‌دهیم. از چادرهای مجلسی و ساده گرفته تا 
                  مقنعه‌های زیبا و مانتوهای مناسب عبادت، هر محصول با دقت طراحی شده تا 
                  وقار، زیبایی و حجاب را در کنار راحتی برای عبادت فراهم آورد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>مواد اولیه مناسب برای عبادت</h3>
                <p>
                  برای ست‌های عبادت، راحتی و تنفس پذیری پارچه از اهمیت ویژه‌ای برخوردار است. 
                  تمامی محصولات ما از بهترین پارچه‌های طبیعی و سبک تهیه شده‌اند که 
                  نه تنها در طول عبادت احساس راحتی می‌دهند، بلکه برای استفاده طولانی مدت 
                  کاملاً مناسب هستند. از پارچه‌های نخی و کتان گرفته تا انواع سبک و خنک، 
                  همگی تضمین کننده آرامش و تمرکز در هنگام عبادت هستند.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>مناسب برای تمام مراسم مذهبی</h3>
                <p>
                  چه برای نمازهای روزانه، مراسم مذهبی، اعیاد مذهبی  یا مجالس قرآن، 
                  مجموعه ست‌های عبادت ما پاسخگوی تمام نیازهای شماست. 
                  طراحی‌های متنوع، رنگ‌های مناسب و الگوهای محجبه، 
                  امکان انتخاب بر اساس سلیقه شخصی و نوع مراسم را فراهم می‌آورد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>ست‌های ویژه جشن تکلیف</h3>
                <p>
                  ما به مناسبت فرخنده جشن تکلیف، مجموعه‌ای ویژه از ست‌های عبادت را 
                  برای نوجوانان طراحی کرده‌ایم. این ست‌ها با توجه به حساسیت این دوران 
                  و اهمیت ویژه‌ای که در زندگی مذهبی نوجوانان دارد، با دقت و ظرافت خاصی 
                  تهیه شده‌اند. طراحی‌های جوانپسند، رنگ‌های شاد و متنوع و استفاده از 
                  پارچه‌های مرغوب، این ست‌ها را به انتخاب ایده‌آلی برای جشن تکلیف تبدیل کرده است.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>اهمیت جشن تکلیف و انتخاب ست مناسب</h3>
                <p>
                  جشن تکلیف یکی از مهم‌ترین مراحل زندگی دینی هر فرد است که 
                  نشان‌دهنده ورود به مرحله جدیدی از مسئولیت‌های دینی می‌باشد. 
                  انتخاب ست عبادت مناسب برای این مراسم نه تنها به زیبایی و شکوه مراسم می‌افزاید، 
                  بلکه می‌تواند به عنوان یادگاری ارزشمند برای سال‌های آینده حفظ شود. 
                  ست‌های عبادت ما با درنظرگیری این اهمیت، طراحی و تولید شده‌اند.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoHighlight}>
              <h3>چرا ست‌های عبادت ما را انتخاب کنید؟</h3>
              <ul>
                <li>تنوع بی‌نظیر در طراحی و مدل‌های مناسب عبادت</li>
                <li>استفاده از بهترین مواد اولیه طبیعی و راحت</li>
                <li>تطابق کامل با معیارهای حجاب اسلامی</li>
                <li>قیمت‌های مناسب با توجه به کیفیت و دوام محصولات</li>
                <li>ست‌های ویژه و زیبا برای جشن تکلیف</li>
                <li>مناسب برای تمام سنین از نوجوان تا بزرگسال</li>
                <li>پشتیبانی از تمام مراسم مذهبی و دینی</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default React.memo(Ebadat);