const database = require("./database/database");
const createApp = require("./app.js");

const app = createApp(database);

app.listen(8080);
