import React from "react";

const Dashboard = () => {
  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h1>🚀 خوش آمدید!</h1>
      <p>شما وارد شده‌اید.</p>
      <button
        onClick={() => {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          window.location.href = "/login"; // Redirect to login
        }}
      >
        خروج از حساب
      </button>
    </div>
  );
};

export default Dashboard;
