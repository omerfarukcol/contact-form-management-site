import React, { useState, useEffect } from "react";
import { I18nextProvider } from "react-i18next";
import i18n from "i18next";
import LanguageSelector from "../src/components/LanguageSelector";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";

import axios from "axios";

import Homepage from "./components/Homepage";
import Login from "./components/Login";
import Messages from "./components/Messages";
import NotAuthorized from "./components/NotAuthorized";
import NotFound from "./components/NotFound";
import Reports from "./components/Reports";
import Users from "./components/Users";
import AddUser from "./components/AddUser";
import EditUser from "./components/EditUser";
import MessagesWithPagination from "./components/MessagesWithPagination";
import MessagesWithPaginationScroll from "./components/MessagesWithPaginationScroll";

i18n.init({
  interpolation: { escapeValue: false }, // React already does escaping
  lng: localStorage.getItem("language") || "en", // Language to use
  resources: {
    en: {
      translation: require("./translations/en.json"),
    },
    tr: {
      translation: require("./translations/tr.json"),
    },
  },
});

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState({});

  const callbackFunction = (childData) => {
    setLoggedIn(childData);
  };

  useEffect(() => {
    const checkToken = async () => {
      try {
        const jwtToken = localStorage.getItem("jwtToken");

        if (!jwtToken) {
          console.error("JWT token not found in localStorage");
          setLoggedIn(false);
          setLoading(false);
          return;
        }
        const response = await axios.post(
          "http://localhost:5165/api/user/check-login",
          null,
          {
            headers: {
              token: jwtToken,
            },
          }
        );

        if (response.status === 200) {
          setLoggedIn(true); // Token is fine, user is authenticated
          setUser(response.data.data.user);
        } else {
          setLoggedIn(false); // Token is invalid or expired, user is not authenticated
          setUser({});
        }
      } catch (error) {
        setLoggedIn(false); // Error occurred, user is not authenticated
        setUser({});
        console.log(error.response.data.error);
      }
      setLoading(false); // Request completed, stop loading
    };

    // Call the checkToken function
    checkToken();
  }, []);

  return (
    <I18nextProvider i18n={i18n}>
      <Router>
        <Routes>
          {/* Homepage (Main Route) */}
          <Route
            path="/"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn ? (
                <Homepage />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login Route */}
          <Route
            path="/login"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn ? (
                <Navigate to="/" />
              ) : (
                <Login onLoginSuccess={callbackFunction} />
              )
            }
          />

          {/* Not Authorized Route */}
          <Route path="/not-authorized" element={<NotAuthorized />} />

          {/* Not Found Route */}
          <Route path="/not-found" element={<NotFound />} />

          {/* Protected Routes */}
          <Route
            path="/messages"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn ? (
                <Messages />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/messages-with-pagination"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn ? (
                <MessagesWithPagination />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/messages-with-pagination-scroll"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn ? (
                <MessagesWithPaginationScroll />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/add-user"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn && user.role === "admin" ? (
                <AddUser />
              ) : loggedIn ? (
                <Navigate to="/not-authorized" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/edit-user/:id"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn && user.role === "admin" ? (
                <EditUser />
              ) : loggedIn ? (
                <Navigate to="/not-authorized" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/users"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn && user.role === "admin" ? (
                <Users />
              ) : loggedIn ? (
                <Navigate to="/not-authorized" />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/reports"
            element={
              loading ? (
                <div>Loading...</div>
              ) : loggedIn && user.role === "admin" ? (
                <Reports />
              ) : loggedIn ? (
                <Navigate to="/not-authorized" />
              ) : (
                <Navigate to="/" />
              )
            }
          />

          {/* Catch all other routes, redirect to Not Found page */}
          <Route path="*" element={<Navigate to="/not-found" />} />
        </Routes>
      </Router>
    </I18nextProvider>
  );
};

export default App;
