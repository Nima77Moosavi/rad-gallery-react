// ProductTabs/ProductTabs.jsx
import { useRef, useEffect } from "react";
import { FaListUl } from "react-icons/fa";
import { MdOutlineDescription } from "react-icons/md";
import { RiRulerLine } from "react-icons/ri";
import { BsQuestionSquare } from "react-icons/bs";
import { LiaComments } from "react-icons/lia";
import styles from "./ProductTabs.module.css";

const ProductTabs = ({
  product,
  activeTab,
  setActiveTab,
  showAllReviews,
  setShowAllReviews,
  duplicatedReviews,
}) => {
  const specsRef = useRef(null);
  const descriptionRef = useRef(null);
  const dimensionsRef = useRef(null);
  const maintenanceRef = useRef(null);
  const reviewsRef = useRef(null);
  const tabContainerRef = useRef(null);
  const activeButtonRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: "specs", ref: specsRef },
        { id: "description", ref: descriptionRef },
        { id: "dimensions", ref: dimensionsRef },
        { id: "maintenance", ref: maintenanceRef },
        { id: "reviews", ref: reviewsRef },
      ];

      const scrollPosition = window.scrollY + window.innerHeight / 4;

      let currentSection = "specs";

      for (let section of sections) {
        const element = section.ref.current;
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;

          if (
            scrollPosition >= offsetTop &&
            scrollPosition < offsetTop + offsetHeight
          ) {
            currentSection = section.id;
            break;
          }
        }
      }

      setActiveTab(currentSection);
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, [setActiveTab]);

  useEffect(() => {
    if (activeButtonRef.current && tabContainerRef.current) {
      const button = activeButtonRef.current;
      const container = tabContainerRef.current;

      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.offsetWidth;
      const containerWidth = container.offsetWidth;

      const scrollTo = buttonLeft - containerWidth / 2 + buttonWidth / 2;
      container.scrollTo({ left: scrollTo, behavior: "smooth" });
    }
  }, [activeTab]);

  const scrollToSection = (ref, tabName) => {
    if (ref.current) {
      const offsetTop =
        ref.current.getBoundingClientRect().top + window.scrollY;
      const offset = window.innerWidth <= 768 ? 80 : 120;
      window.scrollTo({ top: offsetTop - offset, behavior: "smooth" });
      setActiveTab(tabName);
    }
  };

  return (
    <div className={styles.rightContainer}>
      <div className={styles.tabContainer} ref={tabContainerRef}>
        <button
          onClick={() => scrollToSection(specsRef, "specs")}
          className={activeTab === "specs" ? styles.active : ""}
          ref={activeTab === "specs" ? activeButtonRef : null}
        >
          <FaListUl className={styles.icons} /> مشخصات
        </button>
        <button
          onClick={() => scrollToSection(descriptionRef, "description")}
          className={activeTab === "description" ? styles.active : ""}
          ref={activeTab === "description" ? activeButtonRef : null}
        >
          <MdOutlineDescription className={styles.icons} /> توضیحات
        </button>
        {/* <button
          onClick={() => scrollToSection(dimensionsRef, "dimensions")}
          className={activeTab === "dimensions" ? styles.active : ""}
          ref={activeTab === "dimensions" ? activeButtonRef : null}
        >
          <RiRulerLine className={styles.icons} /> ابعاد
        </button> */}
        <button
          onClick={() => scrollToSection(maintenanceRef, "maintenance")}
          className={activeTab === "maintenance" ? styles.active : ""}
          ref={activeTab === "maintenance" ? activeButtonRef : null}
        >
          <BsQuestionSquare className={styles.icons} /> شرایط نگهداری
        </button>
        <button
          onClick={() => scrollToSection(reviewsRef, "reviews")}
          className={activeTab === "reviews" ? styles.active : ""}
          ref={activeTab === "reviews" ? activeButtonRef : null}
        >
          <LiaComments className={styles.icons} /> دیدگاه‌ها
        </button>
      </div>

      <div className={styles.detailsWrapper}>
        <div ref={specsRef} className={styles.specsSection}>
          <h2>
            <FaListUl className={styles.icons} /> مشخصات محصول
          </h2>
          <p>{product.title}</p>
        </div>
        <div ref={descriptionRef} className={styles.descriptionSection}>
          <h2>
            <MdOutlineDescription className={styles.icons} /> توضیحات
          </h2>
          <p style={{whiteSpace: 'pre-line'}}>{product.description}</p>
        </div>
        {/* <div ref={dimensionsRef} className={styles.dimensionsSection}>
          <h2>
            <RiRulerLine className={styles.icons} /> ابعاد
          </h2>
          <p>ابعاد محصول اینجا نمایش داده می‌شود.</p>
        </div> */}
        <div ref={maintenanceRef} className={styles.maintenanceSection}>
          <h2>
            <BsQuestionSquare className={styles.icons} /> شرایط نگهداری
          </h2>
          <p>شرایط نگهداری محصول اینجا نمایش داده می‌شود.</p>
        </div>
        <div ref={reviewsRef} className={styles.reviewsContainer}>
          <h2>
            <LiaComments className={styles.icons} /> دیدگاه مشتریان
          </h2>
          <div className={styles.reviewsWrapper}>
            {duplicatedReviews
              .slice(0, showAllReviews ? duplicatedReviews.length : 4)
              .map((review, index) => (
                <div className={styles.reviewCard} key={index}>
                  <p className={styles.reviewText}>{review.comment}</p>
                  <p className={styles.reviewAuthor}>{review.user}</p>
                </div>
              ))}
          </div>
          {duplicatedReviews.length > 4 && !showAllReviews && (
            <button
              className={styles.showMoreButton}
              onClick={() => setShowAllReviews(true)}
            >
              نمایش بیشتر
            </button>
          )}
          {showAllReviews && duplicatedReviews.length > 4 && (
            <button
              className={styles.showMoreButton}
              onClick={() => setShowAllReviews(false)}
            >
              نمایش کمتر
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductTabs;