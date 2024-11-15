import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../css/cards.css";

const CardVisualization = () => {
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeaths, setTotalDeaths] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dengueCollection = collection(db, "dengueDb");
        const dengueSnapshot = await getDocs(dengueCollection);
        const dengueData = dengueSnapshot.docs.map((doc) => doc.data());

        // Calculate total cases and deaths
        const cases = dengueData.reduce((sum, record) => sum + (record.cases || 0), 0);
        const deaths = dengueData.reduce((sum, record) => sum + (record.deaths || 0), 0);

        setTotalCases(cases);
        setTotalDeaths(deaths);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="cards-container">
      <div className="card1">
        <h2>Total Cases</h2>
        <p>{totalCases.toLocaleString()}</p>
      </div>

      <div className="card2">
        <h2>Total Deaths</h2>
        <p>{totalDeaths.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CardVisualization;
