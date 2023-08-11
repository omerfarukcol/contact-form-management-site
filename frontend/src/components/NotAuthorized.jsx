import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotAuthorized = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t("notAuthorized1")}</h2>
      <p>{t("notAuthorized2")}</p>
      <Link to="/">{t("goHomepage")}</Link>
    </div>
  );
};

export default NotAuthorized;
