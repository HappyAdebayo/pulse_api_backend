require('dotenv').config();

const config = {
  db: {
    url: process.env.DATABASE_URL,
    name: process.env.DB_DATABASE || process.env.DB_NAME,
    user: process.env.DB_USERNAME || process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_DIALECT || 'postgres',
  },
  mail: {
    host: process.env.MAIL_HOST,
    port: parseInt(process.env.MAIL_PORT || '587'),
    username: process.env.MAIL_USERNAME,
    password: process.env.MAIL_PASSWORD,
    from: process.env.MAIL_FROM,
  },
  sendgrid: {
    apiKey: process.env.SENDGRID_API_KEY,
    from: process.env.SENDGRID_FROM,
  },
  mailgun: {
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN,
    from: process.env.MAILGUN_FROM,
  },
  aws: {
    region: process.env.AWS_REGION,
    sesFrom: process.env.AWS_SES_FROM,
  },
  timezone: process.env.DB_TIMEZONE || 'UTC',
  assetsDir: process.env.ASSETS_DIRECTORY || 'storage/assets',
  port: process.env.PORT || 3000,
  jwtSecret: process.env.JWT_SECRET || 'your_jwt_secret_here',
};

module.exports = config;
