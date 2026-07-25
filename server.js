const app = require("./app");
const appConfig = require("./config");

const PORT = appConfig.port;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});