import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CollectionProducts.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/ProductCard/ProductCard.Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SubCollections from "./SubCollections";
import Filters from "./Filters";

const MadarKodak = () => {
  const collectionId = 6; // ID ست مادر و کودک
  const navigate = useNavigate();
  const [collections, setCollections] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOption, setSortOption] = useState("newest");
  const [priceRange, setPriceRange] = useState("all");
  const [selectedSubCollection, setSelectedSubCollection] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // دریافت تمام دسته‌بندی‌ها
        const collectionsRes = await fetch(
          "https://rad-gallery-api.liara.run/api/store/collections/"
        );
        const collectionsData = await collectionsRes.json();
        const allCollections = Array.isArray(collectionsData.results) 
          ? collectionsData.results 
          : Array.isArray(collectionsData) 
            ? collectionsData 
            : [];

        // دریافت تمام محصولات
        const productsRes = await fetch(
          "https://rad-gallery-api.liara.run/api/store/products/"
        );
        const productsData = await productsRes.json();
        const allProducts = Array.isArray(productsData.results) 
          ? productsData.results 
          : Array.isArray(productsData) 
            ? productsData 
            : [];

        // یافتن دسته اصلی و زیرمجموعه‌هایش
        const mainCollection = allCollections.find(c => c.id === collectionId);
        const subCollections = allCollections.filter(
          c => (c.parent?.id || c.parent) === collectionId
        );

        // فیلتر کردن محصولات بر اساس دسته انتخاب شده
        const filteredProducts = allProducts.filter(product => {
          const productCollectionId = product.collection?.id || product.collection_id || product.collection;
          
          if (selectedSubCollection) {
            return parseInt(productCollectionId) === parseInt(selectedSubCollection);
          } else {
            return [collectionId, ...subCollections.map(sc => sc.id)].includes(
              parseInt(productCollectionId)
            );
          }
        });

        setCollections({
          main: mainCollection,
          subs: subCollections
        });
        setProducts(filteredProducts);
        
      } catch (err) {
        setError(err.message || "خطا در دریافت اطلاعات");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubCollection]);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // فیلتر قیمت
    if (priceRange !== "all") {
      result = result.filter(product => {
        const price = product.variants?.[0]?.price 
          ? parseInt(product.variants[0].price) 
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
      const priceA = a.variants?.[0]?.price ? parseInt(a.variants[0].price) : 0;
      const priceB = b.variants?.[0]?.price ? parseInt(b.variants[0].price) : 0;

      switch (sortOption) {
        case "newest": return dateB - dateA;
        case "oldest": return dateA - dateB;
        case "price-high": return priceB - priceA;
        case "price-low": return priceA - priceB;
        default: return 0;
      }
    });
  }, [products, sortOption, priceRange]);

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
        <h1 className={styles.title}>ست مادر و کودک</h1>
        {collections.main?.description && (
          <p className={styles.description}>{collections.main.description}</p>
        )}
      </div>

      <SubCollections
        directSubCollections={collections.subs}
        selectedSubCollection={selectedSubCollection}
        onSelectSubCollection={setSelectedSubCollection}
      />

      <Filters
        sortOption={sortOption}
        priceRange={priceRange}
        onSortChange={setSortOption}
        onPriceFilterChange={setPriceRange}
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
            ? "هیچ محصولی در این زیردسته یافت نشد"
            : "هیچ محصولی در این دسته‌بندی یافت نشد"}
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
      
      {/* بخش جدید توضیحات SEO برای ست مادر و کودک */}
      <section className={styles.seoSection}>
        <div className={styles.seoContainer}>
          <div className={styles.seoHeader}>
            <h2 className={styles.seoTitle}>ست مادر و کودک: هارمونی زیبایی و عشق</h2>
            <div className={styles.seoDivider}></div>
          </div>
          
          <div className={styles.seoContent}>
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>هماهنگی بی‌نظیر در طراحی</h3>
                <p>
                  در دنیای ست‌های مادر و کودک، ما مجموعه‌ای منحصر به فرد از لباس‌های هماهنگ 
                  و ست‌های جذاب ارائه می‌دهیم که نشان‌دهنده پیوند عمیق مادر و فرزند است. 
                  از ست‌های مجلسی و مراسم خاص تا لباس‌های روزمره و راحت، هر طراحی با ظرافت 
                  انتخاب شده تا زیبایی، هماهنگی و حجاب را در کنار هم ارائه دهد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>مواد اولیه مناسب برای پوست حساس</h3>
                <p>
                  برای مادران و کودکان، کیفیت و ایمنی پارچه از اهمیت ویژه‌ای برخوردار است. 
                  تمامی محصولات ما از بهترین پارچه‌های طبیعی و ضد حساسیت تهیه شده‌اند که 
                  نه تنها برای پوست حساس کودکان کاملاً مناسب است، بلکه راحتی و نرمی بی‌نظیری 
                  را برای مادران به ارمغان می‌آورد. از پارچه‌های نخی و پنبه‌ای مرغوب گرفته تا 
                  انواع لطیف و نرم، همگی تضمین کننده سلامت و رضایت شما هستند.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>مناسب برای تمام مناسبت‌ها</h3>
                <p>
                  چه برای مهمانی‌های خانوادگی، عکس‌های یادگاری، مراسم خاص یا استفاده روزمره، 
                  مجموعه ست‌های مادر و کودک ما پاسخگوی تمام نیازهای شماست. 
                  طراحی‌های متنوع، رنگ‌های شاد و هماهنگ و الگوهای جذاب، 
                  امکان ایجاد خاطرات زیبا و به یاد ماندنی را فراهم می‌آورد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>حجاب و زیبایی برای تمام اعضای خانواده</h3>
                <p>
                  ما به حجاب به عنوان ارزشی خانوادگی نگاه می‌کنیم. 
                  طراحی‌های ما ثابت می‌کند که می‌توان هم محجبه بود و هم بسیار شیک و جذاب. 
                  ست‌های مادر و کودک ما این پیام را منتقل می‌کنند که حجاب نه تنها محدودیت نیست، 
                  بلکه می‌تواند نماد زیبایی، اصالت و همبستگی خانوادگی باشد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoHighlight}>
              <h3>چرا ست‌های مادر و کودک ما را انتخاب کنید؟</h3>
              <ul>
                <li>تنوع بی‌نظیر در طراحی و مدل‌های هماهنگ</li>
                <li>استفاده از بهترین مواد اولیه طبیعی و مناسب پوست حساس</li>
                <li>تطابق کامل با معیارهای حجاب اسلامی و پوشش ایرانی</li>
                <li>قیمت‌های مناسب با توجه به کیفیت و دوام محصولات</li>
                <li>ایجاد خاطرات زیبا و به یاد ماندنی برای خانواده‌ها</li>
                <li>مناسب برای تمام سنین کودکان از نوزاد تا خردسال</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default React.memo(MadarKodak);