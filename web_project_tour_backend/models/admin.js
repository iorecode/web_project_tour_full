const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: true,
    validate: {
      validator(v) {
        return validator.isEmail(v);
      },
      message: 'Email inválido',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
    trim: true,
  },
  master: {
    type: Boolean,
    required: false,
    default: false,
  },
});

adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err);
  }
});

const Admin = mongoose.model('Admin', adminSchema);

module.exports = { Admin };
