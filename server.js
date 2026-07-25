// const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const routes = require('./routes/index');
const appConfig = require('./config');
process.env.TZ = appConfig.timezone;
const app = express();

// Ensure assets directory exists and serve it statically
if (appConfig.assetsDir) {
  const assetsPath = path.resolve(appConfig.assetsDir);
  if (!fs.existsSync(assetsPath)) {
    fs.mkdirSync(assetsPath, { recursive: true });
  }
  app.use('/' + appConfig.assetsDir.replace(/\\/g, '/').replace(/^\//, ''), express.static(assetsPath));
}

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const apiPrefix = '/api';

// Documentation link: http://localhost:${appConfig.port}/api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(apiPrefix, routes);

app.get('/', (req, res) => {
  res.json({ message: "Welcome to pulse_api API backend" });
});

const PORT = appConfig.port;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
