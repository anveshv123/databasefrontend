import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { geoJsonData } from '../service/apiService'; // Adjust path if needed

// Fix Leaflet marker icon issue in some setups
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const GisVisualizationPage = () => {
  const { datasetTitle } = useParams();
  const [geoData, setGeoData] = useState(null);
  const [error, setError] = useState(null);

  const defaultCenter = [36.0, -96.0]; // Centered on Oklahoma
  const defaultZoom = 6;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await geoJsonData(datasetTitle);
        setGeoData(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch geojson data");
      }
    };

    fetchData();
  }, [datasetTitle]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>GIS Visualization for <i>{datasetTitle}</i></h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <MapContainer center={defaultCenter} zoom={defaultZoom} style={{ height: "70vh", width: "100%", marginTop: "20px" }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show markers if geojson is loaded */}
        {geoData?.features?.map((feature, idx) => {
          const coords = feature.geometry.coordinates;
          const props = feature.properties;

          return (
            <Marker key={idx} position={[coords[1], coords[0]]}>
              <Popup>
                <strong>{props.siteName}</strong><br />
                County: {props.county}<br />
                Count: {props.count}<br />
                Avg AQI: {props.avg_aqi}<br />
                Min AQI: {props.min_aqi}<br />
                Max AQI: {props.max_aqi}
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default GisVisualizationPage;
