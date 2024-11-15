import React from 'react';

import Charc from './chartscon';
import Ch from './cards';
import Chh from './choropleth';
import '../css/viz.css';

const Dashboard = () => {
  return (
    <div className="viz-container">
      <div className="viz-item1">
        <Chh />
      </div>

      <div className="viz-item2">
        <Charc />
      </div>
    </div>
  );
};

export default Dashboard;
