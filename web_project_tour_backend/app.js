require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const path = require('path');
const compression = require('compression');
const auth = require('./middleware/auth');
const errorManagement = require('./middleware/errorManagement');
const logger = require('./middleware/logGeneration');
const reviewControllers = require('./controllers/reviews');
const offerControllers = require('./controllers/offers');
const rateLimiter = require('./middleware/rateLimiter');
const { generateTestToken } = require('./middleware/auth');

const app = express();

// Protecao das conexoes de varios http headers
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173'];

      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error('Not allowed by CORS'));
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  '/uploads',
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = ['http://localhost:5173'];

      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error('Not allowed by CORS'));
    },
  }),
  (req, res, next) => {
    res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
    next();
  },
  express.static(path.join(__dirname, 'uploads'))
);

// Conexao com o MongoDB
if (process.env.NODE_ENV !== 'test') {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error('Database connection error:', err);
    });
}

app.use(logger.requestLogger);

// Compressao de arquivos, util pra lidar com todas as fotos
app.use(
  compression({
    threshold: 1024,
    level: 4,
  })
);

// Rotas sem necessidade de autenticacao
app.get('/tester', (req, res) => {
  const token = generateTestToken();
  res.json({ token });
});
app.get('/offers/', offerControllers.getOffers);
app.post('/review', reviewControllers.addReview);
app.use('/emails', rateLimiter, require('./routes/subscribers'));

app.use('/admins', require('./routes/admins'));
app.use('/offers', auth.auth, require('./routes/offers'));
app.use('/reviews', require('./routes/reviews'));

app.use(logger.errorLogger);

// Celebrate
app.use(errors());

// Centralizado
app.use(errorManagement);

if (process.env.NODE_ENV !== 'test') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

module.exports = app;
