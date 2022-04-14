const {
  GetAllProducts,
  GetProductsByPrice,
  GetProductsStats,
  GetProductsForEachCompany,
  FindProduct,
  CreateNewProduct,
  UpdateProduct
} = require('../../models/products.models');

const appError = require('../../handelErrors/class.handel.error');
const reviews = require('../../models/reviews.mongo');

const {
 getPagination,
 filterFun,  
} = require('../../services/query');

async function httpCreateNewProduct(req , res, next) {
 req.body.user = req.user._id;
 const newProduct = await CreateNewProduct(req.body);
 return res.status(201).json({
   status:'success',
   data: newProduct
 })
}

async function httpUpdateProduct(req, res , next) {
 const {productid} = req.params;
 const editProduct = req.body;
 let product = await FindProduct(productid);
 if(!product) {
   return next(new appError('this product is not exits', 400));
 }
  product = await UpdateProduct(editProduct , productid);
 return res.status(200).json({
   status:'success',
   product,
 })
}


async function httpGetSingleProduct(req , res, next) {
 const Product = await FindProduct(req.params.id);
 if(!Product) {
   return next(new appError('this product is not exits', 400));
 }
 return res.status(200).json({
   status:'success',
   data: Product
 })
}

async function httpDeleteOneProduct(req, res , next) {
 const {productid} = req.params;
 const product = await FindProduct(productid);
 if(!product) {
   return next(new appError('this product is not exits', 400));
 }
 await product.remove();
 return res.status(200).json({
   status:'success'
 })
}

async function httpGetAllProducts (req , res , next) {
 /*const {featurd} = req.query;
 const obj={};
 if(featurd) {
   obj.featurd ==='true' ? true : false;
 }*/
 //console.log(req.signedCookies) 

 const {skip , limit} =getPagination(req.query);
 const filter = {...req.query};
 const execludeFileds = ['page', 'limit','sort','fields'];
 execludeFileds.forEach((el) => delete filter[el]);
 
 const features = new filterFun(req.query , filter);
 const finalFilter = features.filterFun();
 const sort = features.sortBy();
 const fields = features.fieldsFilter();

 const products = await GetAllProducts(finalFilter , skip , limit ,sort , fields) ;
 return res.status(200).json({
   status:'success',
   results:products.length,
   data : products
 })
}


// just give me the all reviews with out using populating coz it work with products means will give me product with review
// not just give me all reviews
async function httpGetSingleProductReviews (req, res ,next) {
  const {productid} = req.params;
  const product = await FindProduct(productid) ;
  if(!product) {
    return next (new appError('Product is not exits'));
  }
  const allReviews = await reviews.find({
    product: productid,
  })
  return res.status(200).json({
    status:'success',
    results: allReviews.length,
    data :allReviews
  })
}


async function httpGetProductsByPrice (req , res , next) {
   const {min , max} = req.query;
   const products = await GetProductsByPrice(Number(min) , Number(max));
   return res.status(200).json({
     status:'success',
     data : products
   })

}

async function httpGetProductsStats (req , res , next) {

 const products = await GetProductsStats();
 return res.status(200).json({
   status:'success',
   data : products
 })

}

async function httpGetProductsForEachCompany(req , res , next) {
 const products = await GetProductsForEachCompany ();
 return res.status(200).json({
   status:'success',
   data : products
 })
}

module.exports = {
 httpCreateNewProduct,
 httpGetSingleProduct,
 httpGetAllProducts,
 httpGetProductsByPrice,
 httpGetProductsStats,
 httpGetProductsForEachCompany,
 httpUpdateProduct,
 httpDeleteOneProduct,
 httpGetSingleProductReviews
}