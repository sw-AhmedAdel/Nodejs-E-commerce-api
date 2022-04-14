const reviews = require('./reviews.mongo')
const products = require('./products.mongo');

async function GetAllReviews (filter ) {
  //eatch review has id for product and user so use populate to show them
  //so using populate when the model it seld has ref id to another model
  return await reviews.find(filter ).populate({
    path:'product',
    select:'name price company'
  })
  .populate({
    path:'user',
    select:'name'
  })
}

async function FindProduct(id) {
  return await products.findById(id);
}


async function CreateReview (reviewBody , user_id , productid ) {
 // const newReview = await reviews.create(review)
   const review = Object.assign(reviewBody, {
    product:productid,
     user:user_id,
   })
 
   const newReview  = new reviews(review);
   await newReview.save();
   return newReview;
}

async function UpdateReview(review , id) {
    const newReview = await reviews.findByIdAndUpdate(id , review , {
    new:true,
    runValidators:true,
  })
  return newReview
}

async function findReview(filter) {
  return await reviews.findOne(filter)
}
 
async function DeleteReview(id) {
  const review = await reviews.findOneAndDelete({
    _id : id
  })
  return review;
  
}

module.exports = {
  GetAllReviews,
  CreateReview,
  FindProduct,
  UpdateReview,
  findReview,
  DeleteReview
 }
 