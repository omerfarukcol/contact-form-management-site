import React, { useEffect, useState } from "react";
import axios from "axios";
import NavigationBar from "./NavigationBar";
import { useTranslation } from "react-i18next";
import "../App.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    const bringUsers = async () => {
      const response = await axios.get("http://localhost:5165/api/users", {
        headers: {
          token: localStorage.getItem("jwtToken"),
        },
      });

      if (response.status === 200) {
        setUsers(response.data.data.users);
      } else {
        console.log("Something went wrong.");
      }
    };
    bringUsers();
  }, []);

  return (
    <div className="has-bg-image">
      <NavigationBar />
      <div className="table-responsive">
        <table className="table table-hover table-striped">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">{t("userPhoto")}</th>
              <th scope="col">{t("username")}</th>
              <th scope="col">{t("role")}</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <React.Fragment key={user.id}>
                <tr>
                  <th scope="row">{user.id}</th>
                  <td>
                    <img
                      src={user.base64Photo}
                      alt="userPhoto"
                      className="rounded-circle img-thumbnail user-photo"
                      style={{ height: "5vh" }}
                    />
                  </td>
                  <td>{user.username}</td>
                  <td>{user.role}</td>
                  <td>
                    <a
                      className="btn btn-primary mx-1 btn-sm"
                      href={`/edit-user/${user.id}`}
                      role="button"
                    >
                      {t("edit")}
                    </a>
                  </td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
        <a className="btn btn-primary mx-3" href="/add-user" role="button">
          {t("addUser")}
        </a>
      </div>
    </div>
  );
};

export default Users;
