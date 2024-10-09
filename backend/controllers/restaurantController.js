// backend/controllers/restaurantController.js

const Restaurant = require('../models/restaurantModel');

exports.getAllRestaurants = (req, res) => {
    Restaurant.getAll((err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
};

exports.searchRestaurants = (req, res) => {
    const searchTerm = req.query.q;
    Restaurant.search(searchTerm, (err, results) => {
        if (err) {
            res.status(500).json({ error: err });
        } else {
            res.json(results);
        }
    });
};
