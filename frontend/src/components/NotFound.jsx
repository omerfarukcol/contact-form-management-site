import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div>
      <h2>{t("pageNotFound")}</h2>
      <p>{t("pageDontExist")}</p>
      <Link to="/">{t("goHomepage")}</Link>
    </div>
  );
};

export default NotFound;
