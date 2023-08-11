import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import SuccessMessage from "./SuccessMessage";
import useError from "./useError";
import { useTranslation } from "react-i18next";
import { w3cwebsocket as W3CWebSocket } from "websocket";

import "../App.css";

const ContactForm = () => {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [socket, setSocket] = useState(null);
  const [responseMessage, setResponseMessage] = useState("");
  const isInitialRender = useRef(true);

  const { errors, addError, removeError, clearErrors } = useError();

  useEffect(() => {
    const client = new W3CWebSocket("ws://localhost:5165");

    client.onopen = () => {
      console.log("WebSocket connection established");
      setSocket(client);
    };

    client.onmessage = (message) => {
      const messageData = JSON.parse(message.data);
      console.log(messageData.message);
      setResponseMessage(messageData.message);
    };

    return () => {
      if (client.readyState === client.OPEN) {
        client.close();
      }
    };
  }, []);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get("http://localhost:5165/api/countries");
        setCountries(response.data.data.countries);
        setIsLoading(false);
      } catch (error) {
        addError("Failed to fetch countries.");
        setIsLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleSubmit = (e) => {
    clearErrors();
    e.preventDefault();
    const formData = {
      name: name,
      message: message,
      gender: gender,
      country: selectedCountry,
    };

    axios
      .post("http://localhost:5165/api/message/add", formData)
      .then(() => {
        if (socket) {
          const message = {
            name: formData.name,
            message: formData.message,
          };
          socket.send(JSON.stringify(message));
        }
        setShowSuccess(true);
        setName("");
        setGender("male");
        setSelectedCountry("");
        setMessage("");
      })
      .catch((error) => {
        addError(error.response.data.error);
      });
  };

  const handleSuccessMessageHide = () => {
    setShowSuccess(false);
  };

  if (isLoading) {
    return <div>Loading countries...</div>;
  }

  return (
    <div>
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
      <h1>{t("contactForm")}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">
            <strong>{t("name")}</strong>
          </label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={50}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">
            <strong>{t("gender")}</strong>
          </label>
          <div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="male"
                value="male"
                checked={gender === "male"}
                onChange={() => setGender("male")}
              />
              <label className="form-check-label" htmlFor="male">
                {t("male")}
              </label>
            </div>
            <div className="form-check form-check-inline">
              <input
                className="form-check-input"
                type="radio"
                name="gender"
                id="female"
                value="female"
                checked={gender === "female"}
                onChange={() => setGender("female")}
              />
              <label className="form-check-label" htmlFor="female">
                {t("female")}
              </label>
            </div>
          </div>
        </div>
        <div className="mb-3">
          <label htmlFor="country" className="form-label">
            <strong>{t("country")}</strong>
          </label>
          <select
            className="form-select"
            id="country"
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">{t("selectACountry")}</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label htmlFor="message" className="form-label">
            <strong>{t("message")}</strong>
          </label>
          <textarea
            className="form-control"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            maxLength={500}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {t("submit")}
        </button>

        <SuccessMessage
          show={showSuccess}
          message={t("submitted")}
          onHide={handleSuccessMessageHide}
        />

        <SuccessMessage
          show={showSuccess}
          message={responseMessage}
          onHide={handleSuccessMessageHide}
        />
      </form>
    </div>
  );
};

export default ContactForm;
