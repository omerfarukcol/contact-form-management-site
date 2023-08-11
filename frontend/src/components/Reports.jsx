import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import NavigationBar from "./NavigationBar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import "../App.css";

const Reports = () => {
  const [messages, setMessages] = useState([]);
  const COLORS = ["#318ce7", "#e52b50"];
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

  const getMessageCountByCountry = () => {
    const countryCount = {};
    messages.forEach((message) => {
      const { country } = message;
      if (country in countryCount) {
        countryCount[country]++;
      } else {
        countryCount[country] = 1;
      }
    });

    return Object.entries(countryCount)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);
  };

  const getMessageCountByGender = () => {
    const genderCount = { male: 0, female: 0 };
    messages.forEach((message) => {
      const { gender } = message;
      if (gender === "male") {
        genderCount.male++;
      } else if (gender === "female") {
        genderCount.female++;
      }
    });

    return Object.entries(genderCount).map(([gender, count]) => ({
      gender,
      count,
    }));
  };

  const countryData = getMessageCountByCountry();
  const genderData = getMessageCountByGender();

  return (
    <>
      <NavigationBar />
      <h3 className="d-flex justify-content-center m-2">
        {t("messagesByCountries")}
      </h3>
      <div className="d-flex justify-content-center m-5">
        <BarChart width={1000} height={300} data={countryData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </div>
      <h3 className="d-flex justify-content-center m-2">
        {t("messagesByGenders")}
      </h3>
      <div className="d-flex justify-content-center m-5">
        <PieChart width={500} height={500}>
          <Pie
            data={genderData}
            cx={200}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="count"
            label={(entry) => entry.gender}
          >
            {genderData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </div>
    </>
  );
};

export default Reports;
