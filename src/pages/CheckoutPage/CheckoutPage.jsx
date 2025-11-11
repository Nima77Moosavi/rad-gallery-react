import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./CheckoutPage.module.css";

const CheckoutPage = () => {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setLoading(true);
        const { data } = await axiosInstance.get("/api/store/shipping-addresses/");
        setAddresses(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Failed to load addresses:", err);
        setError("خطا در بارگذاری آدرس‌ها");
      } finally {
        setLoading(false);
      }
    };
    fetchAddresses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!selectedAddressId) {
      setError("لطفاً یک آدرس انتخاب کنید");
      return;
    }

    try {
      setLoading(true);

      // 🔹 Call the combined endpoint that creates order + payment
      const { data } = await axiosInstance.post("/api/store/orders/create-pay/", {
        shipping_address_id: selectedAddressId,
      });

      // 🔹 Redirect to ZarinPal gateway
      window.location.href = data.pay_url;
    } catch (err) {
      console.error("Checkout error:", err);
      setError(
        err.response?.data?.error ||
          "خطا در شروع فرآیند پرداخت. لطفاً دوباره تلاش کنید."
      );
    } finally {
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
                    onChange={() => setSelectedAddressId(addr.id)}
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
