import React, { useEffect, useState } from "react";
import HighlightCard from "../HighlightCard/HighlightCard";
import styles from "./Highlights.module.css";
import PropagateLoader from "react-spinners/PropagateLoader";

const Highlights = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        const response = await fetch(
          "https://kimiatoranj-api.liara.run/api/highlights/highlights/"
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setHighlights(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, []);

  if (loading) {
    return (
      <div>
        <PropagateLoader color="#fde50a" size={20} />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.highlightsWrapper}>
      <div className={styles.highlightsContainer}>
        <div className={styles.highlights}>
          {highlights.map((highlight) => (
            <HighlightCard key={highlight.id} highlight={highlight} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Highlights;
