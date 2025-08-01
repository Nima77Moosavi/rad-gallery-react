import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_URL } from "../../config";
import Header from "../../components/Header/Header";
import SidebarUserPanel from "../../components/SidebarUserPanel/SidebarUserPanel";
import styles from "./ShoppingCart.module.css";
import { MdDeleteOutline } from "react-icons/md";
import { FiPlus } from "react-icons/fi";
import { FiMinus } from "react-icons/fi";

const ShoppingCart = () => {
  const [cartData, setCartData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`${API_URL}api/store/cart`);
        setCartData(response.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Error loading cart");
        setLoading(false);
      }
    };
    fetchCart();
  }, []);

  const updateQuantity = async (itemId, newQuantity) => {
    if (!cartData) return;

    const updatedItems = cartData.items.map((item) => {
      return item.id === itemId
        ? { product_variant_id: item.product_variant.id, quantity: newQuantity }
        : {
            product_variant_id: item.product_variant.id,
            quantity: item.quantity,
          };
    });

    const updatedLocalItems = cartData.items.map((item) =>
      item.id === itemId ? { ...item, quantity: newQuantity } : item
    );
    setCartData({ ...cartData, items: updatedLocalItems });

    try {
      await axiosInstance.patch(`${API_URL}api/store/cart`, {
        items: updatedItems,
      });
    } catch (err) {
      console.error("Failed to update item quantity", err);
    }
  };

  const removeItem = async (itemId) => {
    if (!cartData) return;

    try {
      await axiosInstance.delete(`${API_URL}api/store/cart/items/${itemId}`);
      const updatedItems = cartData.items.filter((item) => item.id !== itemId);
      setCartData({ ...cartData, items: updatedItems });
    } catch (err) {
      console.error("Failed to remove item", err);
    }
  };

  // تابع جدید برای محاسبه جمع کل
  const calculateTotal = () => {
    if (!cartData?.items) return 0;
    return cartData.items.reduce(
      (total, item) => total + item.product_variant?.price * item.quantity,
      0
    );
  };

  // تابع جدید برای ثبت سفارش
  const handleCheckout = async () => {
    navigate("/user-panel/checkout");
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.cartMain}>
        <div className={styles.cartContent}>
          {loading && <p>در حال بارگذاری...</p>}
          {error && <p className={styles.error}>{error}</p>}
          {cartData && cartData.items && cartData.items.length > 0 ? (
            <div>
              <h2 className={styles.cartTitle}>سبد خرید شما</h2>
              <div className={styles.itemsList}>
                {cartData.items.map((item) => {
                  const imageUrl =
                    item.product_variant?.product?.images &&
                    item.product_variant.product.images.length > 0
                      ? item.product_variant.product.images[0].image
                      : "/placeholder.png";

                  return (
                    <div key={item.id} className={styles.cartItem}>
                      <div className={styles.itemImage}>
                        <img
                          src={imageUrl}
                          alt={
                            item.product_variant?.product?.title ||
                            "Product Image"
                          }
                        />
                      </div>
                      <div className={styles.itemDetails}>
                        <h3 className={styles.itemTitle}>
                          {item.product_variant?.product?.title ||
                            "Product Name"}
                        </h3>
                        <p className={styles.itemDescription}>
                          {item.product_variant?.product?.description || ""}
                        </p>
                        <p className={styles.itemPrice}>
                          {item.product_variant?.price} تومان
                        </p>
                        <div className={styles.quantityControl}>
                          <div className={styles.quantityBox}>
                            <button
                              className={`${styles.quantityButton} ${styles.plusButton}`}
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                            >
                              <FiPlus />
                            </button>

                            <span className={styles.quantityNumber}>
                              {item.quantity}
                            </span>

                            {item.quantity > 1 ? (
                              <button
                                className={`${styles.quantityButton} ${styles.minusButton}`}
                                onClick={() =>
                                  updateQuantity(item.id, item.quantity - 1)
                                }
                              >
                                <FiMinus />
                              </button>
                            ) : (
                              <button
                                className={`${styles.quantityButton} ${styles.deleteButton}`}
                                onClick={() => removeItem(item.id)}
                              >
                                <MdDeleteOutline />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* بخش جدید: جمع کل و دکمه ثبت سفارش */}
              <div className={styles.cartSummary}>
                <div className={styles.totalPrice}>
                  <span>جمع کل:</span>
                  <span>{calculateTotal().toLocaleString()} تومان</span>
                </div>
                <button
                  className={styles.checkoutButton}
                  onClick={handleCheckout}
                  disabled={loading}
                >
                  {loading ? "در حال پردازش..." : "ثبت نهایی سفارش"}
                </button>
              </div>
            </div>
          ) : (
            !loading && <p>سبد خرید شما خالی است.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShoppingCart;
