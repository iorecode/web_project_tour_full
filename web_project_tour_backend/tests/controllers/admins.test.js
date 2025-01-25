const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../app');
const { Admin } = require('../../models/admin');

beforeAll(async () => {
  const { MongoMemoryServer } = require('mongodb-memory-server');
  const mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri(), {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

describe('Admin Controller', () => {
  let adminToken;

  beforeEach(async () => {
    const admin = new Admin({
      email: 'testadmin@example.com',
      password: 'P@assword123',
    });
    await admin.save();

    const res = await request(app).post('/admins/login').send({
      email: 'testadmin@example.com',
      password: 'P@assword123',
    });

    adminToken = res.body.token;
  });

  afterEach(async () => {
    await Admin.deleteMany();
  });

  describe('POST /admins/login', () => {
    it('should login an admin with valid credentials', async () => {
      const res = await request(app).post('/admins/login').send({
        email: 'testadmin@example.com',
        password: 'P@assword123',
      });

      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('token');
    });

    it('should fail with invalid credentials', async () => {
      const res = await request(app).post('/admins/login').send({
        email: 'testadmin@example.com',
        password: 'wrongpassword',
      });

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Senha ou e-mail incorreto');
    });
  });

  describe('POST /admins', () => {
    it('should create a new admin', async () => {
      const res = await request(app)
        .post('/admins/create')
        .send({ email: 'newadmin@example.com', password: 'newP@password123' })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.body.message).toBe('Admin criado com sucesso');

      const admin = await Admin.findOne({ email: 'newadmin@example.com' });
      expect(admin).not.toBeNull();
    });

    it('should fail with missing fields', async () => {
      const res = await request(app)
        .post('/admins/create')
        .send({ email: 'newadmin@example.com' })
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
    });
  });

  describe('DELETE /admins/:id', () => {
    it('should delete an admin with valid authorization', async () => {
      const admin = new Admin({
        email: 'deleteadmin@example.com',
        password: 'newP@password123',
      });
      await admin.save();

      const res = await request(app)
        .delete(`/admins/${admin._id}/delete`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.message).toBe('Admin deletado com sucesso');

      const deletedAdmin = await Admin.findById(admin._id);
      expect(deletedAdmin).toBeNull();
    });

    it('should fail without authorization', async () => {
      const admin = new Admin({
        email: 'deleteadmin@example.com',
        password: 'password123',
      });
      await admin.save();

      const res = await request(app).delete(`/admins/${admin._id}/delete`);

      expect(res.status).toBe(401);
      expect(res.body.message).toBe('Autorização necessária');
    });

    it('should fail with invalid ID', async () => {
      const res = await request(app)
        .delete('/admins/bogbeast/delete')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(res.status).toBe(400);
      expect(res.body.message).toBe('AccountId inválido');
    });
  });
});
