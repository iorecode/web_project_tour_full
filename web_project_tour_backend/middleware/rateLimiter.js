const rateLimit = require('express-rate-limit');

// Limita requests
const rateLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 60,
  message: 'Limite de requests excedido. Tente novamente após 10 minutos.',
  standardHeaders: 'draft-7',
  legacyHeaders: false,
});

module.exports = rateLimiter;
