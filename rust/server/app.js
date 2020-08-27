const loggingMiddleware = require('./middleware/loggingMiddleware').loggingMiddleware;
const express = require('express');
const bodyParser = require('body-parser');
const api = require('./api');

const app = express();

app.use(loggingMiddleware);

app.get('/', (request, response) => response.sendStatus(200));
app.get('/health', (request, response) => response.sendStatus(200));

// parse application/json
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse the raw data
app.use(bodyParser.raw());
// parse text
app.use(bodyParser.text());

// app.use(express.json());

app.use(api);

let server;

module.exports = {
  start(port) {
    server = app.listen(port, () => {
      console.log(`Listening at http://localhost:${port}`);
    });
    return app;
  },
  stop() {
    server.close();
  }
};

// const port = 3000;
// app.use(express.static(__dirname + '/public', {index: 'index.html'}));
// app.use(express.urlencoded({ extended: false }));
/*
var bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({
  extended: true
})); 

*/
// app.get('/', (req, res) => res.redirect("index.html"));
// app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
