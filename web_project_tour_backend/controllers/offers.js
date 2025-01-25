const CustomError = require('../utils/customError');
const { Offer } = require('../models/offer.js');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const encodeFileName = require('../utils/encodeName');

// Recebe todas ofertas na DB
const getOffers = async (req, res, next) => {
  try {
    console.log("reached")
    const allOffers = await Offer.find({});

    if (allOffers.length === 0) {
      return next(new CustomError('Erro ao retornar ofertas', 404));
    }

    res.status(200).send(allOffers);
  } catch (err) {
    console.log(err);
    next(new CustomError('Erro desconhecido', 500));
  }
};

// Adiciona uma oferta a DB com titulo descricao e imagem
const addOffer = async (req, res, next) => {
  try {
    console.log(req.body);
    const { title, description, price } = req.body;
    const image = req.file
      ? [
          {
            url: `https://api.sergiotur.com.br/uploads/${encodeFileName(req.file.filename)}`,
            filename: req.file.originalname,
            size: req.file.size,
            contentType: req.file.mimetype,
          },
        ]
      : null;

    console.log('Image URL:', image[0].url); // Log the generated URL for verification

    if (title && description && image && price) {
      const newOffer = await Offer.create({ title, description, price, image });
      res.status(200).send(newOffer);
    } else {
      next(new CustomError('Dados inválidos ou faltando', 400));
    }
  } catch (err) {
    next(new CustomError('Erro ao criar oferta', 500));
  }
};

// Deleta uma oferta na DB usando o id na URL
const deleteOffer = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('ID inválido', 400));
  }

  try {
    const offer = await Offer.findByIdAndDelete(id).orFail(
      new CustomError('Oferta não encontrada', 404)
    );

    if (offer.image && offer.image[0]?.url) {
      const filePath = path.join(
        __dirname,
        '../uploads',
        path.basename(offer.image[0].url)
      );
      fs.unlink(filePath, (err) => {
        if (err) console.error('Failed to delete file:', err);
      });
    }

    res.status(200).send({ message: 'Oferta deletada com sucesso' });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      console.error('Unexpected Error:', err);
      next(new CustomError('Erro de servidor', 500));
    }
  }
};

// Edita uma oferta fornecida pelo ID na url
const editOffer = async (req, res, next) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new CustomError('ID inválido', 400));
  }

  try {
    if (Object.keys(req.body).length === 0 && !req.file) {
      throw new CustomError('Nenhum dado para atualizar', 400);
    }

    const updateData = { ...req.body };

    if (req.file) {
      const newImage = {
        url: `https://api.sergiotur.com.br/uploads/${encodeFileName(req.file.filename)}`,
        filename: req.file.originalname,
        size: req.file.size,
        contentType: req.file.mimetype,
      };

      // Fetch the existing offer to delete the old image
      const existingOffer = await Offer.findById(id).orFail(
        new CustomError('Oferta não encontrada', 404)
      );

      if (existingOffer.image && existingOffer.image[0]?.url) {
        const oldFilePath = path.join(
          __dirname,
          '../uploads',
          path.basename(existingOffer.image[0].url)
        );
        fs.unlink(oldFilePath, (err) => {
          if (err) console.error('Failed to delete old file:', err);
        });
      }

      updateData.image = [newImage];
    }

    const updatedOffer = await Offer.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).orFail(new CustomError('Oferta não encontrada', 404));

    res.status(200).send(updatedOffer);
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      console.error('Unexpected Error:', err);
      next(new CustomError('Erro de servidor', 500));
    }
  }
};

module.exports = {
  addOffer,
  deleteOffer,
  editOffer,
  getOffers,
};
