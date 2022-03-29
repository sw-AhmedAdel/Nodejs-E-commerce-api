const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require('dotenv').config();
const PORT = process.env.PORT;

const {startMongo} = require('./services/mongo');
const {loadALLProducts} = require('../src/models/products.models');

async function startServer () {
 
  await startMongo();
  await loadALLProducts();
 server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();