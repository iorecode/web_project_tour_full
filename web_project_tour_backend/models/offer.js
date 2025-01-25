const mongoose = require('mongoose');
const validator = require('validator');

const offerSchema = new mongoose.Schema({
  title: {
    type: String,
    minLength: 2,
    maxLength: 100,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 5000,
    trim: true,
  },
  price: {
    type: Number,
    min: 1,
    max: 1000000,
    required: true,
    trim: true,
  },
  image: [
    {
      url: {
        type: String,
        required: true,
        validate: {
          validator: (v) => {
            validator.isURL(v, {
              protocols: ['http', 'https'],
              require_protocol: true,
            });
          },
          message: 'Url inválido',
        },
      },
      filename: {
        type: String,
        required: true,
        trim: true,
      },
      size: {
        type: Number,
      },
      contentType: {
        type: String,
      },
      altText: {
        type: String,
        required: false,
      },
    },
  ],
});

const Offer = mongoose.model('Offer', offerSchema);

module.exports = { Offer };
