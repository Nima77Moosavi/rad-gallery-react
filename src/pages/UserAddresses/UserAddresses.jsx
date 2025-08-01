import React, { useState } from "react";
import AddressList from "../../components/AddressList/AddressList";
import AddressForm from "../../components/AddressForm/AddressForm";
import styles from "./UserAddresses.module.css";

const UserAddresses = () => {
  // A simple flag that increments whenever a new address is added.
  const [refreshFlag, setRefreshFlag] = useState(0);

  // This callback gets called from AddressForm on successful submission.
  const handleAddressAdded = (newAddress) => {
    // Increment the refresh flag to trigger a re-fetch in AddressList.
    setRefreshFlag((prev) => prev + 1);
  };

  return (
    <div className={styles.addressesPage}>
      <AddressList refresh={refreshFlag} />
      <AddressForm onAddressAdded={handleAddressAdded} />
    </div>
  );
};

export default UserAddresses;
