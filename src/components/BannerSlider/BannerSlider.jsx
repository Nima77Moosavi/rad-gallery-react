// src/components/BannerSlider/BannerSlider.jsx
import React, { useState, useEffect, useRef, useCallback } from "react";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import styles from "./BannerSlider.module.css";

// Import banner images
import banner1 from "../../assets/banner88.png";
import banner2 from "../../assets/banner99.png";
import banner3 from "../../assets/banner66.png";

const BannerSlider = () => {
  // Original slides
  const realSlides = [banner1, banner2, banner3];
  
  // Create infinite loop by cloning first and last slides
  const slides = [
    realSlides[realSlides.length - 1], // Clone of last slide
    ...realSlides,                     // Original slides
    realSlides[0],                     // Clone of first slide
  ];

  const [currentIndex, setCurrentIndex] = useState(1); // Start at first real slide
  const [transitionEnabled, setTransitionEnabled] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const trackRef = useRef(null);
  const autoPlayTimer = useRef(null);

  // Handle next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev >= slides.length - 1) return prev; // Wait for transition end
      return prev + 1;
    });
  }, [slides.length]);

  // Handle previous slide
  const prevSlide = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev <= 0) return prev; // Wait for transition end
      return prev - 1;
    });
  }, []);

  // Reset position when reaching cloned slides
  const handleTransitionEnd = useCallback(() => {
    if (currentIndex >= slides.length - 1) {
      setTransitionEnabled(false);
      setCurrentIndex(1); // Jump to first real slide
    } else if (currentIndex <= 0) {
      setTransitionEnabled(false);
      setCurrentIndex(slides.length - 2); // Jump to last real slide
    }
  }, [currentIndex, slides.length]);

  // Re-enable transition after reset
  useEffect(() => {
    if (!transitionEnabled) {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    }
  }, [transitionEnabled]);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying) {
      autoPlayTimer.current = setInterval(() => {
        nextSlide();
      }, 3000);
    } else {
      clearInterval(autoPlayTimer.current);
    }

    return () => clearInterval(autoPlayTimer.current);
  }, [isAutoPlaying, nextSlide]);

  // Pause on hover
  const handleMouseEnter = () => setIsAutoPlaying(false);
  const handleMouseLeave = () => setIsAutoPlaying(true);

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nextSlide, prevSlide]);

  return (
    <div 
      className={styles.bannerWrapper}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.sliderWindow}>
        {/* Navigation buttons */}
        <button
          className={`${styles.navButton} ${styles.prevButton}`}
          onClick={prevSlide}
          aria-label="Previous slide"
        >
          <GrFormPrevious />
        </button>
        <button
          className={`${styles.navButton} ${styles.nextButton}`}
          onClick={nextSlide}
          aria-label="Next slide"
        >
          <GrFormNext />
        </button>

        {/* Slides track */}
        <div className={styles.trackContainer}>
          <div
            ref={trackRef}
            className={styles.track}
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
              transition: transitionEnabled ? 'transform 0.5s ease-in-out' : 'none',
            }}
            onTransitionEnd={handleTransitionEnd}
          >
            {slides.map((slide, index) => (
              <div key={index} className={styles.slide}>
                <img 
                  src={slide} 
                  alt={`Banner ${index}`} 
                  className={styles.slideImage}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Pagination indicators */}
        <div className={styles.pagination}>
          {realSlides.map((_, index) => (
            <button
              key={index}
              className={`${styles.paginationDot} ${
                currentIndex === index + 1 ? styles.activeDot : ''
              }`}
              onClick={() => setCurrentIndex(index + 1)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BannerSlider;