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

const multer = require('multer');
const sharp = require('sharp');

const multerStorage = multer.memoryStorage();
const multerFilter = (req , file , cb) => {
  if(file.mimetype.startsWith('image')) 
  {
    cb(null , true);
  }else {
    cb(new appError ('Not an image! please upload only images', 400 ) , false);
  }
}

const upload = multer({
  storage: multerStorage,
  fileFilter : multerFilter,
})

const uploadProductsImages = upload.fields([
  {name :'imageCover' , maxCount: 1},
  {name: 'images' , maxCount: 3},
])

const resizeProductsImages = async (req , res , next) => {
 if(req.files.imageCover) {
  req.body.imageCover=`product-${req.params.productid}-${Date.now()}.jpeg`;
  await sharp(req.files.imageCover[0].buffer)
  .resize({width :500 , height: 500})
  .toFormat('jpeg')
  .jpeg({quality:90})
  .toFile(`public/images/products/${req.body.imageCover}`);
 }
  

if(req.files.images) {
 req.body.images = [];
 await Promise.all(req.files.images.map( async (file ,i) => {
   const filename = `product-${req.params.productid}-${Date.now()}-${ i + 1 }.jpeg`;
   await sharp(file.buffer)
   .resize({width :300 , height: 300})
   .toFormat('jpeg')
   .jpeg({quality:90})
   .toFile(`public/images/products/${filename}`);

   req.body.images.push(filename);
 }))
}
 next();
}

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
 await product.remove();// use it to use middleware to delete all reviews
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
 httpGetSingleProductReviews,
 uploadProductsImages,
 resizeProductsImages
 
}