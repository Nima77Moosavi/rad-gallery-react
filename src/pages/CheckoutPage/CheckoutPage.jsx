import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchAddresses() {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get(
          "/api/store/shipping-addresses/"
        );
        setAddresses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        setError("خطا در بارگذاری آدرس‌ها");
      } finally {
        setLoading(false);
      }
    }
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedAddressId) {
      setError("لطفاً یک آدرس انتخاب کنید");
      return;
    }
    try {
      setLoading(true);
      setError("");

      // 1) Fetch cart to calculate total amount
      const { data: cart } = await axiosInstance.get("/api/store/cart");
      const amount = cart.items.reduce(
        (total, item) =>
          total + item.product_variant.price * item.quantity,
        0
      );

      if (amount <= 0) {
        setError("سبد خرید شما خالی است یا مبلغ معتبر ندارد");
        setLoading(false);
        return;
      }

      // 2) Create the order with required fields
      const { data: order } = await axiosInstance.post("/api/store/orders/", {
        shipping_address_id: selectedAddressId,
        amount, // backend requires this
      });

      // 3) Kick off ZarinPal payment
      const { data: payRes } = await axiosInstance.post(
        "/api/zarinpal/request/",
        {
          amount: order.amount,
          description: `سفارش شماره ${order.id}`,
          order_id: order.id,
        }
      );

      // 4) Redirect to ZarinPal's payment gateway
      window.location.href = payRes.pay_url;
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error ||
          "خطا در شروع فرآیند پرداخت. لطفاً دوباره تلاش کنید."
      );
      setLoading(false);
    }
  };

  return (
    <div className={styles.checkoutPage}>
      <h2>تأیید نهایی سفارش</h2>
      {error && <p className={styles.error}>{error}</p>}
      
      <div className={styles.addressHeader}>
        <h3>انتخاب آدرس ارسال</h3>
        <Link to="/user-panel/addresses" className={styles.addAddressButton}>
          + افزودن آدرس جدید
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        {addresses.length === 0 ? (
          <div className={styles.noAddress}>
            <p>هیچ آدرسی ثبت نشده است</p>
            <Link to="/addresses" className={styles.primaryButton}>
              ثبت آدرس جدید
            </Link>
          </div>
        ) : (
          <ul className={styles.addressList}>
            {addresses.map((addr) => (
              <li key={addr.id} className={styles.addressItem}>
                <label>
                  <input
                    type="radio"
                    name="selectedAddress"
                    value={addr.id}
                    onChange={() => setSelected(addr.id)}
                    checked={selectedAddressId === addr.id}
                  />
                  <div className={styles.addressDetails}>
                    <span className={styles.addressText}>
                      {addr.state}، {addr.city}، {addr.address}
                    </span>
                    {addr.postal_code && (
                      <span className={styles.postalCode}>
                        کد پستی: {addr.postal_code}
                      </span>
                    )}
                  </div>
                </label>
              </li>
            ))}
          </ul>
        )}

        {addresses.length > 0 && (
          <button 
            type="submit" 
            disabled={loading || !selectedAddressId}
            className={styles.submitButton}
          >
            {loading ? "در حال انتقال به درگاه…" : "پرداخت و ثبت سفارش"}
          </button>
        )}
      </form>
    </div>
  );
};

export default CheckoutPage;
