const express = require('express');
const { celebrate, Joi } = require('celebrate');
const reviewControllers = require('../controllers/reviews');
const auth = require('../middleware/auth');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

router.get(
  '/top/:limit',
  celebrate({
    params: Joi.object({
      limit: Joi.number().integer().min(1).required().messages({
        'number.base': 'limit must be a number.',
        'number.integer': 'limit must be an integer.',
        'number.min': 'limit must be greater than or equal to 1.',
        'any.required': 'limit is required.',
      }),
    }),
  }),
  reviewControllers.getTopReviews
);

router.get('/all', reviewControllers.getAllReviews);

router.post(
  '/add',
  celebrate({
    body: Joi.object({
      title: Joi.string().min(2).required(),
      rating: Joi.number().integer().min(1).max(5).required().messages({
        'number.min': 'The rating must be at least 1.',
        'number.max': 'The rating must not exceed 5.',
        'number.base': 'The rating must be a valid number.',
      }),
      description: Joi.string().min(2).optional().messages({
        'string.min': 'A descrição deve ter no mínimo {#limit} caracteres.',
        'string.max': 'A descrição deve ter no máximo {#limit} caracteres.',
      }),
      place: Joi.string().min(2).required(),
    }),
  }),
  rateLimiter,
  reviewControllers.addReview
);

router.patch(
  '/:id/edit',
  (req, res, next) => {
    console.log(req.body);
    next();
  },
  celebrate({
    params: Joi.object({
      id: Joi.string().required(),
    }),
    body: Joi.object({
      title: Joi.string().min(2).optional(),
      rating: Joi.number().integer().min(1).max(5).optional().messages({
        'number.min': 'The rating must be at least 1.',
        'number.max': 'The rating must not exceed 5.',
        'number.base': 'The rating must be a valid number.',
      }),
      description: Joi.string().min(5).optional().messages({
        'string.min': 'A descrição deve ter no mínimo {#limit} caracteres.',
        'string.max': 'A descrição deve ter no máximo {#limit} caracteres.',
      }),
      place: Joi.string().min(2).optional(),
      __v: Joi.any().optional(),
    }),
  }),
  auth.auth,
  reviewControllers.editReview
);

router.delete(
  '/:id/delete',
  celebrate({
    params: Joi.object({
      id: Joi.string().required(),
    }),
  }),
  auth.auth,
  reviewControllers.deleteReview
);

module.exports = router;
