const {
  GetAllReviews,
  CreateReview,
  FindProduct,
  UpdateReview,
  findReview,
  DeleteReview
} = require('../../models/reviews.models');
 
const appError = require('../../handelErrors/class.handel.error');
const {checkPermations} = require('../../services/query');


async function httpGetOneReview (req ,res ,next) { 
 const {reviewid} = req.params;
 if(!reviewid) {
   return next(new appError('Please provide the review id', 400));
 }
 const filter = {
   _id : reviewid,
 }
 const review = await findReview(filter);
 if(!review) {
  return next(new appError('this review is not found', 400));
 }
 return res.status(200).json({
   status:'success',
   data: review,
 })
}

async function httpGetAllReviews(req , res , next) {
  let filter = {};
  if(req.user.role ==='user') {
  filter.user = req.user._id;
  }
   
   const reviews = await GetAllReviews(filter);
   return res.status(200).json({
     status:'success',
     data: reviews,
   })
}




async function httpCreateReview(req , res , next) {
if(!req.params.productid){
  return next(new appError('please provide us with product id, 404'));
}
 const user_id = req.user._id;
 const productid= req.params.productid;
// must check in orders for userid and product it to make sure he bougth this product
 const review = req.body;
 const product = await FindProduct(productid);
  if(!product) {
    return next(new appError('No product was found', 404));
  }
  
  const newReview = await CreateReview(review , user_id , productid);
  return res.status(201).json({
    status:'success',
    data: newReview,
  })
  
}

async function httpUpdateMyReview(req , res ,next) {
  if(!req.params.reviewid){
    return next(new appError('please provide us with review id, 404'));
  }
  const filter = {
    user: req.user._id,
    _id: req.params.reviewid
  }
  const review = await findReview(filter);
  if(!review) {
    return next(new appError('Review was not found'));
  }
  const newReview = await UpdateReview(req.body , req.params.reviewid);
  return res.status(200).json({
    status:'success',
    data:newReview
  })
}
async function httpDeleteMyReview (req , res , next) {
  const  {reviewid} = req.params;
   if(!reviewid){
    return next(new appError('please provide us with review id, 404'));
  }
  
  const filter = {
    _id: reviewid
  }

  const review = await findReview(filter);
  if(!review) {
    return next(new appError('Review was not found'));
  }
  if(!(checkPermations (req.user , review.user)))  {
    return next (new appError('you are not authorized to delete this review'));
  }
  await DeleteReview(reviewid)
  return res.status(200).json({
    status:'success',
    message:'your review has been deleted'
  })

}

/*
async function httpAdminDeleteReview(req , res ,next) {
  if(!req.params.reviewid){
    return next(new appError('please provide us with review id, 404'));
  }
  const filter = {
    _id : req.params.reviewid,
  }
  const review = await findReview(filter);
  if(!review) {
    return next(new appError('No review was found', 404));
  }
  const isDeleted = await DeleteReview(req.params.reviewid);
  if(!isDeleted) {
    return next(new appError('Could not delete it'));
  }
  return res.status(200).json({
    status:'success',
    message:'The review has been deleted'
  })
}
 
*/
module.exports = {
  httpCreateReview,
  httpGetOneReview,
  httpGetAllReviews,
  httpUpdateMyReview,
  httpDeleteMyReview,
}