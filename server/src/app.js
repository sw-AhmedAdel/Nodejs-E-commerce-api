const express = require('express');
const app = express();
const handelErrorMiddleware = require('./services/function_handel_error');

app.use(express.json());
app.use(handelErrorMiddleware);
const api =require('./routes/api');
app.use('/v1' , api);
module.exports= app;