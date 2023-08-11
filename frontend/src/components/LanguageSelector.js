import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(
    localStorage.getItem("language") || "en"
  );

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    localStorage.setItem("language", language);
    i18n.changeLanguage(language);
  };

  return (
    <div className="d-flex justify-content-center">
      <div>
        <button
          className="btn btn-light"
          type="button"
          onClick={() => handleLanguageChange("en")}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => handleLanguageChange("tr")}
          className="btn btn-dark"
        >
          TR
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
