import { useState } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "./ImageSlider.module.css";

const ImageSlider = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  if (!images || images.length === 0) {
    return <div>No images available</div>;
  }

  return (
    <div className={styles.sliderContainer}>
      <img
        src={images[currentImage].image}
        alt={`product image ${currentImage + 1}`}
        className={styles.sliderImage}
      />
      <GrFormNext
        className={styles.prevButton}
        onClick={() =>
          setCurrentImage((prev) =>
            prev === 0 ? images.length - 1 : prev - 1
          )
        }
      />
      <GrFormPrevious
        className={styles.nextButton}
        onClick={() =>
          setCurrentImage((prev) =>
            prev === images.length - 1 ? 0 : prev + 1
          )
        }
      />
      <div className={styles.thumbnailContainer}>
        {images.map((img, index) => (
          <img
            key={index}
            src={img.image}
            alt={`thumbnail ${index + 1}`}
            className={`${styles.thumbnail} ${
              index === currentImage ? styles.activeThumbnail : ""
            }`}
            onClick={() => setCurrentImage(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;