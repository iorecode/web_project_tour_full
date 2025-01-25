const dotenv = require('dotenv');

const env = process.env.NODE_ENV || 'development'; // Default to 'development'
const envFile = `.env${env === 'test' ? '.test' : env === 'production' ? '.production' : ''}`;

dotenv.config({ path: envFile });

module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  REDIS_URL: process.env.REDIS_URL,
};
