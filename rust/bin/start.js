const Server = require('../server/app.js');
require("dotenv").config();

Server.start(process.env.PORT);