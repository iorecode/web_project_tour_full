const express = require('express');
const { celebrate, Joi } = require('celebrate');
const adminControllers = require('../controllers/admins');

const router = express.Router();
const verifyMasterAdmin = require('../middleware/verifyMasterAdmin');

// Rota POST para criar admin
router.post(
  '/create',
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string()
        .min(6)
        .required()
        .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/)
        .messages({
          'string.pattern.base':
            'A senha deve conter pelo menos 6 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial.',
        }),
      master: Joi.boolean().required(),
    }),
  }),
  verifyMasterAdmin.verifyMasterAdmin,
  adminControllers.createAdmin
);

router.delete(
  '/delete',
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required(),
    }),
  }),
  verifyMasterAdmin.verifyMasterAdmin,
  adminControllers.deleteAdmin
);

router.post(
  '/login',
  celebrate({
    body: Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    }),
  }),
  adminControllers.login
);

module.exports = router;
