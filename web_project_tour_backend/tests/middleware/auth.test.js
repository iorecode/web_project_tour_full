const request = require('supertest');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const { auth } = require('../../middleware/auth');
const { Blacklist } = require('../../models/blacklist');
const app = require('../../app');
const utils = require('../../utils/utils');

jest.mock('jsonwebtoken', () => ({
  ...jest.requireActual('jsonwebtoken'),
  verify: jest.fn((token, secret) => {
    if (token === 'invalid') throw new Error('Invalid token');
    return { _id: 'testUserId' };
  }),
}));

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Middleware: auth', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
    await Blacklist.deleteMany();
    app.get('/protected', auth, (req, res) => {
      res.status(200).send({ message: 'Access granted', user: req.user });
    });
  });

  it('should pass authentication with a valid token', async () => {
    const token = jwt.sign({ _id: 'testUserId' }, 'test-secret', {
      expiresIn: '1h',
    });

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Access granted');
    expect(response.body.user).toEqual(
      expect.objectContaining({ _id: 'testUserId' })
    );
  });

  it('should return 401 if no token is provided', async () => {
    const response = await request(app).get('/protected');
    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Autorização necessária');
  });

  it('should return 401 if token is blacklisted', async () => {
    const token = jwt.sign({ _id: 'testUserId' }, 'test-secret', {
      expiresIn: '1h',
    });
    await utils.revokeToken(token);

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token revogado');
  });

  it('should return 401 if token is invalid', async () => {
    const invalidToken = 'invalid';

    const response = await request(app)
      .get('/protected')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe('Token inválido ou não autorizado');
  });
});
