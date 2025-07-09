import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoute = () => {
  const accessToken = localStorage.getItem("access_token");
  const isAdmin = localStorage.getItem("is_admin") === "true"; // Convert string to boolean

  return accessToken && isAdmin ? <Outlet /> : <Navigate to="/login" />;
};

export default AdminRoute;
