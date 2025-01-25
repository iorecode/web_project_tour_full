const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 2,
    maxLength: 30,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  description: {
    type: String,
    minLength: 2,
    maxLength: 4000,
    trim: true,
  },
  place: {
    type: String,
    minLength: 2,
    maxLength: 165,
    required: true,
    trim: true,
  },
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = { Review };
