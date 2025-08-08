import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import MediaPlayer from "../MediaPlayer/MediaPlayer";
import styles from "./HighlightMedia.module.css";
import { IoClose } from "react-icons/io5";
import { GrFormNext, GrFormPrevious } from "react-icons/gr";
import PuffLoader from "react-spinners/PuffLoader";

const HighlightMedia = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(null);
  const [allHighlight, setAllHighlight] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [currentHighlightIndex, setCurrentHighlightIndex] = useState(0);
  const [progressKey, setProgressKey] = useState(0);

  useEffect(() => {
    const fetchHighlightMedia = async () => {
      try {
        const response = await fetch(
          `https://rad-gallery-api.liara.run/api/highlights/highlights/${id}/`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setHighlight(data);

        const highlightIndex = allHighlight.findIndex(
          (h) => h.id === parseInt(id)
        );
        if (highlightIndex !== -1) {
          setCurrentHighlightIndex(highlightIndex);
          setCurrentMediaIndex(0);
          setProgressKey((prev) => prev + 1);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlightMedia();
  }, [id, allHighlight]);

  useEffect(() => {
    const fetchAllHighlightMedia = async () => {
      try {
        const response = await fetch(
          `https://rad-gallery-api.liara.run/api/highlights/highlights/`
        );
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setAllHighlight(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAllHighlightMedia();
  }, []);

  useEffect(() => {
    if (allHighlight.length === 0) return;
    const interval = setInterval(() => {
      goToNextMedia();
    }, 10000);
    return () => clearInterval(interval);
  }, [allHighlight, currentHighlightIndex, currentMediaIndex]);

  const goToNextMedia = () => {
    const currentHighlight = allHighlight[currentHighlightIndex];
    if (currentMediaIndex < currentHighlight.media.length - 1) {
      setCurrentMediaIndex((prev) => prev + 1);
    } else {
      if (currentHighlightIndex < allHighlight.length - 1) {
        setCurrentHighlightIndex((prev) => prev + 1);
        setCurrentMediaIndex(0);
      } else {
        setCurrentHighlightIndex(0);
        setCurrentMediaIndex(0);
      }
    }
    setProgressKey((prev) => prev + 1);
  };

  const goToPreviousMedia = () => {
    if (currentMediaIndex > 0) {
      setCurrentMediaIndex((prev) => prev - 1);
    } else {
      if (currentHighlightIndex > 0) {
        const previousHighlight = allHighlight[currentHighlightIndex - 1];
        setCurrentHighlightIndex((prev) => prev - 1);
        setCurrentMediaIndex(previousHighlight.media.length - 1);
      } else {
        const lastHighlight = allHighlight[allHighlight.length - 1];
        setCurrentHighlightIndex(allHighlight.length - 1);
        setCurrentMediaIndex(lastHighlight.media.length - 1);
      }
    }
    setProgressKey((prev) => prev + 1);
  };

  const handleClose = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <PuffLoader color="#499c7f" size={65} />
      </div>
    );
  }

  if (error) return <div>Error: {error}</div>;
  if (!allHighlight || allHighlight.length === 0)
    return <div>No highlights found.</div>;

  const currentHighlight = allHighlight[currentHighlightIndex];
  const currentMedia = currentHighlight.media[currentMediaIndex];

  return (
    <div className={styles.overlay}>
      <div className={styles.card}>
        <div key={progressKey} className={styles.progressBarContainer}>
          <div className={styles.progressBar}></div>
        </div>

        <button onClick={handleClose} className={styles.closeButton}>
          <IoClose />
        </button>

        <h2 className={styles.title}>{currentHighlight.title}</h2>

        {/* Media container */}
        <div className={styles.mediaContainer}>
          {/* Navigation buttons */}
          <button 
            onClick={goToPreviousMedia} 
            className={`${styles.navButton} ${styles.prevButton}`}
          >
            <GrFormPrevious className={styles.navIcon}/>
          </button>
          
          <div className={styles.mediaItem}>
            <MediaPlayer media={currentMedia} />
          </div>
          
          <button 
            onClick={goToNextMedia} 
            className={`${styles.navButton} ${styles.nextButton}`}
          >
            <GrFormNext className={styles.navIcon}/>
          </button>
        </div>

        {/* Media indicators */}
        <div className={styles.highlightIndicator}>
          {allHighlight.map((_, index) => (
            <span
              key={index}
              className={`${styles.indicatorDot} ${
                index === currentHighlightIndex ? styles.active : ""
              }`}
            ></span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HighlightMedia;