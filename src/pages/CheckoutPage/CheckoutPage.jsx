import React, { useState, useEffect, useRef } from "react";
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

      // 1) Create the order on your server
      const { data: order } = await axiosInstance.post("/api/store/orders/", {
        shipping_address_id: selectedAddressId,
      });

      // 2) Kick off ZarinPal payment
      //    We assume `order.total_price` (or similar) is returned by your API
      const { data: payRes } = await axiosInstance.post(
        "/api/zarinpal/request/",
        {
          amount: order.total, // e.g. 125000
          description: `سفارش شماره ${order.id}`, // any text you like
          // email: order.customer_email, // optional
          // mobile: order.customer_mobile, // optional
        }
      );

      // 3) Redirect to ZarinPal’s payment gateway
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
      <form onSubmit={handleSubmit}>
        {/* …address selector markup… */}
        <ul className={styles.addressList}>
          {addresses.map((addr) => (
            <li key={addr.id}>
              <label>
                <input
                  type="radio"
                  name="selectedAddress"
                  value={addr.id}
                  onChange={() => setSelected(addr.id)}
                />
                {addr.state}، {addr.city}، {addr.address}
              </label>
            </li>
          ))}
        </ul>

        <button type="submit" disabled={loading}>
          {loading ? "در حال انتقال به درگاه…" : "پرداخت و ثبت سفارش"}
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
