import React, { useEffect, useState } from "react";
import HighlightCard from "../HighlightCard/HighlightCard";
import HighlightCardSkeleton from "../HighlightCard/HighlightCard.Skeleton";
import styles from "./Highlights.module.css";

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await fetch(
          "https://rad-gallery-api.liara.run/api/highlights/highlights/"
        );
        if (!res.ok) throw new Error("Network response was not ok");
        const data = await res.json();
        setHighlights(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHighlights();
  }, []);

  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }

  return (
    <div className={styles.highlightsWrapper}>
      <div className={styles.highlightsContainer}>
        <div className={styles.highlights}>
          {loading ? (
            // Show skeleton loaders while loading
            Array(12)
              .fill(0)
              .map((_, index) => <HighlightCardSkeleton key={`skeleton-${index}`} />)
          ) : (
            // Show actual highlight cards when data is loaded
            highlights.map((highlight) => (
              <HighlightCard key={highlight.id} highlight={highlight} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Highlights;