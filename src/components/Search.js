import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";
import "../CSS/Search.css";
import { getQueries, searchQueries } from "../service/apiService";
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [datasets, setDatasets] = useState([]);
  const [visibleDatasets, setVisibleDatasets] = useState(3);
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchInitiated, setIsSearchInitiated] = useState(false); // New state to track search initiation

  const navigate = useNavigate(); 
  
  useEffect(() => {
    const fetchQueries = async () => {
      try {
        console.log("Fetching queries...");
        const queries = await getQueries();
        const parsedDatasets = queries.map((dataset) => ({
          title: dataset.tableName,
          description: dataset.description,
        }));
        setDatasets(parsedDatasets);
      } catch (error) {
        console.error("Error fetching queries:", error);
      }
    };
    fetchQueries();
  }, []);

  const handleToggle = () => {
    setVisibleDatasets(isExpanded ? 3 : datasets.length);
    setIsExpanded(!isExpanded);
  };

  const handleSearch = async () => {
    if (!searchText.trim()) return;
    try {
      console.log("Searching for:", searchText);
      const response = await searchQueries({ query: searchText });
      setSearchResults(response.map((dataset) => ({
        title: dataset.tableName,
        description: dataset.description,
      })));
      setIsSearchInitiated(true); // Mark search as initiated
    } catch (error) {
      console.error("Error searching queries:", error);
    }
  };

  const handleViewDataset = (datasetTitle) => {
    navigate(`/dataset/${datasetTitle}`);  // Navigate to DatasetPage with dataset title
  }; 

  return (
    <div className="search-page">
    <div className="page-container">
      <main className="main-content">
        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search the Database" 
            className="search-input" 
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <Search className="search-icon" />
          </button>
        </div>

        {isSearchInitiated && searchText.trim() && ( // Only show this after search is initiated
          <h2 className="search-results-heading">Results for "{searchText}"</h2>
        )}

        <div className="data-display-container">
          {(searchResults.length > 0 ? searchResults : datasets).slice(0, visibleDatasets).map((dataset, index) => (
            <div key={index} className="info-container">
              <h3 className="container-title">{dataset.title}</h3>
              <p className="container-description">{dataset.description}</p>
              <button 
                className="view-dataset-button" 
                onClick={() => handleViewDataset(dataset.title)}
              >
                View Dataset
              </button>
            </div>
          ))}
        </div>

        {(datasets.length > 3 || searchResults.length > 3) && (
          <button className="load-more-button" onClick={handleToggle}>
            {isExpanded ? "See Less" : "Load More"}
          </button>
        )}
      </main>
    </div>
    </div>
  );
};

export default SearchPage;










// import React, { useState, useEffect } from "react";
// import { Search } from "lucide-react";
// import "../CSS/Search.css";
// import { getQueries } from "../service/apiService";

// const SearchPage = () => {
//   const [datasets, setDatasets] = useState([]); // State to store dataset information
//   const [visibleDatasets, setVisibleDatasets] = useState(3); // Initially show 3 datasets
//   const [isExpanded, setIsExpanded] = useState(false); // To toggle between "Load More" and "See Less"


//   // Function to fetch datasets from backend API
//   useEffect(() => {
//     const fetchQueries = async () => {
//         try {
//             console.log('Fetching queries...');
//             const queries = await getQueries();
//             console.log(queries); // Log the fetched data for debugging
    
//             // Parse and set the datasets
//             const parsedDatasets = queries.map((dataset) => ({
//               title: dataset.tableName,  // Use 'tableName' as the title
//               description: dataset.description,  // Use 'description' as the description
//             }));
    
//             setDatasets(parsedDatasets); // Set parsed data to state
//         } catch (error) {
//           console.error('Error fetching queries:', error);
//         }
//       };
  
//       fetchQueries();
//   }, []);

//   // Function to handle "Load More" / "See Less"
//   const handleToggle = () => {
//     if (isExpanded) {
//       setVisibleDatasets(3); // Show only the first 3 datasets
//     } else {
//       setVisibleDatasets(datasets.length); // Show all datasets
//     }
//     setIsExpanded(!isExpanded); // Toggle state
//   };

//   return (
//     <div className="page-container">
//       <main className="main-content">
//         {/* Search Bar */}
//         <div className="search-container">
//           <input type="text" placeholder="Search the Database" className="search-input" />
//           <button className="search-button">
//             <Search className="search-icon" />
//           </button>
//         </div>

//         {/* Dataset Containers (Dynamic Data from API) */}
//         <div className="data-display-container">
//           {datasets.slice(0, visibleDatasets).map((dataset, index) => (
//             <div key={index} className="info-container">
//               <h3 className="container-title">{dataset.title}</h3>
//               <p className="container-description">{dataset.description}</p>
//               <button className="view-dataset-button">View Dataset</button>
//             </div>
//           ))}
//         </div>

//         {/* Load More / See Less Button */}
//         <button className="load-more-button" onClick={handleToggle}>
//           {isExpanded ? "See Less" : "Load More"}
//         </button>

//         {/* <div className="data-display-container">
//           {datasets.map((dataset, index) => (
//             <div key={index} className="info-container">
//               <h3 className="container-title">{dataset.title}</h3>
//               <p className="container-description">{dataset.description}</p>
//               <button className="view-dataset-button">View Dataset</button>
//             </div>
//           ))}
//         </div>

//         <button className="load-more-button">Load More</button> */}
//       </main>
//     </div>
//   );
// };

// export default SearchPage;