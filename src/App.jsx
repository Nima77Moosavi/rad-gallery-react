import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Import your layout, ProtectedRoute, and pages
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import UserPanel from "./pages/UserPanel/UserPanel.jsx";
import AccountInfo from "./pages/AccountInfo/AccountInfo";
import ShoppingCart from "./pages/ShoppingCart/ShoppingCart";
import UserOrders from "./pages/UserOrders/UserOrders";
import Wishlist from "./pages/WishList/WishList";
import UserReviews from "./pages/UserReviews/UserReviews";
import UserAddresses from "./pages/UserAddresses/UserAddresses";

// Public pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login/Login";
import Blog from "./pages/Blog/Blog";
import BlogDetail from "./pages/BlogDetail/BlogDetail.jsx";
import HighlightMedia from "./components/HighlightMedia/HighlightMedia";
import CollectionDetail from "./pages/CollectionDetail/CollectionDetail";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import BestsellersPage from "./pages/BestsellersPage/BestsellersPage";
import ContactButton from "./components/ContactButton/ContactButton.jsx";
import FooterMenu from "./components/FooterMenu/FooterMenu.jsx";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage.jsx";
import Shop from "./pages/Shop/Shop.jsx";
import GiftSelector from "./pages/GiftSelector/GiftSelector.jsx";
import ScrollToTop from "./utils/ScrollToTop.jsx";
import CollectionProducts from "./pages/CollectionProducts/CollectionProducts.jsx";
import Collections from "./components/Collections/Collections.jsx";

const App = () => {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/highlight/:id" element={<HighlightMedia />} />
        <Route path="/collection/:id" element={<CollectionDetail />} />
        <Route path="/productDetails/:slugAndId" element={<ProductDetails />} />
        <Route path="/bestsellersPage" element={<BestsellersPage />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/gift-selector" element={<GiftSelector />} />
        <Route path="/collections/:collectionId" element={<CollectionProducts />} />
        <Route path="/collections" element={<Collections />} />
        {/* Protected UserPanel Routes */}
        <Route
          path="/user-panel/*"
          element={
            <ProtectedRoute>
              <UserPanel />
            </ProtectedRoute>
          }
        >
          {/* Default /user-panel shows AccountInfo */}
          <Route path="account-info" element={<AccountInfo />} />
          <Route path="cart" element={<ShoppingCart />} />
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="reviews" element={<UserReviews />} />
          <Route path="addresses" element={<UserAddresses />} />
        </Route>

        {/* Fallback Route */}
        <Route path="*" element={<Home />} />
      </Routes>
      <ContactButton />
      <FooterMenu />
    </Router>
  );
};

export default App;
