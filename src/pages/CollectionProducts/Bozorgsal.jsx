import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./CollectionProducts.module.css";
import ProductCard from "../../components/ProductCard/ProductCard";
import ProductCardSkeleton from "../../components/ProductCard/ProductCard.Skeleton";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import SubCollections from "./SubCollections";
import Filters from "./Filters";

const Bozorgsal = () => {
  const collectionId = 1; // ID ثابت برای پوشاک بزرگسال
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

      const collectionTreeIds = [
        collectionId,
        ...subs.map(sub => sub.id)
      ];

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
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredProducts = useMemo(() => {
    if (!Array.isArray(allProducts)) return [];

    let result = [...allProducts];

    if (selectedSubCollection) {
      result = result.filter(product => {
        const productCollectionId = product.collection_id || product.collection?.id || product.collection;
        return productCollectionId && parseInt(productCollectionId) === parseInt(selectedSubCollection);
      });
    }

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
  }, [allProducts, selectedSubCollection, sortOption, priceRange]);

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
        <h1 className={styles.title}>پوشاک بزرگسال</h1>
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
      
      {/* بخش جدید توضیحات SEO برای پوشاک بزرگسال */}
      <section className={styles.seoSection}>
        <div className={styles.seoContainer}>
          <div className={styles.seoHeader}>
            <h2 className={styles.seoTitle}>پوشاک بزرگسال: ظرافت و اصالت در کنار هم</h2>
            <div className={styles.seoDivider}></div>
          </div>
          
          <div className={styles.seoContent}>
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>تنوع بی‌نظیر در استایل و طراحی</h3>
                <p>
                  در دنیای پوشاک بزرگسال، ما مجموعه‌ای کامل از لباس‌های شیک، مدرن و کلاسیک ارائه می‌دهیم که 
                  مناسب برای تمام سلیقه‌ها و موقعیت‌های مختلف است. از مانتوهای مجلسی و روزمره تا 
                  پالتوهای زمستانی و لباس‌های اداری، هر محصول با دقت طراحی شده تا ترکیبی از 
                  ظرافت، راحتی و حجاب را ارائه دهد.
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
                  برای بزرگسالان، کیفیت و دوام لباس از اهمیت ویژه‌ای برخوردار است. 
                  تمامی محصولات ما از بهترین پارچه‌های طبیعی و مرغوب تهیه شده‌اند که 
                  نه تنها در برابر شستشوهای مکرر مقاوم هستند، بلکه با گذشت زمان 
                  کیفیت اولیه خود را حفظ می‌کنند. از پارچه‌های نخی و لینن گرفته تا 
                  پشمی و کرپ‌های مرغوب، همگی تضمین کننده رضایت مشتری هستند.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>مناسب برای هر موقعیت و مناسبت</h3>
                <p>
                  چه برای محیط کار، مهمانی‌های رسمی، گردش‌های روزمره یا مناسبت‌های خاص، 
                  مجموعه پوشاک بزرگسال ما پاسخگوی تمام نیازهای شماست. 
                  طراحی‌های کلاسیک و مدرن، رنگ‌های متنوع و الگوهای به روز، 
                  امکان انتخاب بر اساس سلیقه شخصی و موقعیت اجتماعی را فراهم می‌آورد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoCircle}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoCard}>
              <div className={styles.seoText}>
                <h3>حجاب به سبکی مدرن و کلاسیک</h3>
                <p>
                  ما به حجاب به عنوان یک ارزش والا و یک انتخاب هوشمندانه نگاه می‌کنیم. 
                  طراحی‌های ما ثابت می‌کند که می‌توان هم محجبه بود و هم بسیار شیک، ظرافت و به‌روز. 
                  پوشاک بزرگسال ما این پیام را به جامعه منتقل می‌کند که حجاب نه تنها محدودیت نیست، 
                  بلکه می‌تواند نمادی از شخصیت، وقار و ظرافت باشد.
                </p>
              </div>
              <div className={styles.seoDecoration}>
                <div className={styles.decoSquare}></div>
                <div className={styles.decoLine}></div>
              </div>
            </div>
            
            <div className={styles.seoHighlight}>
              <h3>چرا پوشاک بزرگسال ما را انتخاب کنید؟</h3>
              <ul>
                <li>تنوع بی‌نظیر در طراحی و مدل‌های مناسب برای تمام سنین</li>
                <li>استفاده از بهترین مواد اولیه و پارچه‌های طبیعی و با دوام</li>
                <li>تطابق کامل با معیارهای حجاب اسلامی و پوشش ایرانی</li>
                <li>قیمت‌های مناسب با توجه به کیفیت بی‌نظیر محصولات</li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default React.memo(Bozorgsal);