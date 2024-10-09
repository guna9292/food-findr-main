import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getRestaurantById, addReview } from '../api'; // Ensure this function is defined in api.js
import './RestaurantDetail.css';

const RestaurantDetail = () => {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [username, setUsername] = useState('');
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchRestaurant = async () => {
      const data = await getRestaurantById(id);
      setRestaurant(data);
      setReviews(data.reviews || []); // Make sure reviews is available
      setLoading(false);
    };
    fetchRestaurant();
  }, [id]);

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedRestaurant = await addReview(id, { username, rating, review });
      setReviews(updatedRestaurant.reviews);
      setUsername('');
      setRating(0);
      setReview('');
    } catch (err) {
      console.error('Error adding review:', err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (!restaurant) return <div>Restaurant not found</div>;

  return (
    <div className="restaurant-detail-card">
      <h1 className="restaurant-name" id="card-name">{restaurant['Restaurant Name']}</h1>
      <img src={restaurant.featured_image} alt={restaurant['Restaurant Name']} className="restaurant-detail-image" />
      <div className="restaurant-info">
        <p><strong>Address:</strong> {restaurant.Address}</p>
        <p><strong>Cuisines:</strong> {restaurant.Cuisines}</p>
        <p><strong>Average Cost for Two:</strong> {restaurant['Average Cost for two']} {restaurant.Currency}</p>
        <p><strong>Rating:</strong> 
          <span 
            className="restaurant-rating" 
            style={{ color: restaurant['Rating color'] }}>
              {restaurant['Aggregate rating']} ({restaurant['Rating text']})
          </span>
        </p>
      </div>
      <div className="review-section">
        <h2>Reviews</h2>
       {reviews.map((review, index) => (
  <div key={index} className="review-card">
    <p><strong>{review.username}</strong> - Rating: {review.rating}</p>
    <p>{review.review}</p>
  </div>
))}

        <h2>Add a Review</h2>
        <form onSubmit={handleReviewSubmit}>
          <div className="review-form">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <label htmlFor="rating">Rating:</label>
            <input
              type="number"
              id="rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              min="1"
              max="5"
              required
            />
            <label htmlFor="review">Review:</label>
            <textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            ></textarea>
            <button type="submit">Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RestaurantDetail;
