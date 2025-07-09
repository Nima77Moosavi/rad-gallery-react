// PostDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config"; // Adjust your import path as needed
import styles from "./BlogDetail.module.css";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const BlogDetail = () => {
  const { id } = useParams(); // Extract the post id from URL params
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}api/blog/posts/${id}/`)
      .then((response) => {
        setPost(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setError("خطا در بارگذاری مطلب");
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className={styles.postDetailContainer}>در حال بارگذاری...</div>;
  }

  if (error) {
    return <div className={styles.postDetailContainer}>{error}</div>;
  }

  if (!post) {
    return <div className={styles.postDetailContainer}>مطلبی یافت نشد!</div>;
  }

  return (
    <>
      <Header />
      <div className={styles.postDetailContainer}>
        <h1 className={styles.postTitle}>{post.title}</h1>
        {post.images && post.images.length > 0 && (
          <img
            src={post.images[0].image}
            alt={post.title}
            className={styles.postImage}
          />
        )}
        <div className={styles.postContent}>{post.content}</div>
      </div>
      <Footer />
    </>
  );
};

export default BlogDetail;
