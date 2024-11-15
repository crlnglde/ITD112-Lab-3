import React from 'react';
import AddDengueData from './AddDengueData';
import DengueDataList from './DengueDataList';
import CsvUploader from './CsvUploader';
import '../css/dash.css';

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-item1">
        <CsvUploader />
        <AddDengueData />
      </div>
      <div className="dashboard-item2">
        <DengueDataList />
      </div>
    </div>
  );
};

export default Dashboard;
