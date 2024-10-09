const express = require('express');
const mongoose = require('mongoose');
const memjs = require('memjs');
const cors = require('cors');
require('dotenv').config();
const Restaurant = require('./models/Restaurant');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { dbName: process.env.DB_NAME })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

const memcachedHost = process.env.MEMCACHED_HOST || 'localhost';
const memcachedPort = process.env.MEMCACHED_PORT || 11211;

// Middleware
app.use(cors());
app.use(express.json());

const memcached = memjs.Client.create(`${memcachedHost}:${memcachedPort}`);

async function cacheMiddleware(req, res, next) {
  const key = req.originalUrl;
  memcached.get(key, (err, data) => {
    if (err) {
      console.error('Memcached error:', err);
      return next();
    }

    if (data) {
      return res.json(JSON.parse(data.toString()));
    }

    next();
  });
}

// API Service by /restaurants
app.get('/restaurants', cacheMiddleware, async (req, res) => {
  const { page = 1, limit = 9, country, cost, cuisines, search } = req.query;

  const pageNumber = parseInt(page);
  const pageSize = parseInt(limit);

  const filter = {};
  if (country) filter['Country Name'] = new RegExp(country, 'i');
  if (cost) filter['Average Cost for two'] = { $lte: parseInt(cost) };
  if (cuisines) filter['Cuisines'] = new RegExp(cuisines, 'i');
  if (search) {
    filter.$or = [
      { 'Restaurant Name': new RegExp(search, 'i') },
      { 'Locality': new RegExp(search, 'i') }
    ];
  }

  try {
    const restaurants = await Restaurant.find(filter)
      .limit(pageSize)
      .skip((pageNumber - 1) * pageSize)
      .exec();
    const count = await Restaurant.countDocuments(filter);

    const response = {
      restaurants,
      totalPages: Math.ceil(count / pageSize),
      currentPage: pageNumber
    };

    const key = req.originalUrl;
    memcached.set(key, JSON.stringify(response), { expires: 3600 }, (err) => {
      if (err) console.error('Failed to cache data:', err);
    });

    res.json(response);
  } catch (err) {
    console.error('Error retrieving restaurants:', err);
    res.status(500).send(err.message);
  }
});

// Get a single restaurant by ID, including reviews
app.get('/restaurants/:id', cacheMiddleware, async (req, res) => {
  try {
    const restaurant = await Restaurant.findOne({ 'Restaurant ID': parseInt(req.params.id) });
    if (!restaurant) return res.status(404).send('Restaurant not found');

    const key = req.originalUrl;
    memcached.set(key, JSON.stringify(restaurant), { expires: 3600 }, (err) => {
      if (err) console.error('Failed to cache data:', err);
    });

    res.json(restaurant);
  } catch (err) {
    res.status(500).send(err.message);
  }
});

app.put('/restaurants/:id/review', async (req, res) => {
  const { id } = req.params;
  const { username, rating, review } = req.body;

  try {
    const restaurant = await Restaurant.findOne({ 'Restaurant ID': parseInt(id) });
    if (!restaurant) return res.status(404).send('Restaurant not found');

    // Add new review to the reviews array
    restaurant.reviews.push({ username, rating, review });
    await restaurant.save();  // Save the document

    res.status(200).json(restaurant);
  } catch (err) {
    res.status(500).send(err.message);
  }
});



// Make a log line of printing port number
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
