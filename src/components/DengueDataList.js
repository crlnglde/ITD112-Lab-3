import React, { useState, useEffect } from "react";
import { collection, getDocs, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight } from '@fortawesome/free-solid-svg-icons';
import {faAngleLeft} from '@fortawesome/free-solid-svg-icons';
import { faAnglesRight } from '@fortawesome/free-solid-svg-icons';
import {faAnglesLeft} from '@fortawesome/free-solid-svg-icons';
import {faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons';
import {faCircleXmark} from '@fortawesome/free-solid-svg-icons';

import "../css/list.css";

const rowsPerPage = 10; // Number of rows to display per page

const DengueDataList = () => {
  const [dengueData, setDengueData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({
    location: "",
    cases: "",
    deaths: "",
    date: "",
    regions: "",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const dengueCollection = collection(db, "dengueDb");
      const dengueSnapshot = await getDocs(dengueCollection);
      const dataList = dengueSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setDengueData(dataList);
      setFilteredData(dataList); // Initially, filteredData is the same as dengueData
    };

    fetchData();
  }, []);

  // Search filter logic
  const handleSearch = (query) => {
    setSearchQuery(query);
    const lowerCaseQuery = query.toLowerCase();

    const filtered = dengueData.filter(
      (data) =>
        data.location.toLowerCase().includes(lowerCaseQuery) ||
        data.regions.toLowerCase().includes(lowerCaseQuery)
    );

    setFilteredData(filtered); 
    setCurrentPage(1); 
  };

  const handleClear = () => {
    setSearchQuery(""); 
  };

  const handleDelete = async (id) => {
    const dengueDocRef = doc(db, "dengueDb", id);
    try {
      await deleteDoc(dengueDocRef);
      setDengueData(dengueData.filter((data) => data.id !== id));
      setFilteredData(filteredData.filter((data) => data.id !== id)); // Also remove from filteredData
      alert("Data deleted successfully!");
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  const handleEdit = (data) => {
    setEditingId(data.id);
    setEditForm({
      location: data.location,
      cases: data.cases,
      deaths: data.deaths,
      date: data.date,
      regions: data.regions,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const dengueDocRef = doc(db, "dengueDb", editingId);
    try {
      await updateDoc(dengueDocRef, {
        location: editForm.location,
        cases: Number(editForm.cases),
        deaths: Number(editForm.deaths),
        date: editForm.date,
        regions: editForm.regions,
      });
      setDengueData(dengueData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setFilteredData(filteredData.map((data) =>
        data.id === editingId ? { id: editingId, ...editForm } : data
      ));
      setEditingId(null);
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  // Pagination logic for filteredData
  const totalRows = filteredData.length; // Use filtered data for pagination
  const totalPages = Math.ceil(totalRows / rowsPerPage);

  const startIndex = (currentPage - 1) * rowsPerPage;
  const currentData = filteredData.slice(startIndex, startIndex + rowsPerPage);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="table-container">
      <h2>Dengue Data List</h2>

      {/* Search input field */}
      
      <div className="search-input">
        
        <FontAwesomeIcon icon={faMagnifyingGlass} className="search-icon" />
        <input
            type="text"
            className="search-input1"
            placeholder="Search by Location or Region"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)} // Update search query state
        />

      <FontAwesomeIcon
        icon={faCircleXmark}
        className={`search-clear ${!searchQuery ? 'disabled' : ''}`} 
        onClick={searchQuery ? handleClear : null} // Only call handleClear if there is text
      />
      </div>
         

      {editingId ? (
        <form onSubmit={handleUpdate}>
          <input
            type="text"
            placeholder="Location"
            value={editForm.location}
            onChange={(e) => setEditForm({ ...editForm, location: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Cases"
            value={editForm.cases}
            onChange={(e) => setEditForm({ ...editForm, cases: e.target.value })}
            required
          />
          <input
            type="number"
            placeholder="Deaths"
            value={editForm.deaths}
            onChange={(e) => setEditForm({ ...editForm, deaths: e.target.value })}
            required
          />
          <input
            type="date"
            placeholder="Date"
            value={editForm.date}
            onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
            required
          />
          <input
            type="text"
            placeholder="Regions"
            value={editForm.regions}
            onChange={(e) => setEditForm({ ...editForm, regions: e.target.value })}
            required
          />
          <button type="submit">Update Data</button>
          <button className="cancel-button" onClick={() => setEditingId(null)}>Cancel</button>
        </form>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Location</th>
                <th>Cases</th>
                <th>Deaths</th>
                <th>Date</th>
                <th>Regions</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((data) => (
                  <tr key={data.id}>
                    <td>{data.location}</td>
                    <td>{data.cases}</td>
                    <td>{data.deaths}</td>
                    <td>{data.date}</td>
                    <td>{data.regions}</td>
                    <td>
                      <button className="edit-button" onClick={() => handleEdit(data)}>Edit</button>
                      <button className="delete-button" onClick={() => handleDelete(data.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">No Data found.</td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Pagination info and count */}
          <div className="pagination-info">
            <span>{currentPage * rowsPerPage - rowsPerPage + currentData.length} / {totalRows}</span>
          </div>

          {/* Pagination controls */}
          <div className="pagination-controls">
          <button
            onClick={() => setCurrentPage(1)}
            disabled={currentPage === 1 || totalRows === 0}
          >
            <FontAwesomeIcon icon={faAnglesLeft} />
          </button>
            
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1 || totalRows === 0}
            >
              <FontAwesomeIcon icon={faAngleLeft} />
            </button>
            <span>
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              onClick={handleNextPage}
              disabled={currentPage === totalPages || totalRows === 0}
            >
              <FontAwesomeIcon icon={faAngleRight} />
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages || totalRows === 0}
            >
              <FontAwesomeIcon icon={faAnglesRight} />
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default DengueDataList;