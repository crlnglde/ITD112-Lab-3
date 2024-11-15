import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../css/piechart.css";


// Register the necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = () => {
  const [dengueData, setDengueData] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("All");

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueDb");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
    };

    fetchData();
  }, []);

  // Get unique regions for the filter dropdown
  const regions = ["All", ...new Set(dengueData.map(data => data.regions))];

  // Filter data based on the selected region
  const filteredData = selectedRegion === "All"
    ? dengueData
    : dengueData.filter(data => data.regions === selectedRegion);

  // Aggregate data for Cases and Deaths
  const totalCases = filteredData.reduce((sum, data) => sum + data.cases, 0);
  const totalDeaths = filteredData.reduce((sum, data) => sum + data.deaths, 0);

  // Prepare data for the pie chart
  const chartData = {
    labels: ["Cases", "Deaths"], // Static labels for the pie chart
    datasets: [
      {
        data: [totalCases, totalDeaths], // Data corresponding to the labels
        backgroundColor: ["rgba(7, 100, 158, 0.6)", "rgba(197, 32, 32, 0.6)"],
        borderColor: ["rgba(7, 100, 158, .8)", "rgba(197, 32, 32, .8)"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      }
    },
  };

  return (
    <div className="pie-chart-container">
      <h2>Dengue Cases and Deaths Per Region</h2>
      <div className="pie-chart-controls">
        <div>
          <label htmlFor="region-select">Select Region: </label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {regions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>
      </div>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default PieChart;
