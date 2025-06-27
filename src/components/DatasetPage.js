import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { previewDataset , fullData } from "../service/apiService";  // Assuming you have an API service function
import VisualizationComponent from './VisualizationComponent';
import Select from 'react-select';


import '../CSS/datasetpage.css';

const DatasetPage = () => {
  const { datasetTitle } = useParams();  // Get dataset title from the URL
  const [datasetPreview, setDatasetPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [visualData, setVisualData] = useState(null);

  

  useEffect(() => {
    const fetchDatasetPreview = async () => {
      try {
        const data = await previewDataset(datasetTitle);  // Make API call to fetch preview data
        setDatasetPreview(data);
      } catch (error) {
        setError("Error fetching dataset preview.");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasetPreview();
  }, [datasetTitle]);  // Run again if the dataset title changes

  const handleButtonClick = () => {
    setPopupVisible(true);  // Show the popup on button click

  };

  const closePopup = () => {
    setPopupVisible(false);  // Close the popup
  };

  const handleGISVisualize = () => {
    const url = `/gis/${datasetTitle}`;
    window.open(url, "_blank");
  };

  const handleDownloadCSV = async () => {
    try {
      const fullDataset = await fullData(datasetTitle);
  
      if (!fullDataset || !fullDataset.columns || !fullDataset.rows) {
        alert("Failed to fetch full dataset for download.");
        return;
      }
  
      const { columns, rows } = fullDataset;
  
      // Build CSV content
      const csvContent = [
        columns.join(","), // Header row
        ...rows.map(row => columns.map(col => `"${(row[col] ?? "").toString().replace(/"/g, '""')}"`).join(","))
      ].join("\n");
  
      // Create a Blob and trigger download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
  
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${datasetTitle}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("CSV Download failed:", error);
      alert("Failed to download dataset. Please try again.");
    }
  };
  
  const handleVisualize = () => {
    const url = `/visualize/${datasetTitle}`;
    window.open(url, "_blank");
  };
  

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="dataset-page-wrapper">
  <div className="dataset-page-container">
    <h1>{datasetTitle} - Preview</h1>
     {/* Buttons Section */}
        <div className="dataset-buttons">
          <button className="filter-button" onClick={handleButtonClick}>Filter by Date</button>
          <button className="export-button" onClick={handleDownloadCSV}>Download as CSV</button>
          <button className="visualize-button" onClick={handleVisualize}>Visualize</button>
          <button className="gis-button" onClick={handleGISVisualize}>GIS Visualize</button>
        </div>
    <div className="dataset-table-container">
      <div className="dataset-table-wrapper">
        {datasetPreview && (
          <table>
            <thead>
              <tr>
                {datasetPreview.columns.map((col, index) => (
                  <th key={index}>{col}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {datasetPreview.rows.map((row, index) => (
                <tr key={index}>
                  {datasetPreview.columns.map((col, colIndex) => (
                    <td key={colIndex}>{row[col]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
    {/* Popup - Under Development */}
    {popupVisible && (
          <div className="modal-overlay">
            <div className="modal-content">
              <span className="popup-close" onClick={closePopup}>&times;</span>
              <h2>Under Development</h2>
              <p>This feature is currently under development. Stay tuned!</p>
            </div>
          </div>
        )}
    
  </div>
</div>
  );
};

export default DatasetPage;
