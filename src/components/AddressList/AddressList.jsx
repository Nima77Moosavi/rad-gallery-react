import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import styles from "./AddressList.module.css";
import { FiTrash2 } from "react-icons/fi";

const AddressList = ({ refresh }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Fetch all shipping addresses for the current customer.
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/store/shipping-addresses/");
      setAddresses(Array.isArray(response.data) ? response.data : []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching addresses:", err);
      setError("خطا در بارگذاری آدرس‌ها");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, [refresh]); // Re-fetch whenever refresh flag changes

  // Handle deletion of an address.
  const handleDelete = async (id) => {
    try {
      await axiosInstance.delete(`/api/store/shipping-addresses/${id}/`);
      setAddresses(addresses.filter((address) => address.id !== id));
    } catch (err) {
      console.error("Error deleting address:", err);
      setError("خطا در حذف آدرس");
    }
  };

  return (
    <div className={styles.addressList}>
      <h2>آدرس های شما</h2>
      {loading && <p>در حال بارگذاری آدرس‌ها...</p>}
      {error && <p className={styles.error}>{error}</p>}
      {(!addresses || addresses.length === 0) && !loading ? (
        <p>هیچ آدرسی یافت نشد.</p>
      ) : (
        <ul>
          {addresses.map((address) => (
            <li key={address.id} className={styles.addressItem}>
              <p>
                <strong>استان:</strong> {address.state}
              </p>
              <p>
                <strong>شهر:</strong> {address.city}
              </p>
              <p>
                <strong>آدرس:</strong> {address.address}
              </p>
              <p>
                <strong>کد پستی:</strong> {address.postal_code}
              </p>
              <button
                onClick={() => handleDelete(address.id)}
                className={styles.deleteButton}
              >
                <FiTrash2 />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AddressList;
