import React, { useEffect, useState } from "react";
import axios from "axios";
import BringUserInformation from "./BringUserInformation";
import NavigationBar from "./NavigationBar";
import SuccessMessage from "./SuccessMessage";
import { useTranslation } from "react-i18next";
import "../App.css";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    const bringMessages = async () => {
      const response = await axios.get("http://localhost:5165/api/messages", {
        headers: {
          token: localStorage.getItem("jwtToken"),
        },
      });

      if (response.status === 200) {
        setMessages(response.data.data.messages);
      } else {
        console.log("Something went wrong.");
      }
    };
    bringMessages();
  }, []);

  const handleDeleteMessage = async (messageId) => {
    try {
      await axios.post(
        `http://localhost:5165/api/message/delete/${messageId}`,
        null,
        {
          headers: {
            token: localStorage.getItem("jwtToken"),
          },
        }
      );
      setMessages((prevMessages) =>
        prevMessages.filter((message) => message.id !== messageId)
      );
      console.log("Message deleted successfully!");
      setShowSuccess(true);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  const [detailedVisible, setDetailedVisible] = useState({});

  const handleSuccessMessageHide = () => {
    setShowSuccess(false);
  };

  const toggleDetailedVisible = async (messageId, messageRead) => {
    if (messageRead === "false") {
      try {
        await axios.post(
          `http://localhost:5165/api/message/read/${messageId}`,
          null,
          {
            headers: {
              token: localStorage.getItem("jwtToken"),
            },
          }
        );
        messages.forEach((element) => {
          if (element.id === messageId) {
            element.read = "true";
          }
        });
      } catch (error) {
        console.error("Error when changing the view status.", error);
      }
    }

    setDetailedVisible((prevVisible) => ({
      ...prevVisible,
      [messageId]: !prevVisible[messageId],
    }));
  };

  let user = BringUserInformation();
  return (
    <div className="has-bg-image">
      <NavigationBar />
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("message")}</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <tr className={message.read === "true" ? "temp-row" : ""}>
                  <th scope="row">{message.id}</th>
                  <td>{message.name}</td>
                  <td>{message.message}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-info btn-sm mx-1"
                      onClick={() =>
                        toggleDetailedVisible(message.id, message.read)
                      }
                    >
                      {t("view")}
                    </button>
                    {user.role === "admin" ? (
                      <>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm mx-1"
                          onClick={() => handleDeleteMessage(message.id)}
                        >
                          {t("delete")}
                        </button>
                      </>
                    ) : (
                      <></>
                    )}
                  </td>
                </tr>
                {detailedVisible[message.id] && (
                  <tr>
                    <td colSpan="7">
                      <div>
                        <p>
                          {t("gender")}: {message.gender}
                        </p>
                        <p>
                          {t("country")}: {message.country}
                        </p>
                        <p>
                          {t("read")}: {message.read}
                        </p>
                        <p>
                          {t("creationDate")}:{" "}
                          {message.creationDate
                            .replace("T", "   ")
                            .slice(0, -8)}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <SuccessMessage
          show={showSuccess}
          message={t("deletedSuccessfully")}
          onHide={handleSuccessMessageHide}
        />
      </div>
    </div>
  );
};

export default Messages;
