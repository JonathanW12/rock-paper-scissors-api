const database = require("./database/databaseHandler");
const createApp = require("./app.js");

const app = createApp(database);

app.listen(8080);
