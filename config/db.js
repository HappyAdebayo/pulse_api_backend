const { Sequelize } = require('sequelize');
const config = require('./index');

let sequelize;
if (config.db.url) {
  sequelize = new Sequelize(config.db.url, {
    dialect: config.db.dialect,
    timezone: config.timezone,
    logging: false,
  });
} else {
  sequelize = new Sequelize(
    config.db.name,
    config.db.user,
    config.db.password,
    {
      host: config.db.host,
      port: config.db.port,
      dialect: config.db.dialect,
      timezone: config.timezone,
      logging: false,
    }
  );
}

module.exports = sequelize;
