const http = require('http');
const app = require('./app');
const server = http.createServer(app);
require('dotenv').config();
const PORT = process.env.PORT;
process.on('uncaughtException', err => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const {startMongo} = require('./services/mongo');
const {loadALLProducts} = require('../src/models/products.models');
const products = require('./models/products.mongo');
const users = require('./models/user.mongo');
const reviews = require('./models/reviews.mongo')
const orders = require('./models/orders.mongo')
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
  //await orders.deleteMany()
  //await reviews.deleteMany();
  server.listen(PORT , () => {
  console.log('running server');
  })
}

startServer();

process.on('unhandledRejection', err => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
