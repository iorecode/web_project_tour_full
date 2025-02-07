const express = require('express');
const { celebrate, Joi } = require('celebrate');
const fs = require('fs');
const path = require('path');
const offerControllers = require('../controllers/offers');
const upload = require('../middleware/fileManagement.js');
const CustomError = require('../utils/customError');
const encodeFileName = require('../utils/encodeName.js');

const router = express.Router();

router.get('/', offerControllers.getOffers);

router.post(
  '/create',
  upload.single('image'),

  (req, res, next) => {
    const schema = Joi.object({
      title: Joi.string().min(2).max(100).required().messages({
        'string.min': 'The title must have at least {#limit} characters.',
        'string.max': 'The title must have at most {#limit} characters.',
        'any.required': 'Title is required.',
      }),
      description: Joi.string().min(2).max(5000).required().messages({
        'string.min': 'The description must have at least {#limit} characters.',
        'string.max': 'The description must have at most {#limit} characters.',
        'any.required': 'Description is required.',
      }),
      price: Joi.number().integer().min(1).max(1000000).required().messages({
        'number.base': 'Price must be a number.',
        'number.min': 'Price must be at least {#limit}.',
        'number.max': 'Price must not exceed {#limit}.',
        'any.required': 'Price is required.',
      }),
    });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      if (req.file) {
        console.log(req.file);
        const filePath = path.join(
          __dirname,
          '../uploads',
          encodeFileName(req.file.filename)
        );
        fs.unlink(filePath, (err) => {
          if (err)
            console.error('Failed to delete file after validation error:', err);
        });
      }
      return next(new CustomError(validationResult.error.message, 400));
    }

    if (req.file) {
      req.body.image = {
        url: `/uploads/${req.file.filename}`,
        filename: req.file.originalname,
        size: req.file.size,
        contentType: req.file.mimetype,
      };
    }

    next();
  },

  offerControllers.addOffer
);

router.delete(
  '/:id/delete',
  celebrate({
    params: Joi.object({
      id: Joi.string().required(),
    }),
  }),
  offerControllers.deleteOffer
);

router.patch(
  '/:id/edit',
  upload.single('image'), 
  (req, res, next) => {
    console.log('Received ID:', req.params.id);
    console.log('Received Body:', req.body);

    const schema = Joi.object({
      title: Joi.string().min(2).max(100).optional(),
      description: Joi.string().min(2).max(5000).optional(),
      price: Joi.number().integer().min(1).max(1000000).optional(),
      image: Joi.any().optional(),
    })
      .or('title', 'description', 'price', 'image') 
      .messages({
        'object.missing':
          'At least one field (title, description, price, or image) must be provided.',
      });

    const validationResult = schema.validate(req.body);

    if (validationResult.error) {
      if (req.file) {
        const filePath = path.join(
          __dirname,
          '../uploads',
          encodeURIComponent(req.file.filename)
        );
        fs.unlink(filePath, (err) => {
          if (err)
            console.error('Failed to delete file after validation error:', err);
        });
      }
      return next(new CustomError(validationResult.error.message, 400));
    }

    if (req.file) {
      req.body.image = {
        url: `/uploads/${encodeURIComponent(req.file.filename)}`,
        filename: req.file.originalname,
        size: req.file.size,
        contentType: req.file.mimetype,
      };
    }

    next();
  },
  async (err, req, res, next) => {
    if (err.joi && req.file) {
      fs.unlink(req.file.path, (fsErr) => {
        if (fsErr)
          console.error('Failed to delete file after validation error:', fsErr);
      });
    }
    console.error('Validation Error:', err.joi || err);
    next(err); 
  },
  offerControllers.editOffer
);

module.exports = router;
