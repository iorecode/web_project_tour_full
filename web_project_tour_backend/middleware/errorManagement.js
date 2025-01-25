// middleware centralizado para lidar com erros joi e gerais
module.exports = (err, req, res, next) => {
  if (err.joi) {
    res.status(400).send({ message: err.joi.message });
  } else {
    const statusCode = err.statusCode || 500;
    const message = statusCode === 500 ? 'Erro no servidor' : err.message;
    res.status(statusCode).json({
      message,
      success: false,
      stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
    });
  }
};
