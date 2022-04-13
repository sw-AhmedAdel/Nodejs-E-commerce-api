const {
  GetAllReviews,
  CreateReview,
  FindTour,
  UpdateReview,
  findReview,
  DeleteReview
} = require('../../models/reviews.models');
const bookings = require('../../models/booking.mongo');

const appError = require('../../services/class.err.middleware');

async function httpGetAllReviews(req , res , next) {
  let filter = {};
  if(req.params.tourid){
    const tour = await FindTour(req.params.tourid);
    if(!tour) {
      return next(new appError('No tour was found', 404));
    }
    filter.tour = req.params.tourid
  }
   const reviews = await GetAllReviews(filter);
   return res.status(200).json({
     status:'success',
     data: reviews,
   })
}

async function httpCreateReview(req , res , next) {
 /* first approcah  
 if(!req.body.tour) req.body.tour = req.params.tourid;
  if(!req.body.user) req.body.user = req.user._id;
  and pass the body to createtour
*/
if(!req.params.tourid){
  return next(new appError('please provide us with tour id, 404'));
}
const user_id = req.user._id;
const tour_id= req.params.tourid;
  const bookedThisTour = await bookings.findOne({
    user: user_id,
    tour: tour_id,
  })
  if(!bookedThisTour) {
    return next(new appError('You must book this tour before making a review' , 400));
  }
  const review = req.body;
  const tour = await FindTour(tour_id);
  if(!tour) {
    return next(new appError('No tour was found', 404));
  }
  const newReview = await CreateReview(review , user_id , tour_id);
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
  const isDeleted = await DeleteReview(req.params.reviewid);
  if(!isDeleted) {
    return next(new appError('Could not delete it'));
  }
  return res.status(200).json({
    status:'success',
    message:'your review has been deleted'
  })

}


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
 

module.exports = {
  httpCreateReview,
  httpGetAllReviews,
  httpUpdateMyReview,
  httpAdminDeleteReview,
  httpDeleteMyReview
}