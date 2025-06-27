// src/pages/VisualizePage.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fullData } from "../service/apiService";
import VisualizationComponent from "./VisualizationComponent";

const VisualizePage = () => {
  const { datasetTitle } = useParams();
  const [visualData, setVisualData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFullData = async () => {
      try {
        const data = await fullData(datasetTitle);
        setVisualData(data);
      } catch (err) {
        setError("Failed to load visualization data.");
        console.error(err);
      }
    };

    fetchFullData();
  }, [datasetTitle]);

  if (error) return <div>{error}</div>;
  if (!visualData) return <div>Loading visualization...</div>;

  return <VisualizationComponent data={visualData} onClose={() => window.close()} />;
};

export default VisualizePage;
