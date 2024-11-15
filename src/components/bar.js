import React, { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "../css/barchart.css"; // Import the CSS file for styling

// Register the necessary components for Chart.js
ChartJS.register(
  BarElement,
  Tooltip,
  Legend,
  Title,
  CategoryScale,
  LinearScale
);

const BarChart = () => {
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

  // Aggregate data by location
  const aggregateDataByLocation = (data) => {
    const aggregated = data.reduce((acc, { location, cases, deaths }) => {
      if (!acc[location]) {
        acc[location] = { cases: 0, deaths: 0 };
      }
      acc[location].cases += cases || 0;
      acc[location].deaths += deaths || 0;
      return acc;
    }, {});

    return Object.entries(aggregated).map(([location, values]) => ({
      location,
      ...values,
    }));
  };

  // Aggregate data by region
  const aggregateDataByRegion = (data) => {
    const aggregated = data.reduce((acc, { regions, cases, deaths }) => {
      if (!acc[regions]) {
        acc[regions] = { cases: 0, deaths: 0 };
      }
      acc[regions].cases += cases || 0;
      acc[regions].deaths += deaths || 0;
      return acc;
    }, {});

    return Object.entries(aggregated).map(([region, values]) => ({
      region,
      ...values,
    }));
  };

  // Determine the data to display based on the selection
  const displayData =
    selectedRegion === "All"
      ? aggregateDataByRegion(dengueData) // Aggregate by region if "All" is selected
      : aggregateDataByLocation(
          dengueData.filter((data) => data.regions === selectedRegion)
        ); // Aggregate by location for a specific region

  // Prepare data for the bar chart
  const chartData = {
    labels: displayData.map((data) =>
      selectedRegion === "All" ? data.region : data.location
    ), // Regions or Locations as x-axis labels
    datasets: [
      {
        label: "Cases",
        data: displayData.map((data) => data.cases),
        backgroundColor: "rgba(7, 100, 158, 0.6)",
        borderColor: "rgba(7, 100, 158, 0.8)",
        borderWidth: 1,
      },
      {
        label: "Deaths",
        data: displayData.map((data) => data.deaths),
        backgroundColor: "rgba(197, 32, 32, 0.6)",
        borderColor: "rgba(197, 32, 32, 0.8)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      x: {
        stacked: true,
        ticks: {
          font: {
            size: 8, // Set the font size
            family: "'Arial', sans-serif", // Set the font family
            weight: '500', // Set the font weight
          }
        }
      },
      y: {
        stacked: true,
        beginAtZero: true,
        ticks: {
          font: {
            size: 8, // Set the font size
            family: "'Arial', sans-serif", // Set the font family
            weight: '500', // Set the font weight
          }
        }
      },
    },
  };

  return (
    <div className="bar-chart-container">
      <h2>Dengue Cases and Deaths by Region or Location</h2>
      <div className="bar-chart-controls">
        <div>
          <label htmlFor="region-select">Select Region: </label>
          <select
            id="region-select"
            value={selectedRegion}
            onChange={(e) => setSelectedRegion(e.target.value)}
          >
            {["All", ...new Set(dengueData.map((data) => data.regions))].map(
              (region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              )
            )}
          </select>
        </div>
      </div>
      <Bar data={chartData} options={options} />
    </div>
  );
};

export default BarChart;
