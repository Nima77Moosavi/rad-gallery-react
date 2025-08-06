import React, { useState, useEffect, useContext } from "react";
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
  const { slugAndId } = useParams();
  const id = slugAndId.substring(slugAndId.lastIndexOf("-") + 1);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // User’s picks
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedVariant, setSelectedVariant] = useState(null);

  const [like, setLike] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [activeTab, setActiveTab] = useState("specs");
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const { addFavorite, removeFavorite, isFavorite } =
    useContext(FavoritesContext);

  const formatPrice = (price) => new Intl.NumberFormat("fa-IR").format(price);

  // Once we have the product, pull its single variant’s attributes
  const variant = product?.variants?.[0] || null;
  const attributes = variant?.attributes || [];

  // Get all unique colors and sizes from all variants
  const allAttributes = product?.variants?.flatMap((v) => v.attributes) || [];
  const availableColors = [
    ...new Set(
      allAttributes.filter((a) => a.attribute === "رنگ").map((a) => a.value)
    ),
  ];
  const availableSizes = [
    ...new Set(
      allAttributes.filter((a) => a.attribute === "سایز").map((a) => a.value)
    ),
  ];

  // Find the variant matching selected color and size
  useEffect(() => {
    if (!selectedColor || !selectedSize || !product?.variants) {
      setSelectedVariant(null);
      return;
    }
    const match = product.variants.find((v) => {
      const colorMatch = v.attributes.some(
        (a) => a.attribute === "رنگ" && a.value === selectedColor
      );
      const sizeMatch = v.attributes.some(
        (a) => a.attribute === "سایز" && a.value === selectedSize
      );
      return colorMatch && sizeMatch;
    });
    setSelectedVariant(match || null);
  }, [selectedColor, selectedSize, product]);

  // Sync “liked” state
  useEffect(() => {
    setLike(isFavorite(parseInt(id)));
  }, [id, isFavorite]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}api/store/products/${id}`);
        if (!res.ok) throw new Error("Network error");
        const data = await res.json();
        setProduct({
          ...data,
          // fallback to empty reviews if none
          reviews: data.reviews?.length ? data.reviews : [],
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // Add to cart with the single variant ID
  const handleAddToCart = async () => {
    if (!selectedColor || !selectedSize || !selectedVariant) {
      setError("لطفا رنگ و سایز را انتخاب کنید");
      return;
    }
    try {
      const { data: cart } = await axiosInstance.get(
        `${API_URL}api/store/cart`
      );
      const items =
        cart.items
          ?.filter((i) => i.product_variant?.id)
          .map((i) => ({
            product_variant_id: i.product_variant.id,
            quantity: i.quantity,
          })) || [];

      const idx = items.findIndex((i) => i.product_variant_id === variant.id);
      if (idx >= 0) {
        items[idx].quantity += 1;
      } else {
        items.push({ product_variant_id: variant.id, quantity: 1 });
      }

      await axiosInstance.patch(`${API_URL}api/store/cart/`, { items });
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
    } catch (err) {
      console.error(err);
      setError("خطا در اضافه کردن به سبد خرید");
    }
  };

  const likeHandler = () => {
    if (like) {
      removeFavorite(product.id);
    } else {
      addFavorite({
        id: product.id,
        title: product.title,
        image: product.images?.[0]?.image || "",
        price: variant.price,
      });
    }
    setLike(!like);
  };

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

      {showSuccessMessage && (
        <div className={styles.successToast}>
          <div className={styles.toastContent}>
            <span>✓</span>
            <p>محصول مورد نظر به سبد خرید اضافه شد</p>
          </div>
        </div>
      )}

      <div className={styles.pageContent}>
        {product.images?.length > 0 && <ImageSlider images={product.images} />}

        <div className={styles.container}>
          <div className={styles.leftSidebar}>
            <PriceBox
              price={selectedVariant ? formatPrice(selectedVariant.price) : "-"}
              inventoryText={
                selectedVariant
                  ? selectedVariant.stock > 0
                    ? `تنها ${selectedVariant.stock} عدد در انبار باقی مانده`
                    : "ناموجود"
                  : "لطفا رنگ و سایز را انتخاب کنید"
              }
              sizes={availableSizes}
              colors={availableColors}
              selectedSize={selectedSize}
              selectedColor={selectedColor}
              onSizeChange={setSelectedSize}
              onColorChange={setSelectedColor}
              onAddToCart={handleAddToCart}
              disabled={
                !selectedColor ||
                !selectedSize ||
                !selectedVariant ||
                selectedVariant.stock < 1
              }
            />

            <IconsBox isLiked={like} onLikeClick={likeHandler} />
            <ProductRating rating={product.average_rating || 4} />

            <ReviewForm
              productId={id}
              onSubmit={async (reviewData) => {
                console.log("Review submitted:", reviewData);
                // await axiosInstance.post(...);
              }}
            />
          </div>

          <ProductTabs
            product={product}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            showAllReviews={showAllReviews}
            setShowAllReviews={setShowAllReviews}
            duplicatedReviews={product.reviews}
          />
        </div>

        <Bestsellers />
        <Footer />
      </div>
    </div>
  );
};

export default ProductDetails;
