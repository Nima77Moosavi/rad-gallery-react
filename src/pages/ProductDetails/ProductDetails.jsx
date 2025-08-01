import { React, useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import styles from "./ProductDetails.module.css";
import Header from "../../components/Header/Header";
import Bestsellers from "../../components/Bestsellers/Bestsellers";
import Footer from "../../components/Footer/Footer";
import MoonLoader from "react-spinners/MoonLoader";
import { FavoritesContext } from "../../context/FavoritesContext";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import ImageSlider from "./ImageSlider/ImageSlider";
import ProductTabs from "./ProductTabs/ProductTabs";
import ProductRating from "./ProductRating/ProductRating";
import PriceBox from "./PriceBox/PriceBox";
import IconsBox from "./IconsBox/IconsBox";
import ReviewForm from "./ReviewForm/ReviewForm";

const ProductDetails = () => {
  // State management
  const { slugAndId } = useParams();
  const id = slugAndId.substring(slugAndId.lastIndexOf("-") + 1);
  const [product, setProduct] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [like, setLike] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Context
  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  // Helper functions
  const formatPrice = (price) => {
    return new Intl.NumberFormat("fa-IR").format(price);
  };

  // Sample data
  const sampleReviews = [
    { user: "علی", comment: "محصول فوق‌العاده‌ای بود، خیلی راضیم." },
    { user: "زهرا", comment: "بسته‌بندی تمیز و ارسال سریع، ممنون." },
    { user: "محمد", comment: "کمی با عکس فرق داشت ولی کیفیت خوبی داشت." },
    { user: "فاطمه", comment: "نسبت به قیمتش واقعا عالیه!" },
    { user: "رضا", comment: "اندازه‌اش کوچیک‌تر از چیزی بود که فکر می‌کردم." },
    { user: "سارا", comment: "خیلی شیکه، حتما دوباره خرید می‌کنم." },
    { user: "امیر", comment: "ارسال دیر بود ولی محصول خوبه." },
    { user: "نگار", comment: "رنگش دقیقا همونیه که توی عکس بود." },
    { user: "حسین", comment: "ممنون از خدمات خوبتون، من که راضی بودم." },
    { user: "مریم", comment: "نرم و با کیفیت، حتما پیشنهاد می‌کنم." },
  ];
  const duplicatedReviews = [...sampleReviews, ...sampleReviews];

  // Handlers
  const handleAddToCart = async () => {
    try {
      const response = await axiosInstance.get(`${API_URL}api/store/cart`);
      const currentCart = response.data;

      let currentItems =
        currentCart.items
          ?.filter((item) => item.product_variant?.id)
          .map((item) => ({
            product_variant_id: item.product_variant.id,
            quantity: item.quantity,
          })) || [];

      const variantId = product?.variants?.[0]?.id;
      if (!variantId) {
        throw new Error("Variant ID not available");
      }

      const existingItemIndex = currentItems.findIndex(
        (item) => item.product_variant_id === variantId
      );

      const newItems = [...currentItems];
      if (existingItemIndex >= 0) {
        newItems[existingItemIndex].quantity += 1;
      } else {
        newItems.push({ product_variant_id: variantId, quantity: 1 });
      }

      await axiosInstance.patch(`${API_URL}api/store/cart/`, {
        items: newItems,
      });

      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (error) {
      console.error("Cart error:", error);
      setError("خطا در اضافه کردن به سبد خرید");
    }
  };

  const likeHandler = () => {
    if (isFavorite(product.id)) {
      removeFavorite(product.id);
      setLike(false);
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        image: product.images?.[0]?.image || "",
        price: product.variants?.[0]?.price || "",
      });
      setLike(true);
    }
  };

  // Effects
  useEffect(() => {
    setLike(isFavorite(parseInt(id)));
  }, [id, isFavorite]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `https://rad-gallery-api.liara.run/api/store/products/${id}`
        );
        if (!response.ok) throw new Error("Network error");

        const data = await response.json();
        setProduct({
          ...data,
          reviews: data.reviews?.length ? data.reviews : sampleReviews,
        });
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // Render states
  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <MoonLoader color="#499c7f" />
      </div>
    );
  }

  if (error) {
    return <div className={styles.errorContainer}>خطا: {error}</div>;
  }

  return (
    <div className={styles.productPage}>
      <Header />

      {/* Success Notification */}
      {showSuccessMessage && (
        <div className={styles.successToast}>
          <div className={styles.toastContent}>
            <span>✓</span>
            <p>محصول مورد نظر به سبد خرید اضافه شد</p>
          </div>
        </div>
      )}

      <div className={styles.pageContent}>
 

        {/* Product Image Slider */}
        {product.images?.length > 0 && <ImageSlider images={product.images} />}

        {/* Main Product Content */}
        <div className={styles.container}>
          {/* Left Sidebar */}
          <div className={styles.leftSidebar}>
            <PriceBox
              price={formatPrice(product.variants?.[0]?.price || 0)}
              onAddToCart={handleAddToCart}
              inventoryText="تنها 2 عدد در انبار باقی مانده"
            />

            <IconsBox isLiked={like} onLikeClick={likeHandler} />

            <ProductRating rating={product.average_rating || 4} />
            
            {/* Moved ReviewForm here */}
            <ReviewForm
              productId={id}
              onSubmit={async (reviewData) => {
                // اینجا می‌توانید درخواست به API را مدیریت کنید
                console.log("Review submitted:", reviewData);
                // در حالت واقعی:
                // await axiosInstance.post(`${API_URL}api/reviews/`, reviewData);
              }}
            />
          </div>

          {/* Right Content */}
          <ProductTabs
            product={product}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showAllReviews={showAllReviews}
            setShowAllReviews={setShowAllReviews}
            duplicatedReviews={duplicatedReviews}
          />
        </div>

        {/* Recommendations */}
        <Bestsellers />

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;