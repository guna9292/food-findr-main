import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const getRestaurants = async (page, searchQuery = '', filter = {}) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants`, {
      params: {
        page,
        search: searchQuery,
        country: filter.country,
        cost: filter.cost,
        cuisines: filter.cuisines,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurants:', error);
    throw error;
  }
};

export const getRestaurantById = async (id) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/restaurants/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching restaurant by ID:', error);
    throw error;
  }
};

export const addReview = async (id, reviewData) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/restaurants/${id}/review`, reviewData);
    return response.data;
  } catch (error) {
    console.error('Error adding review:', error);
    throw error;
  }
};
