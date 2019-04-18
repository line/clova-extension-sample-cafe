const express = require('express');
const morgan = require('morgan');
const clova = require('@line/clova-cek-sdk-nodejs');

const { PORT, APPLICATION_ID } = require('./config.js');
const routes = require('./routes');

const app = express();

app.use(morgan('common'));
app.use((err, req, res, next) => next());

app.use('/', routes);

const clovaMiddleware = clova.Middleware({ applicationId: APPLICATION_ID });
app.use(clovaMiddleware);

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT} port`);
});