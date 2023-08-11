import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import SuccessMessage from "./SuccessMessage";
import useError from "./useError";
import NavigationBar from "./NavigationBar";
import UploadPhoto from "./UploadPhoto";
import { useTranslation } from "react-i18next";

const EditUser = () => {
  const { id } = useParams();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();

  const { errors, addError, removeError, clearErrors } = useError();

  const axiosConfig = {
    headers: {
      token: localStorage.getItem("jwtToken"),
    },
  };

  useEffect(() => {
    const bringUser = async () => {
      const response = await axios.get(`http://localhost:5165/api/user/${id}`, {
        headers: {
          token: localStorage.getItem("jwtToken"),
        },
      });
      if (response.status === 200) {
        setUsername(response.data.data.user.username);
        setPassword(response.data.data.user.password);
        setImageBase64(response.data.data.user.base64Photo);
      } else {
        console.log("Something went wrong.");
      }
    };
    bringUser();
  }, []);

  const handleSubmit = (e) => {
    clearErrors();
    e.preventDefault();
    if (password.trim() === "" || password.length > 10) {
      addError("Please enter a valid password (max 10 characters).");
    } else {
      const formData = {
        username: username,
        password: password,
        base64Photo: imageBase64,
      };

      axios
        .post(
          `http://localhost:5165/api/user/update/${id}`,
          formData,
          axiosConfig
        )
        .then((response) => {
          setShowSuccess(true);
        })
        .catch((error) => {
          addError("An error occurred during submitting.");
        });
    }
  };

  const handleSuccessMessageHide = () => {
    setShowSuccess(false);
    window.location.href = "../users";
  };

  return (
    <div className="has-bg-image">
      <NavigationBar />

      <div className="w-50 m-4">
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

        <h2>{t("updateUser")}</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3"></div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <strong>{t("userPhoto")}</strong>
            </label>
            <div className="col-sm-10 mb-3">
              <UploadPhoto
                imageBase64={imageBase64}
                setImageBase64={setImageBase64}
              />
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <strong>{t("username")}</strong>
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                readOnly
                className="form-control-plaintext"
                id="formGroupExampleInputt"
                value={username}
              ></input>
            </div>
          </div>
          <br />
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <strong>{t("password")}</strong>
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                className="form-control"
                id="inputPassword"
                placeholder={t("max10Characters")}
                onChange={(e) => setPassword(e.target.value)}
              ></input>
            </div>
          </div>
          <br />
          <div className="form-group row">
            <label className="col-sm-2 col-form-label">
              <strong>{t("role")}</strong>
            </label>
            <div className="col-sm-10">
              <input
                type="text"
                readOnly
                className="form-control-plaintext"
                id="formGroupExampleInputt"
                value={"Reader"}
              ></input>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            {t("submit")}
          </button>
          <SuccessMessage
            show={showSuccess}
            message={t("submittedReturningUserPage")}
            onHide={handleSuccessMessageHide}
          />
        </form>
      </div>
    </div>
  );
};

export default EditUser;
