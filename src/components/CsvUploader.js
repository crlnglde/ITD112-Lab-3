import React, { useState } from 'react';
import { db } from "../firebase";
import { collection, addDoc } from 'firebase/firestore';
import "../css/add.css"; 

function CsvUploader() {
  const [csvFile, setCsvFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const handleFileChange = (event) => {
    setCsvFile(event.target.files[0]);
    setSuccessMessage(""); // Clear success message on new file selection
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      alert("Please select a CSV file to upload.");
      return;
    }

    setLoading(true); // Set loading to true when starting the upload

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target.result;
      const rows = text.split('\n');
      const data = [];

      // Parse CSV rows assuming columns: location, cases, deaths, date, regions
      rows.forEach((row, index) => {
        const columns = row.split(',');
        if (columns.length >= 5 && index > 0) { // Skip header row
          data.push({
            location: columns[0].trim(),
            cases: Number(columns[1].trim()),
            deaths: Number(columns[2].trim()),
            date: columns[3].trim(),
            regions: columns[4].trim(),
          });
        }
      });

      try {
        // Upload each document in sequence
        for (const item of data) {
          await addDoc(collection(db, 'dengueDb'), item);
        }

        setLoading(false); // Stop loading effect
        setSuccessMessage("CSV data uploaded successfully!");
        setCsvFile(null); // Reset file input
        window.location.reload(); // Optionally reload page to reflect changes
      } catch (error) {
        setLoading(false);
        console.error('Error uploading CSV data:', error);
      }
    };

    reader.readAsText(csvFile);
  };

  return (
    <div className="csv-container">
      <h2>Upload CSV File</h2>
      <input 
        type="file" 
        accept=".csv" 
        onChange={handleFileChange} 
        className="input-field"
      />
      <button 
        className="submit-button" 
        onClick={handleFileUpload}
        disabled={loading} // Disable button when loading
      >
        {loading ? "Uploading..." : "Upload CSV"}
      </button>
      {loading && <p className="loading-message">Uploading, please wait...</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}
      <h3>-------------------------OR-------------------------</h3>
    </div>
  );
}

export default CsvUploader;
