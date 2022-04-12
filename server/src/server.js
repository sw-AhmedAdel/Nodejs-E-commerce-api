const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require('dotenv').config();
const PORT = process.env.PORT;

const {startMongo} = require('./services/mongo');
const {loadALLProducts} = require('../src/models/products.models');
const products = require('./models/products.mongo');
const users = require('./models/user.mongo');
async function startServer () {
 
  await startMongo();
  
  if(process.argv==='i') {
  await loadALLProducts();
  }

  if(process.argv==='d'){
    await products.deleteMany();
  }

  if(process.argv[2]==='both') {
    await products.deleteMany();
    await loadALLProducts();
  }
  //await users.deleteMany();
  server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();