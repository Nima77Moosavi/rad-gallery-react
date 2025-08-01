import { useState } from "react";
import styles from "./ReviewForm.module.css";
import { FaStar } from "react-icons/fa";

const ReviewForm = ({ productId, onSubmit }) => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rating) {
      setError("لطفا امتیاز دهید");
      return;
    }
    
    if (!comment.trim()) {
      setError("لطفا نظر خود را بنویسید");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    
    try {
      if (onSubmit) {
        await onSubmit({ productId, rating, comment });
      }
      
      setSuccess(true);
      setComment("");
      setRating(0);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError("خطا در ارسال نظر");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.compactContainer}>
      <h4 className={styles.compactTitle}>ثبت نظر</h4>
      
      <form onSubmit={handleSubmit} className={styles.compactForm}>
        <div className={styles.compactRating}>
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              type="button"
              key={star}
              className={`${styles.compactStar} ${
                star <= (hoverRating || rating) ? styles.compactFilled : ""
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              <FaStar className={styles.icon} />
            </button>
          ))}
        </div>
        
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="نظر شما..."
          className={styles.compactTextarea}
          rows={3}
        />
        
        <div className={styles.compactFooter}>
          {error && <span className={styles.compactError}>{error}</span>}
          {success && <span className={styles.compactSuccess}>✓</span>}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className={styles.compactButton}
          >
            {isSubmitting ? "..." : "ارسال نظر"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;