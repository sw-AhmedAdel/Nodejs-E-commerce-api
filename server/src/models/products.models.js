const products = require('./products.mongo');
const fs = require('fs');
const path = require('path');

async function populateAllProducts() {
  const getProducts = JSON.parse( fs.readFileSync(path.join(__dirname,'..','..', 'data', 'products.json')));
   
    await products.create(getProducts);
  
}

async function FindProduct(id) {
  return await products.findOne({
    _id : id
  }).populate('reviews');
}

async function loadALLProducts() {
    const firstProduct = await products.findOne({
      "name": "accent chair",
      "price": 25,
      "company": "marcos",
      "rating": 4
    })
    if(firstProduct){
      console.log('all products already exits');
    }
    else {
      console.log('loading all products')
      await populateAllProducts();
    }
}

async function CreateNewProduct (Product) {
  const newProduct = new products(Product);
  await newProduct.save();
  return newProduct
}

async function UpdateProduct(editProduct , id) {
  /*
  const product = await products.findOneAndUpdate( {_id : id} , editProduct , {
    new : true,
    runValidators:true,
  })
  */
  const product = await products.findByIdAndUpdate(id , editProduct , {
    new : true,
    runValidators:true,
  })
  return product;
}

async function GetAllProducts (filter , skip , limit ,sort ,fields) {
  return await products.find(filter)
  .skip(skip)
  .limit(limit)
  .select(fields)
  .sort(sort)
  .populate('reviews');
}



async function GetProductsByPrice (min , max) {
  const prod = await products.aggregate([
    {
     $unwind:'$price',
    }
    ,
    {
     $match : {
      price :{
        $gte:min ,
        $lte:max,
      }
     }
    }
    ,
    {
      $group: {
        _id : '$price',
        numProducts : {$sum : 1},
        products: {$push : '$name'},
      }
    }
    ,
    {
      $sort: {
        price: 1
      }
    }
    ,
    {
     $addFields: {
       price :'$_id'
     }
    },

    {
      $project: {
        _id: 0
      }
    }
  ])
  return prod;
}

async function GetProductsStats () {
  const prod = await products.aggregate([

    {
    $match: {
      price :{
       $gte :0
      }
    }
    }
    ,
    {
    $group : {
      _id :'$company',
      numProducts: {$sum : 1},
      minPrice : {$min :'$price'},
      maxPrice :{$max :'$price'},
      avgPrice: {$avg:'$price'},

    } 
    }
    , 
    {
      $addFields: {
        company_name :'$_id',
      }
    }
    ,

    {
      $project:{
        _id:0
      }
    }
    
  ])
  return prod;
}

async function GetProductsForEachCompany () {
  
  const prod = await products.aggregate([
     
    {
      $unwind : '$company'
    }
    ,
    {
      $match: {
        price :{
          $gte :0,
        }
      }
    }
    ,
    {
      $group: {
        _id :'$company',
        numProducts:{$sum : 1},
        products: {$push : '$name'},
      }
    }
    ,
    {
      $sort: {
        company: 1,
      }
    }
    ,
    {
      $addFields: {
        company_name : '$_id',
      }
    },

    {
      $project: {
        _id: 0,
      }
    }
  ])
  return prod;
}

module.exports = {
  loadALLProducts,
  CreateNewProduct,
  GetAllProducts,
  GetProductsByPrice,
  GetProductsStats,
  GetProductsForEachCompany,
  FindProduct,
  UpdateProduct
}
