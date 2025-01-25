const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { Offer } = require('../../models/offer');

let mongoServer;
let token;

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
  const token = jwt.sign({ _id: 'testUserId' }, 'test-secret', {
    expiresIn: '1h',
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('GET /offers', () => {
  beforeEach(async () => {
    await Offer.deleteMany();
  });

  it('should return 200 and all offers', async () => {
    const offers = [
      {
        title: 'Offer 1',
        description: 'Desc 1',
        price: 100,
        image: [{ url: 'http://example.com/img1', filename: 'img1' }],
      },
      {
        title: 'Offer 2',
        description: 'Desc 2',
        price: 200,
        image: [{ url: 'http://example.com/img2', filename: 'img2' }],
      },
    ];
    await Offer.insertMany(offers);

    const response = await request(app)
      .get('/offers')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(2);
    expect(response.body[0].title).toBe('Offer 1');
  });

  it('should return 404 if no offers exist', async () => {
    const response = await request(app)
      .get('/offers')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Erro ao retornar ofertas');
  });
});

describe('POST /offers/create', () => {
  beforeEach(async () => {
    await Offer.deleteMany();
  });

  it('should create a new offer and return 200', async () => {
    const newOffer = {
      title: 'New Offer',
      description: 'A brand new offer',
      price: 300,
      image: [{ url: 'http://example.com/newimg', filename: 'newimg' }],
    };

    const response = await request(app)
      .post('/offers/create')
      .send(newOffer)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(newOffer.title);
  });

  it('should return 400 for missing fields', async () => {
    const response = await request(app)
      .post('/offers/create')
      .send({
        title: 'Incomplete Offer',
      })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
});

describe('DELETE /offers/:id', () => {
  let offerId;

  beforeEach(async () => {
    await Offer.deleteMany();
    const offer = await Offer.create({
      title: 'Offer to delete',
      description: 'Desc',
      price: 400,
      image: [{ url: 'http://example.com/deleteimg', filename: 'deleteimg' }],
    });
    offerId = offer._id;
  });

  it('should delete an offer and return 200', async () => {
    const response = await request(app)
      .delete(`/offers/${offerId}/delete/`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Oferta deletada com sucesso');
    const deletedOffer = await Offer.findById(offerId);
    expect(deletedOffer).toBeNull();
  });

  it('should return 404 if the offer does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/offers/${fakeId}delete/`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});

describe('PATCH offers/:id/edit', () => {
  let offerId;

  beforeEach(async () => {
    await Offer.deleteMany();
    const offer = await Offer.create({
      title: 'Offer to edit',
      description: 'Original description',
      price: 500,
      image: [{ url: 'http://example.com/editimg', filename: 'editimg' }],
    });
    offerId = offer._id;
  });

  it('should edit an existing offer and return 200', async () => {
    const updatedData = { description: 'Updated description' };
    const response = await request(app)
      .patch(`/offers/${offerId}/edit`)
      .send(updatedData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.updatedOffer.description).toBe(
      updatedData.description
    );
  });

  it('should return 400 if no data is provided', async () => {
    const response = await request(app)
      .patch(`/offers/${offerId}/edit`)
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Nenhum dado para atualizar');
  });

  it('should return 404 if the offer does not exist', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .patch(`/offers/${fakeId}/edit`)
      .send({ description: 'New description' })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Oferta não encontrada');
  });
});
