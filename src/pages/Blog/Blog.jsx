// Blog.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./Blog.module.css";
import axios from "axios";
import { BASE_URL, API_URL } from "../../config"; // Optional: if you’re using a constants file
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch posts when the component mounts
  useEffect(() => {
    axios
      .get(`${API_URL}api/blog/posts/`)
      .then((response) => {
        setPosts(response.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Error loading posts.");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className={styles.blogContainer}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.blogContainer}>{error}</div>;
  }

  // Separate the first 3 posts as top posts, and the rest as other posts.
  const topPosts = posts.slice(0, 4);
  const otherPosts = posts.slice(3);

  return (
    <>
      <Header />
      <div className={styles.blogContainer}>
        <h1 className={styles.title}>مقالات پربازدید</h1>

        {/* Top Posts: first 3 posts in a grid */}
        <div className={styles.topPosts}>
          {topPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className={styles.topPostLink}
            >
              <div className={styles.topPost}>
                {/* Display the first image if it exists */}
                {post.images && post.images.length > 0 && (
                  <img
                    src={post.images[0].image}
                    alt={post.title}
                    className={styles.postImage}
                  />
                )}
                <h2 className={styles.postTitle}>{post.title}</h2>
                <p className={styles.postContent}>{post.content}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Other posts: remaining posts in list view */}
        <div className={styles.posts}>
          {otherPosts.map((post) => (
            <Link
              key={post.id}
              to={`/blog/${post.id}`}
              className={styles.postLink}
            >
              <div className={styles.post}>
                {post.images && post.images.length > 0 && (
                  <img
                    src={post.images[0].image}
                    alt={post.title}
                    className={styles.postSideImage}
                  />
                )}
                <div className={styles.postText}>
                  <h2 className={styles.postTitle}>{post.title}</h2>
                  <p className={styles.postContent}>{post.content}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Blog;
