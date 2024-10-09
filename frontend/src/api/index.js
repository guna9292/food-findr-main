export const getRestaurants = async (page = 1, limit = 9) => {
    const response = await fetch(`http://localhost:5000/restaurants?page=${page}&limit=${limit}`);
    const data = await response.json();
    return data;
  };
  