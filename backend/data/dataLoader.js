// backend/data/dataLoader.js

const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB');
});

const restaurantSchema = new mongoose.Schema({
  id: Number,
  name: String,
  country: String,
  average_cost_for_two: Number,
  cuisines: String,
  user_rating: {
    aggregate_rating: Number,
    votes: Number
  }
});

const Restaurant = mongoose.model('Restaurant', restaurantSchema);

fs.createReadStream(path.join(__dirname, 'updated_cleaned_zomato.csv'))
  .pipe(csv())
  .on('data', async (row) => {
    const restaurant = new Restaurant({
      id: row.id,
      name: row.name,
      country: row.country,
      average_cost_for_two: row.average_cost_for_two,
      cuisines: row.cuisines,
      user_rating: {
        aggregate_rating: row.aggregate_rating,
        votes: row.votes
      }
    });

    await restaurant.save();
  })
  .on('end', () => {
    console.log('CSV file successfully processed and data loaded into MongoDB');
    mongoose.connection.close();
  });
