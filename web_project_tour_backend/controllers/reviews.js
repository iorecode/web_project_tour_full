const CustomError = require('../utils/customError');
const { Review } = require('../models/review');

// Recebe as melhores reviews, limitado pelo numero na url
async function getTopReviews(req, res, next) {
  const { limit } = req.params;

  if (isNaN(limit) || limit <= 0) {
    return next(new CustomError('Invalid limit value', 400));
  }

  try {
    const topRatedReviews = await Review.aggregate([
      { $match: { rating: { $gte: 4 } } },
      { $sample: { size: limit } },
    ]);

    if (topRatedReviews.length === 0) {
      throw new CustomError('Erro ao retornar reviews', 404);
    }

    res.status(200).send(topRatedReviews);
  } catch (err) {
    if (err.status === 404) {
      next(err);
    } else {
      next(new CustomError('Erro ao retornar reviews', 500));
    }
  }
}

// Recebe todas as reviews
async function getAllReviews(req, res, next) {
  try {
    const allReviews = await Review.find({}).orFail(
      new CustomError('Reviews nao encontradas', 404)
    );
    res.status(200).send(allReviews);
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(new CustomError('Erro ao retornar reviews', 500));
    }
  }
}

// Adiciona uma review
async function addReview(req, res, next) {
  try {
    const { title, rating, description, place } = req.body;
    if (!title || !rating || !place) {
      return next(new CustomError('Erro ao criar review, campos vazios', 400));
    }
    const newReview = await Review.create({
      title,
      rating,
      description,
      place,
    });
    res.status(200).send(newReview);
  } catch (err) {
    if (err.status === 400) {
      next(err);
    } else {
      next(new CustomError('Erro ao criar review', 500));
    }
  }
}

// Edita uma review usando parametros na url
const editReview = async (req, res, next) => {
  const { id } = req.params;
  const data = req.body;

  try {
    if (Object.keys(data).length === 0) {
      throw new CustomError('Nenhum dado para atualizar', 400);
    }
    const updatedReview = await Review.findOneAndUpdate({ _id: id }, data, {
      new: true,
    }).orFail(new CustomError('Review não encontrada', 404));
    res
      .status(200)
      .send({ message: 'Review editada com sucesso', updatedReview });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(
        err.status === 404 ? err : new CustomError('Erro ao editar review', 500)
      );
    }
  }
};

// Deleta uma review usando parametros na url
const deleteReview = async (req, res, next) => {
  const { id } = req.params;

  try {
    await Review.deleteOne({ _id: id }).orFail(
      new CustomError('Erro ao deletar review', 404)
    );
    res.status(200).send({ message: 'Review deletada com sucesso' });
  } catch (err) {
    if (err instanceof CustomError) {
      next(err);
    } else {
      next(
        err.status === 404
          ? err
          : new CustomError('Erro ao deletar review', 500)
      );
    }
  }
};

module.exports = {
  getTopReviews,
  getAllReviews,
  addReview,
  deleteReview,
  editReview,
};
