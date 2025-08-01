import React, { useState } from "react";
import styles from "./CreateCollection.module.css";

const CreateCollection = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Prepare the form data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    // Send the data to the backend API
    fetch("http://127.0.0.1:8000/api/store/collections/", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Collection created successfully!");
        // Redirect or clear form (depending on your requirement)
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <div className={styles.createCollectionContainer}>
      <h1>ایجاد مجموعه جدید</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div>
          <label>عنوان مجموعه</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>توضیحات</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label>تصویر</label>
          <input
            type="file"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>
        <button type="submit">ایجاد مجموعه</button>
      </form>
    </div>
  );
};

export default CreateCollection;
