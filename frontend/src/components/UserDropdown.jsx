import React, { useState, useEffect } from "react";
import Dropdown from "react-bootstrap/Dropdown";
import LogoutButton from "./LogoutButton";
import BringUserInformation from "./BringUserInformation";
import LanguageSelector from "./LanguageSelector.js";
import { useTranslation } from "react-i18next";

const UserDropdown = () => {
  let user = BringUserInformation();
  const [theme, setTheme] = useState("light");
  const { t } = useTranslation();

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-bs-theme", savedTheme);
    }
  }, []);

  const lightTheme = () => {
    const newTheme = theme === "dark" ? "light" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  const darkTheme = () => {
    const newTheme = theme === "light" ? "dark" : "dark";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-bs-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle
        variant="success"
        id="dropdown-basic"
        className="temp-class"
      >
        <img
          src={user.base64Photo}
          alt="Converted"
          className="rounded-circle img-thumbnail user-photo dropdown-toggle"
          data-toggle="dropdown"
          style={{ height: "5vh" }}
        />
      </Dropdown.Toggle>

      <Dropdown.Menu>
        <Dropdown.Header>
          {t("welcome")}{" "}
          <span>
            <strong>{user.username}</strong>
          </span>
        </Dropdown.Header>
        <div className="dropdown-divider"></div>
        <div className="d-flex justify-content-center">
          <div>
            <button
              type="button"
              onClick={lightTheme}
              className="btn btn-light btn-sm"
            >
              {t("light")}
            </button>
            <button
              type="button"
              onClick={darkTheme}
              className="btn btn-dark btn-sm"
            >
              {t("dark")}
            </button>
          </div>
        </div>

        <div className="dropdown-divider"></div>
        <div className="menu">
          <LanguageSelector />
        </div>
        <div className="dropdown-divider"></div>
        <div className="d-flex justify-content-center">
          <LogoutButton />
        </div>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default UserDropdown;
