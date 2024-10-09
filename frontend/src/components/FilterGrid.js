import React from 'react';

const FilterGrid = ({ filter, setFilter }) => {
  const handleFilterChange = (event) => {
    setFilter({
      ...filter,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div className="filter-grid">
      <div className="filter-row">
        <label htmlFor="country">Country:</label>
        <input
          type="text"
          id="country"
          name="country"
          value={filter.country}
          onChange={handleFilterChange}
          placeholder="e.g. India, Philippines"
        />
      </div>
      <div className="filter-row">
        <label htmlFor="cuisines">Cuisine:</label>
        <input
          type="text"
          id="cuisines"
          name="cuisines"
          value={filter.cuisines}
          onChange={handleFilterChange}
          placeholder="e.g. Indian, Japanese, Chinese"
        />
      </div>
      <div className="filter-row">
        <label htmlFor="cost">Average Cost for Two:</label>
        <input
          type="text"
          id="cost"
          name="cost"
          value={filter.cost}
          onChange={handleFilterChange}
          placeholder="e.g. 500, 1000"
        />
      </div>
    </div>
  );
};

export default FilterGrid;
