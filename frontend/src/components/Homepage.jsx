import React from "react";
import ContactForm from "./ContactForm";
import NavigationBar from "./NavigationBar";
import { useTranslation } from "react-i18next";
import "../App.css";

const Homepage = () => {
  const { t } = useTranslation();

  return (
    <div className="has-bg-image">
      <div>
        <NavigationBar />
      </div>
      <div
        style={{ display: "flex", alignItems: "center" }}
        className="homepage-style"
      >
        <div
          className="p-5 m-5 rounded"
          style={{ backgroundColor: "rgb(179, 179, 179)", flex: 1 }}
        >
          <ContactForm />
        </div>
        <div style={{ flex: 1 }}>
          <div className="container">
            <h1 className="custom-h1">{t("manageYourContacts")}</h1>
            <br />
            <h1 className="custom-h1">{t("easily")}</h1>
          </div>
        </div>
      </div>
      <div style={{ clear: "both" }}></div>
    </div>
  );
};

export default Homepage;
