const jwt = require('jsonwebtoken');

const { JWT_SECRET = 'chave-secreta' } = process.env;

async function auth(req, res, next) {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(401).send({ message: 'Autorização necessária' });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res
      .status(401)
      .send({ message: 'Token inválido ou não autorizado' });
  }
}

function generateTestToken() {
  const payload = {
    user: 'test-user-id',
  };

  const token = jwt.sign(payload, JWT_SECRET);

  return token;
}

module.exports = {
  auth,
  generateTestToken,
};
