import React from "react";
import ReviewsList from "../../components/ReviewsList/ReviewsList";
import styles from "./UserReviews.module.css";

const UserReviews = () => {
  return (
    <div className={styles.reviewsPage}>
      {/* <h2>دیدگاه‌های من</h2> */}
      <ReviewsList />
    </div>
  );
};

export default UserReviews;
