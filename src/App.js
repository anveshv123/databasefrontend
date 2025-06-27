import logo from './logo.svg';
import './App.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/Login';
import SearchPage from './components/Search';
import DatasetPage from './components/DatasetPage';
import VisualizePage from './components/VisualizePage';
import GisVisualizationPage from './components/GisVisualizationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/Login" element={<LoginForm />} />
        <Route path="/Search" element={<SearchPage />} />
        <Route path="/dataset/:datasetTitle" element={<DatasetPage />} /> 
        <Route path="/visualize/:datasetTitle" element={<VisualizePage />} />
        <Route path="/gis/:datasetTitle" element={<GisVisualizationPage />} />
        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
