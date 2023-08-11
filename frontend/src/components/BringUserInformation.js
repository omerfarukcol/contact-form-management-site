import { useState, useEffect } from "react";
import axios from "axios";

const BringUserInformation = () => {
  const [user, setUser] = useState({});

  useEffect(() => {
    const bringUserInformation = async () => {
      let foundUser = {};
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) {
        console.error("JWT token not found in localStorage");
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
        foundUser = response.data.data.user;
        setUser(foundUser);
      } else {
        console.log("Something went wrong.");
      }
    };
    bringUserInformation();
  }, []);

  return user;
};

export default BringUserInformation;
