import React from 'react';
import PieChart from "../components/piechart"; 
import BarChart from "../components/bar"; 
import Cards from "../components/cards";
import "../css/charts.css"; // Import the CSS for styling the container


const ChartsContainer = () => {
  return (
    <div>

    
      <div className="charts-row">
        <div className="chart-item1">
          <BarChart /> 
        </div>

        <div className="chart-item2">
          <PieChart />
        </div>
      </div>

        <div className="chart-item3">
          <Cards />
        </div>
    </div>
  );
};

export default ChartsContainer;
