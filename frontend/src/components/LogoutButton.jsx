import React from "react";
import axios from "axios";
import { Navigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const LogoutButton = () => {
  const { t } = useTranslation();
  const handleLogout = async () => {
    try {
      const jwtToken = localStorage.getItem("jwtToken");

      if (!jwtToken) {
        console.error("JWT token not found in localStorage");
        return;
      }
      await axios.post("http://localhost:5165/api/user/logout", null, {
        headers: {
          token: jwtToken,
        },
      });

      localStorage.removeItem("jwtToken");

      <Navigate to={"/"} />;
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button className="btn btn-outline-danger" onClick={handleLogout}>
      {t("logout")}
    </button>
  );
};

export default LogoutButton;
