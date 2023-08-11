import React, { useEffect, useState } from "react";
import axios from "axios";
import BringUserInformation from "./BringUserInformation";
import NavigationBar from "./NavigationBar";
import SuccessMessage from "./SuccessMessage";
import { useTranslation } from "react-i18next";
import "../App.css";

const MessagesWithPagination = () => {
  const [messages, setMessages] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const [pagination, setPagination] = useState({ page: 1, pageSize: 5 });
  const [sorting, setSorting] = useState({ sortBy: "name", sortOrder: "asc" });

  useEffect(() => {
    const fetchMessages = async () => {
      const response = await axios.get(
        "http://localhost:5165/api/messages-with-pagination",
        {
          params: {
            page: pagination.page,
            pageSize: pagination.pageSize,
            sortBy: sorting.sortBy,
            sortOrder: sorting.sortOrder,
          },
          headers: {
            token: localStorage.getItem("jwtToken"),
          },
        }
      );

      if (response.status === 200) {
        setMessages(response.data.data.messages);
      } else {
        console.log("Something went wrong.");
      }
    };

    fetchMessages();
  }, [pagination, sorting]);

  const incrementPage = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page + 1,
    }));
  };

  const decrementPage = () => {
    setPagination((prevPagination) => ({
      ...prevPagination,
      page: prevPagination.page - 1,
    }));
  };

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
      <div>
        <select
          onChange={(e) => {
            setSorting((prevSorting) => ({
              ...prevSorting,
              sortBy: e.target.value,
            }));
          }}
        >
          <option value="name">{t("name")}</option>
          <option value="gender">{t("gender")}</option>
          <option value="creationDate">{t("creationDate")}</option>
          <option value="country">{t("country")}</option>
        </select>
        <select
          onChange={(e) => {
            setSorting((prevSorting) => ({
              ...prevSorting,
              sortOrder: e.target.value,
            }));
          }}
        >
          <option value="asc">{t("ascending")}</option>
          <option value="desc">{t("descending")}</option>
        </select>
        <select
          onChange={(e) => {
            setPagination((prevPagination) => ({
              ...prevPagination,
              pageSize: e.target.value,
            }));
          }}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="100">100</option>
        </select>
      </div>
      <br />
      <div className="table-responsive">
        <table className="table table-hover">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t("name")}</th>
              <th scope="col">{t("gender")}</th>
              <th scope="col">{t("country")}</th>
              <th scope="col">{t("creationDate")}</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((message, index) => (
              <React.Fragment key={index}>
                <tr className={message.read === "true" ? "temp-row" : ""}>
                  <th scope="row">{message.id}</th>
                  <td>{message.name}</td>
                  <td>{message.gender}</td>
                  <td>{message.country}</td>
                  <td>
                    {message.creationDate.replace("T", "   ").slice(0, -8)}
                  </td>
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
                          {t("message")}: {message.message}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <div className="d-flex justify-content-center">
          <div>
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={pagination.page > 1 ? decrementPage : null}
            >
              {t("previous")}
            </button>
            <button
              type="button"
              className="btn btn-info btn-sm"
              onClick={
                messages.length == pagination.pageSize ? incrementPage : null
              }
            >
              {t("next")}
            </button>
          </div>
        </div>
        <SuccessMessage
          show={showSuccess}
          message={t("deletedSuccessfully")}
          onHide={handleSuccessMessageHide}
        />
      </div>
    </div>
  );
};

export default MessagesWithPagination;
