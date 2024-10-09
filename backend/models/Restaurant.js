// models/Restaurant.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  rating: { type: Number, required: true },
  review: { type: String, required: true }
}, { _id: false });

const restaurantSchema = new mongoose.Schema({
  'Restaurant ID': Number,
  'Restaurant Name': String,
  'City': String,
  'Address': String,
  'Locality': String,
  'Longitude': Number,
  'Latitude': Number,
  'Cuisines': String,
  'Average Cost for two': Number,
  'Currency': String,
  'Has Table booking': String,
  'Has Online delivery': String,
  'Is delivering now': String,
  'Switch to order menu': String,
  'Price range': Number,
  'Aggregate rating': Number,
  'Rating color': String,
  'Rating text': String,
  'Votes': Number,
  'Country Name': String,
  'url': String,
  'featured_image': String,
  reviews: [reviewSchema]  // Add this line to include reviews
});

module.exports = mongoose.model('Restaurant', restaurantSchema, 'restaurants');
