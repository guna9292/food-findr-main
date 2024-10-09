import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import RestaurantList from './components/RestaurantList';
import RestaurantDetail from './components/RestaurantDetail';
import './App.css';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState({
    country: '',
    cost: '',
    cuisines: '',
  });
  const [currentPage, setCurrentPage] = useState(1);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleFilterButtonClick = () => {
    setCurrentPage(1); // Reset to first page when filters change
  };

  return (
    <Router>
      <div className="app">
        <header className="app-header">
          <img
            src="https://b.zmtcdn.com/web_assets/81f3ff974d82520780078ba1cfbd453a1583259680.png"
            alt="Header Background"
            className="header-image"
          />
          <div className="header-content">
            <div className="header-title-container">
              <h1 className="header-title">
                <img src="https://b.zmtcdn.com/web_assets/8313a97515fcb0447d2d77c276532a511583262271.png" alt="Zomato Logo" className="zomato-logo" />
              </h1>
            </div>
            <p className="header-subtitle">Discover the best food & drinks in your city</p>
            <div className="search-bar">
              <input
                type="text"
                placeholder="Search for restaurants, cafes, bars..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-bar">
              <h3>Filter Options</h3>
              <div className="filter-grid">
                <div className="filter-row">
                  <label htmlFor="country">Country:</label>
                  <input
                    type="text"
                    id="country"
                    name="country"
                    value={filter.country}
                    onChange={handleFilterChange}
                    placeholder="e.g., India, Philippines"
                  />
                </div>
                <div className="filter-row">
                  <label htmlFor="cost">Average Cost:</label>
                  <input
                    type="text"
                    id="cost"
                    name="cost"
                    value={filter.cost}
                    onChange={handleFilterChange}
                    placeholder="e.g., 500"
                  />
                </div>
                <div className="filter-row">
                  <label htmlFor="cuisines">Cuisines:</label>
                  <input
                    type="text"
                    id="cuisines"
                    name="cuisines"
                    value={filter.cuisines}
                    onChange={handleFilterChange}
                    placeholder="e.g., Indian, Japanese"
                  />
                </div>
              </div>
              <button className="filter-button" onClick={handleFilterButtonClick}>Filter</button>
            </div>
          </div>
        </header>
        <Routes>
          <Route
            path="/"
            element={
              <RestaurantList
                searchQuery={searchQuery}
                filter={filter}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            }
          />
          <Route path="/restaurants/:id" element={<RestaurantDetail />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
