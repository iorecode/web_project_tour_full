const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models/admin.js');
const CustomError = require('../utils/customError');
// eslint-disable-next-line no-undef
const { JWT_SECRET } = process.env;
const mongoose = require('mongoose');

// funcao de login de admins
async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email }).select('+password');

    if (!admin) {
      throw new CustomError('Senha ou e-mail incorreto', 401);
    }

    const match = await bcrypt.compare(password, admin.password);
    if (!match) {
      throw new CustomError('Senha ou e-mail incorreto', 401);
    }

    const token = jwt.sign({ _id: admin._id }, JWT_SECRET, {
      expiresIn: '30d',
    });
    res.status(200).send({ token });
  } catch (err) {
    next(err);
  }
}

// funcao de criar conta admin
const createAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new CustomError('Dados faltando: forneça email e senha.', 400);
    }

    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      throw new CustomError(
        `Já existe uma conta de administrador com o email: ${email}.`,
        409
      );
    }

    await Admin.create({ email, password });
    res.status(201).send({ message: 'Admin criado com sucesso' });
  } catch (err) {
    next(err);
  }
};

const deleteAdmin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const adminToDelete = await Admin.findOne({ email }).select('+password');

    if (!adminToDelete) {
      throw new CustomError('Admin nao encontrado', 404);
    }

    if (adminToDelete.master) {
      throw new CustomError('Nao pode-se deletar um Admin mestre', 403);
    }

    const match = await bcrypt.compare(password, adminToDelete.password);
    if (!match) {
      throw new CustomError('Senha ou e-mail incorreto', 401);
    }

    await adminToDelete.deleteOne();
    res.status(200).send({ message: 'Admin deletado com sucesso' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  login,
  createAdmin,
  deleteAdmin,
};
