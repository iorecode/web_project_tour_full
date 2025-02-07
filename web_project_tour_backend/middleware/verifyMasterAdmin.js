/* eslint-disable prettier/prettier */
const CustomError = require('../utils/customError');
const { Admin } = require('../models/admin');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = process.env;

const verifyMasterAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization.replace('Bearer ', '');
    if (!token) {
      throw new CustomError('Token de autorizacao faltando', 401);
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = await Admin.findById(decoded._id);

    if (!admin || !admin.master) {
      throw new CustomError('Accesso Negado', 403);
    }

    next();
  } catch (err) {
    next(err);
  }
};

module.exports = {
  verifyMasterAdmin,
};
