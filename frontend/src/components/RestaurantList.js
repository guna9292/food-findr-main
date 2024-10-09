import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getRestaurants } from '../api';
import './RestaurantList.css';

const RestaurantList = ({ searchQuery, filter, currentPage, setCurrentPage }) => {
  const [restaurants, setRestaurants] = useState([]);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const data = await getRestaurants(currentPage, searchQuery, filter);
      setRestaurants(data.restaurants);
      setTotalPages(data.totalPages);
    };

    fetchRestaurants();
  }, [currentPage, searchQuery, filter]);

  const handlePageChange = (page) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
      localStorage.setItem('currentPage', page); // Save the current page to local storage
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Number of visible page numbers
    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (startPage > 1) {
      pageNumbers.push(1);
      if (startPage > 2) pageNumbers.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers.map((page, index) => (
      <button
        key={index}
        className={page === currentPage ? 'active' : ''}
        onClick={() => page !== '...' && handlePageChange(page)}
        disabled={page === '...'}
      >
        {page}
      </button>
    ));
  };

  return (
    <div className="restaurant-list-container">
      <div className="restaurant-grid">
        {restaurants.map((restaurant) => (
          <Link to={`/restaurants/${restaurant['Restaurant ID']}`} key={restaurant['Restaurant ID']} className="restaurant-card">
            <img src={restaurant.featured_image} alt={restaurant['Restaurant Name']} />
            <div className="restaurant-info">
              <h2>{restaurant['Restaurant Name']}</h2>
              <p><strong>Cuisine: </strong>{restaurant.Cuisines}</p>
              <p><strong>Average cost for two:</strong>{restaurant['Average Cost for two']} {restaurant.Currency}</p>
              <a href={restaurant.url} target="_blank" rel="noopener noreferrer">
                <img src="./share_image.png" alt="Logo" style={{ width: '20px', height: '20px', opacity: 0.5, marginLeft: '10px' }} />
              </a>
            </div>
          </Link>
        ))}
      </div>
      <div className="pagination">
        <button
          className="prev-button"
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        {renderPageNumbers()}
        <button
          className="next-button"
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default RestaurantList;
