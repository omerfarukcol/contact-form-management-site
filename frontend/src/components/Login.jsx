import React, { useState } from "react";
import axios from "axios";
import UseError from "./useError";
import loginPhoto from "../login.png";
import { useTranslation } from "react-i18next";
import "../App.css";

const Login = ({ onLoginSuccess }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const { errors, addError, removeError, clearErrors } = UseError();
  const [visible, setVisible] = useState(false);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleClick = () => {
    if (visible === true) {
      setVisible(false);
    } else if (visible === false) {
      setVisible(true);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    clearErrors();

    try {
      const response = await axios.post(
        "http://localhost:5165/api/user/login",
        formData
      );
      const jwtToken = response.data.data.token;
      localStorage.setItem("jwtToken", jwtToken);
      console.log("Logged in successfully!", response.data);
      onLoginSuccess(true);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        addError(error.response.data.error);
      } else {
        addError("An error occurred during login.");
      }
    }
  };

  return (
    <div className="login-container">
      <div className="container mt-5">
        <h1 className="display-1">CONTACT MANAGEMENT APP</h1>
        <br />
        <br />
        <h2 className="display-3">{t("login")}</h2>
        <br />
        {errors.length > 0 && (
          <div
            className="alert alert-danger alert-dismissible fade show"
            role="alert"
          >
            {errors.map((error, index) => (
              <div key={index}>
                {error}
                <button
                  className="btn-close"
                  onClick={() => removeError(index)}
                ></button>
              </div>
            ))}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>{t("username")}</label>
            <input
              autoComplete="off"
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="form-group">
            <label>{t("password")}</label>
            <input
              type={visible === true ? "text" : "password"}
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              id="Password"
            />
          </div>

          <div className="form-check">
            <input
              className="form-check-input"
              type="checkbox"
              value=""
              id="flexCheckDefault"
              onClick={handleClick}
            ></input>
            <label className="form-check-label" for="flexCheckDefault">
              {t("showPassword")}
            </label>
          </div>
          <br />
          <button type="submit" className="btn btn-primary">
            {t("login")}
          </button>
        </form>
      </div>
      <img src={loginPhoto} alt="login" />
    </div>
  );
};

export default Login;
