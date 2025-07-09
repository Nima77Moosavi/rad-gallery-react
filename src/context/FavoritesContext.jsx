import React, { createContext, useState, useEffect } from "react";

export const FavoritesContext = createContext();

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);

  // بارگزاری علاقه‌مندی‌ها از لوکال استوریج موقع اولین بار
  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites")) || [];
    setFavorites(storedFavorites);
  }, []);

  // هر وقت علاقه‌مندی‌ها تغییر کرد، توی لوکال‌استوریج ذخیره کن
  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  // اضافه کردن محصول
  const addFavorite = (product) => {
    setFavorites((prev) => [...prev, product]);
  };

  // حذف محصول
  const removeFavorite = (id) => {
    setFavorites((prev) => prev.filter((item) => item.id !== id));
  };

  // چک کردن اینکه محصول قبلا لایک شده یا نه
  const isFavorite = (id) => {
    return favorites.some((item) => item.id === id);
  };

    // تعداد محصولات علاقه‌مندی‌ها
    const getFavoriteCount = () => {
      return favorites.length;
    };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite,
        getFavoriteCount }}>
      {children}
    </FavoritesContext.Provider>
  );
};
