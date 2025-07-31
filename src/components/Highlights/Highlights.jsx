import React, { useEffect, useState } from "react";
import HighlightCard from "../HighlightCard/HighlightCard";
import HighlightCardSkeleton from "../HighlightCard/HighlightCard.Skeleton"; // ← new
import styles from "./Highlights.module.css";

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const res = await fetch(
          "https://kimiatoranj-api.liara.run/api/highlights/highlights/"
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
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.highlightsWrapper}>
      <div className={styles.highlightsContainer}>
        <div className={styles.highlights}>
          {loading
            ? Array.from({ length: 12 }).map((_, i) => (
                <HighlightCardSkeleton key={i} />
              ))
            : highlights.map((hl) => (
                <HighlightCard key={hl.id} highlight={hl} />
              ))}
        </div>
      </div>
    </div>
  );
};

export default Highlights;
