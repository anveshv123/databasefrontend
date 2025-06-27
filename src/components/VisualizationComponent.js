import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import "../CSS/visualization.css";

const VisualizationComponent = ({ data }) => {
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [chartType, setChartType] = useState("line");
  const [fullscreen, setFullscreen] = useState(false);

  const [filterColumn, setFilterColumn] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [filteredRows, setFilteredRows] = useState(data?.rows || []);

  const columns = data?.columns || [];
  const rows = data?.rows || [];

  // Apply filter when any filter input changes
  useEffect(() => {
    if (!filterColumn || !filterValue) {
      setFilteredRows(rows);
    } else {
      const filtered = rows.filter((r) => {
        const val = String(r[filterColumn] ?? "").toLowerCase();
        return val === filterValue.toLowerCase();
      });
      setFilteredRows(filtered);
    }
  }, [rows, filterColumn, filterValue]);

  // Create or update the chart
  useEffect(() => {
    if (!xAxis || !yAxis || !filteredRows.length) return;

    const ctx = chartRef.current.getContext("2d");
    if (chartInstance) chartInstance.destroy();

    const chartData = {
      labels: chartType !== 'scatter' ? filteredRows.map((r) => r[xAxis]) : undefined,
      datasets: [{
        label: yAxis,
        data: chartType === 'scatter'
          ? filteredRows.map((r) => ({ x: r[xAxis], y: r[yAxis] }))
          : filteredRows.map((r) => r[yAxis]),
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1,
        pointRadius: chartType === 'scatter' ? 5 : 2,
        showLine: chartType !== 'scatter'
      }]
    };

    const newChart = new Chart(ctx, {
      type: chartType,
      data: chartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: chartType === 'scatter' ? {
          x: { type: 'linear', title: { display: true, text: xAxis } },
          y: { type: 'linear', title: { display: true, text: yAxis } }
        } : {},
        plugins: {
          title: {
            display: true,
            text: `${yAxis} vs ${xAxis}${filterColumn && filterValue ? ` (Filtered: ${filterColumn} contains "${filterValue}")` : ''}`,
            padding: 20,
            font: { size: 16, weight: "bold" }
          }
        }
      }
    });

    setChartInstance(newChart);
  }, [xAxis, yAxis, chartType, filteredRows]);

  return (
    <div className={`chart-visualization-wrapper ${fullscreen ? "fullscreen" : ""}`}>
      <div className="control-panel">
        <div className="control-section">
          <h3>Chart Configuration</h3>
          <div>
            <label>X-Axis:</label>
            <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
              <option value="">Select</option>
              {columns.map((col) => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          <div>
            <label>Y-Axis:</label>
            <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
              <option value="">Select</option>
              {columns.map((col) => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          <div>
            <label>Chart Type:</label>
            <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
              <option value="line">Line</option>
              <option value="bar">Bar</option>
            </select>
          </div>
        </div>

        <div className="control-section">
          <h3>Data Filter (Optional)</h3>
          <div>
            <label>Filter Column:</label>
            <select value={filterColumn} onChange={(e) => setFilterColumn(e.target.value)}>
              <option value="">-- No Filter --</option>
              {columns.map((col) => <option key={col} value={col}>{col}</option>)}
            </select>
          </div>
          {filterColumn && (
            <div style={{ marginTop: "10px" }}>
              <label>Value:</label>
              <input
                type="text"
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                placeholder="Enter value to match"
              />
              <button onClick={() => setFilterValue("")}>Clear Filter</button>
            </div>
          )}
        </div>
      </div>

      <div className="chart-actions">
        <button className="fullscreen-btn" onClick={() => setFullscreen(!fullscreen)}>
          {fullscreen ? "Exit Fullscreen" : "Fit to Screen"}
        </button>
      </div>

      <div className={`chart-container ${fullscreen ? "chart-fullscreen" : ""}`}>
        <canvas ref={chartRef}></canvas>
        {fullscreen && (
          <button className="exit-fullscreen" onClick={() => setFullscreen(false)}>
            Exit Fullscreen
          </button>
        )}
      </div>
    </div>
  );
};

export default VisualizationComponent;



// import React, { useEffect, useRef, useState } from "react";
// import Chart from "chart.js/auto";
// import "../CSS/visualization.css";

// const VisualizationComponent = ({ data }) => {
//   const chartRef = useRef(null);
//   const [chartInstance, setChartInstance] = useState(null);
//   const [xAxis, setXAxis] = useState("");
//   const [yAxis, setYAxis] = useState("");
//   const [chartType, setChartType] = useState("line");
//   const [fullscreen, setFullscreen] = useState(false);

//   const columns = data?.columns || [];
//   const rows = data?.rows || [];

//   useEffect(() => {
//     if (!xAxis || !yAxis) return;

//     const ctx = chartRef.current.getContext("2d");
//     if (chartInstance) chartInstance.destroy();

//     // const chartData = {
//     //   labels: rows.map((r) => r[xAxis]),
//     //   datasets: [{
//     //     label: yAxis,
//     //     data: rows.map((r) => r[yAxis]),
//     //     backgroundColor: 'rgba(54, 162, 235, 0.2)',
//     //     borderColor: 'rgba(54, 162, 235, 1)',
//     //     borderWidth: 1,
//     //     pointRadius: chartType === 'scatter' ? 5 : 2
//     //   }]
//     // };

//     const chartData = {
//       labels: chartType !== 'scatter' ? rows.map((r) => r[xAxis]) : undefined,
//       datasets: [{
//         label: yAxis,
//         data: chartType === 'scatter'
//           ? rows.map((r) => ({ x: r[xAxis], y: r[yAxis] }))
//           : rows.map((r) => r[yAxis]),
//         backgroundColor: 'rgba(54, 162, 235, 0.2)',
//         borderColor: 'rgba(54, 162, 235, 1)',
//         borderWidth: 1,
//         pointRadius: chartType === 'scatter' ? 5 : 2,
//         showLine: chartType === 'scatter' ? false : true, // Optional: scatter without connecting lines
//       }]
//     };

//     const newChart = new Chart(ctx, {
//       type: chartType,
//       data: chartData,
//       options: {
//         responsive: true,
//         maintainAspectRatio: false,
//         scales: chartType === 'scatter' ? {
//           x: { type: 'linear', title: { display: true, text: xAxis } },
//           y: { type: 'linear', title: { display: true, text: yAxis } }
//         } : {},
//         plugins: {
//           title: {
//             display: true,
//             text: `${yAxis} vs ${xAxis}`,
//             padding: 20,
//             font: {
//               size: 16,
//               weight: "bold"
//             }
//           }
//         }
//       }
//     });

//     setChartInstance(newChart);
//   }, [xAxis, yAxis, chartType]);

//   return (
//     <div className={`chart-visualization-wrapper ${fullscreen ? "fullscreen" : ""}`}>
//       <div className="control-panel">
//         <div className="control-section">
//           <h3>Chart Configuration</h3>
//           <div>
//             <label>X-Axis:</label>
//             <select value={xAxis} onChange={(e) => setXAxis(e.target.value)}>
//               <option value="">Select</option>
//               {columns.map((col) => <option key={col} value={col}>{col}</option>)}
//             </select>
//           </div>
//           <div>
//             <label>Y-Axis:</label>
//             <select value={yAxis} onChange={(e) => setYAxis(e.target.value)}>
//               <option value="">Select</option>
//               {columns.map((col) => <option key={col} value={col}>{col}</option>)}
//             </select>
//           </div>
//           <div>
//             <label>Chart Type:</label>
//             <select value={chartType} onChange={(e) => setChartType(e.target.value)}>
//               <option value="line">Line</option>
//               <option value="bar">Bar</option>
//               {/* <option value="scatter">Scatter</option> */}
//             </select>
//           </div>
//         </div>
//       </div>

//       <div className="chart-actions">
//         <button className="fullscreen-btn" onClick={() => setFullscreen(!fullscreen)}>
//           {fullscreen ? "Exit Fullscreen" : "Fit to Screen"}
//         </button>
//       </div>

//       <div className={`chart-container ${fullscreen ? "chart-fullscreen" : ""}`}>
//   <canvas ref={chartRef}></canvas>
  
//   {fullscreen && (
//     <button className="exit-fullscreen" onClick={() => setFullscreen(false)}>
//       Exit Fullscreen
//     </button>
//   )}
// </div>
//     </div>
//   );
// };

// export default VisualizationComponent;
