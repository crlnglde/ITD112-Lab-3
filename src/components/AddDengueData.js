import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import "../css/add.css";

const AddDengueData  = () => {
  const [location, setLocation] = useState("");
  const [cases, setCases] = useState("");
  const [deaths, setDeaths] = useState("");
  const [date, setDate] = useState("");
  const [regions, setRegions] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "dengueDb"), {
        location,
        cases: Number(cases),
        deaths: Number(deaths),
        date,
        regions,
      });
      setLocation("");
      setCases("");
      setDeaths("");
      setDate("");
      setRegions("");
      alert("Data added successfully!");
      window.location.reload();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Input Dengue Data</h2>
    
      <form className="addform" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cases"
          value={cases}
          onChange={(e) => setCases(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Deaths"
          value={deaths}
          onChange={(e) => setDeaths(e.target.value)}
          required
        />
        <input
          type="date"
          placeholder="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Regions"
          value={regions}
          onChange={(e) => setRegions(e.target.value)}
          required
        />
        <button type="submit">Add Data</button>
      </form>

    </div>
  );
};

export default AddDengueData;