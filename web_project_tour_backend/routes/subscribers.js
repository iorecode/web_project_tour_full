const express = require('express');
const { celebrate, Joi } = require('celebrate');
const subscriberControllers = require('../controllers/subscribers');

const router = express.Router();

router.post(
  '/subscribe',
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
    }),
  }),
  subscriberControllers.signup
);

module.exports = router;
