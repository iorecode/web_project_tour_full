const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const jwt = require('jsonwebtoken');
const app = require('../../app');
const { Review } = require('../../models/review');

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

describe('GET /reviews/top/:limit', () => {
  beforeEach(async () => {
    await Review.deleteMany();
  });

  it('should return a 200 and 3 reviews', async () => {
    const reviews = [
      {
        title: 'review1',
        rating: '4',
        description: "Review1's description",
        place: 'Italy',
      },
      {
        title: 'review2',
        rating: '3',
        description: "Review2's description",
        place: 'Washington D.C',
      },
      {
        title: 'review4',
        rating: '5',
        description: "Review4's description",
        place: 'Local Chuck E Cheese',
      },
      {
        title: 'review5',
        rating: '1',
        description: 'Very Musky',
        place: "Dray's House",
      },
      {
        title: 'review6',
        rating: '4',
        description: "Review6's description",
        place: 'Bog',
      },
    ];
    await Review.insertMany(reviews);

    const response = await request(app)
      .get('/reviews/top/3')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
  });

  it('should return an error for lack of ID', async () => {
    const response = await request(app)
      .get('/reviews/top/')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});

describe('GET /reviews/all', () => {
  beforeEach(async () => {
    await Review.deleteMany();
  });

  it('should return a 200 and all reviews', async () => {
    const reviews = [
      {
        title: 'review1',
        rating: '2',
        description: "Review1's description",
        place: 'Italy',
      },
      {
        title: 'review2',
        rating: '3',
        description: "Review2's description",
        place: 'Washington D.C',
      },
      {
        title: 'review4',
        rating: '5',
        description: "Review4's description",
        place: 'Local Chuck E Cheese',
      },
      {
        title: 'review5',
        rating: '1',
        description: 'Very Musky',
        place: "Dray's House",
      },
      {
        title: 'review6',
        rating: '4',
        description: "Review6's description",
        place: 'Bog',
      },
    ];
    await Review.insertMany(reviews);

    const response = await request(app)
      .get('/reviews/all')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(5);
  });

  it('should return a 404 if no reviews exist', async () => {
    const response = await request(app)
      .get('/reviews/all')
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});

describe('POST /reviews/add', () => {
  beforeEach(async () => {
    await Review.deleteMany();
  });

  it('should return a 200 and the new review', async () => {
    const newReview = {
      title: 'New Review',
      rating: '5',
      description: 'WOWEE',
      place: 'New ReviewLand',
    };

    const response = await request(app)
      .post('/reviews/add')
      .send(newReview)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.title).toBe(newReview.title);
  });

  it('should return a 400 with invalid fields', async () => {
    const newReview = {
      title: 'New Invalid Review',
      rating: '7',
      description: 'not WOWEE',
      place: 'Bad ReviewLand',
    };

    const response = await request(app)
      .post('/reviews/add')
      .send(newReview)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
  });
});

describe('PATCH /reviews/:id/edit', () => {
  let reviewId;

  beforeEach(async () => {
    await Review.deleteMany();
    const review = await Review.create({
      title: 'Review to edit',
      rating: '5',
      description: 'OG description',
      place: 'Sicily',
    });
    reviewId = review._id;
  });

  it('should return a 200 and the edited review', async () => {
    const updatedData = { place: "Sicily's not a place" };
    const response = await request(app)
      .patch(`/reviews/${reviewId}/edit`)
      .send(updatedData)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.updatedReview.place).toBe(updatedData.place);
  });

  it('should return a 400 with invalid fields', async () => {
    const response = await request(app)
      .patch(`/reviews/${reviewId}/edit`)
      .send({})
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Nenhum dado para atualizar');
  });

  it('should return a 404 when no review is found', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .patch(`/reviews/${fakeId}/edit`)
      .send({ place: 'Wowzers' })
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});

describe('DELETE /reviews/delete/:id', () => {
  let reviewId;

  beforeEach(async () => {
    await Review.deleteMany();
    const review = await Review.create({
      title: 'Review to Delete',
      rating: '1',
      description: 'Pog description',
      place: 'How do you spell Greece',
    });
    reviewId = review._id;
  });

  it('should return a 200', async () => {
    const response = await request(app)
      .delete(`/reviews/${reviewId}/delete`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Review deletada com sucesso');
    const deletedReview = await Review.findById(reviewId);
    expect(deletedReview).toBeNull();
  });

  it('should return a 404 if ID doesnt match up', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const response = await request(app)
      .delete(`/reviews/${fakeId}/delete`)
      .set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(404);
  });
});
