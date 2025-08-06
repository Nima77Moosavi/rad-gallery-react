// src/components/BannerSlider/BannerSlider.jsx
import React, { useState, useEffect, useRef } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "./BannerSlider.module.css";

import banner1 from "../../assets/banner88.png";
import banner2 from "../../assets/banner99.png";
import banner3 from "../../assets/banner66.png";
import patternImg from "../../assets/forground-banner.png";

const BannerSlider = () => {
  // your "real" slides
  const realSlides = [banner1, banner2, banner3];

  // build an infinite-loop track with clones at front/back
  const slides = [
    realSlides[realSlides.length - 1],
    ...realSlides,
    realSlides[0],
  ];

  const [idx, setIdx] = useState(1); // start on first real slide
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const trackRef = useRef(null);

  // go forward one slide
  const nextSlide = () => {
    setIdx((prev) => prev + 1);
  };

  // go backward one slide
  const prevSlide = () => {
    setIdx((prev) => prev - 1);
  };

  // when a transition ends, if we're on a clone, jump to its mirror without animating
  const onTransitionEnd = () => {
    if (idx === slides.length - 1) {
      setTransitionEnabled(false);
      setIdx(1);
    } else if (idx === 0) {
      setTransitionEnabled(false);
      setIdx(slides.length - 2);
    }
  };

  // re-enable transition immediately after a "snap"
  useEffect(() => {
    if (!transitionEnabled) {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    }
  }, [transitionEnabled]);

  // autoplay every 3 seconds
  useEffect(() => {
    const timer = setInterval(nextSlide, 3000);
    return () => clearInterval(timer);
  }, [idx]); // add idx to dependencies to avoid stale closures

  return (
    <div className={styles.bannerWrapper}>
      {/* Slider window */}
      <div className={styles.sliderWindow}>
        {/* Prev/Next buttons */}
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={prevSlide}
        >
          <GrFormPrevious />
        </button>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={nextSlide}
        >
          <GrFormNext />
        </button>

        {/* The track */}
        <div className={styles.trackContainer}>
          <div
            ref={trackRef}
            className={styles.track}
            style={{
              transform: `translateX(-${idx * 100}%)`,
              transition: transitionEnabled ? "transform 0.5s ease" : "none",
            }}
            onTransitionEnd={onTransitionEnd}
          >
            {slides.map((src, i) => (
              <div key={i} className={styles.slide}>
                <img
                  src={src}
                  alt={`banner-${i}`}
                  className={styles.slideImage}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;