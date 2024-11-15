// src/components/Footer.js

import React from 'react';
import '../css/footer.css'; // Ensure this file exists or adjust the path

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; 2024 Dengue Dashboard. All Rights Reserved.</p>
        
        <p>
          <a href="https://github.com/your-repo" target="_blank" rel="noopener noreferrer">
            GitHub
          </a> | 
          <a href="mailto:carloelevera@gmail.com">
            Contact Us
          </a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
