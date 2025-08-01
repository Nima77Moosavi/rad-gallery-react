import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./CreateProduct.module.css";

const CreateProduct = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const [variants, setVariants] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [attributes, setAttributes] = useState([]);

  // ✅ Fetch all collections
  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/store/collections/")
      .then((res) => setCollections(res.data))
      .catch((error) => console.error("Error fetching collections:", error));
  }, []);

  // ✅ Fetch attributes when a collection is selected
  useEffect(() => {
    if (selectedCollection) {
      axios
        .get(
          `http://127.0.0.1:8000/api/store/attributes/?collection=${selectedCollection}`
        )
        .then((res) => setAttributes(res.data))
        .catch((error) => console.error("Error fetching attributes:", error));
    }
  }, [selectedCollection]);

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const handleVariantChange = (index, field, value) => {
    const updatedVariants = [...variants];
    updatedVariants[index][field] = value;
    setVariants(updatedVariants);
  };

  const addVariant = () => {
    setVariants([...variants, { price: "", stock: "", attributes: {} }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCollection) {
      alert("لطفا یک مجموعه انتخاب کنید.");
      return;
    }

    try {
      // Step 1: Create the Product
      const productFormData = new FormData();
      productFormData.append("title", title);
      productFormData.append("description", description);
      productFormData.append("collection", selectedCollection);

      const productResponse = await axios.post(
        "http://127.0.0.1:8000/api/store/products/",
        productFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const product = productResponse.data;
      console.log("Product Created:", product);

      // Step 2: Upload Images
      if (images.length > 0) {
        const imageFormData = new FormData();
        images.forEach((image) => imageFormData.append("images", image));
        imageFormData.append("product", product.id); // Attach product ID to the image upload

        await axios.post(
          "http://127.0.0.1:8000/api/store/product-images/",
          imageFormData,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        console.log("Images Uploaded Successfully");
      }

      alert("محصول با موفقیت ایجاد شد!");
    } catch (error) {
      console.error("Error:", error);
      alert("خطا در ایجاد محصول. لطفاً دوباره امتحان کنید.");
    }
  };

  return (
    <div className={styles.createProductContainer}>
      <h1>ایجاد محصول جدید</h1>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>عنوان محصول</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>توضیحات</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        <label>مجموعه</label>
        <select
          value={selectedCollection}
          onChange={(e) => setSelectedCollection(e.target.value)}
          required
        >
          <option value="">انتخاب مجموعه</option>
          {collections.map((col) => (
            <option key={col.id} value={col.id}>
              {col.title}
            </option>
          ))}
        </select>

        <label>تصاویر</label>
        <input type="file" multiple onChange={handleImageChange} />

        <h2>تنوع‌های محصول</h2>
        {variants.map((variant, index) => (
          <div key={index} className={styles.variantContainer}>
            <label>قیمت</label>
            <input
              type="number"
              value={variant.price}
              onChange={(e) =>
                handleVariantChange(index, "price", e.target.value)
              }
              required
            />
            <label>موجودی</label>
            <input
              type="number"
              value={variant.stock}
              onChange={(e) =>
                handleVariantChange(index, "stock", e.target.value)
              }
              required
            />

            {attributes.map((attr) => (
              <div key={attr.id}>
                <label>{attr.name}</label>
                <select
                  onChange={(e) =>
                    handleVariantChange(index, "attributes", {
                      ...variant.attributes,
                      [attr.id]: e.target.value,
                    })
                  }
                >
                  <option value="">انتخاب کنید</option>
                  {attr.values.map((value) => (
                    <option key={value.id} value={value.id}>
                      {value.value}
                    </option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        ))}
        <button type="button" onClick={addVariant}>
          افزودن تنوع
        </button>
        <button type="submit">ایجاد محصول</button>
      </form>
    </div>
  );
};

export default CreateProduct;
