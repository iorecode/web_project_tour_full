const mongoose = require('mongoose');
require('dotenv').config();
const { Admin } = require('./models/admin');

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Database connected'))
  .catch((err) => console.error('Database connection error:', err));

const createMasterAdmin = async () => {
  const email = process.env.PRIME_MAIL;
  const password = process.env.PRIME_PASS;
  console.log(email, password);

  try {
    const existingAdmin = await Admin.findOne({ email, master: true });
    if (existingAdmin) {
      console.log('Admin ja foi criado.');
      return;
    }
    const masterAdmin = new Admin({
      email,
      password,
      master: true,
    });
    console.log(masterAdmin);

    await masterAdmin.save();
    console.log('Conta mestre foi criada com sucesso');
  } catch (err) {
    console.error('Erro ao criar conta mestre:', err);
  } finally {
    mongoose.connection.close();
  }
};

createMasterAdmin();
