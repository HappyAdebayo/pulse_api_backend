require('dotenv').config();

module.exports = {
  development: process.env.DATABASE_URL ? {
    use_env_variable: 'DATABASE_URL',
    dialect: process.env.DB_DIALECT || 'postgres',
  } : {
    username: process.env.DB_USERNAME || process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT || 'postgres',
    port: process.env.DB_PORT || 5432,
  }
};
