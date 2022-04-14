const mongoose = require('mongoose');
const products = require('./products.mongo');

const  reviewsScheam = new mongoose.Schema({
  review: {
    type : String,
    required:[true,'Review can not be empty'],
    minlength:[5,'Review length must be over than 5 chars']
  },
  rating : {
    type: Number,
    min:[1 ,'Rating must be bigger than or equal 1'],
    max :[5 ,'Rating must be less then or equal 5']
  },
  product : 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref :'Product',
      required:[true, 'Review must belong to a product']
    }
  ,
  user : 
    {
      type : mongoose.Schema.Types.ObjectId,
      ref:'User',
      required:[true, 'Review must belong to a user']
    }
  
}, {
  timestamps:true,
  toJSON:{virtuals: true},
  toObject:{virtuals: true},
})



reviewsScheam.statics.calcAverageRatings = async function (product_id) {
  const stats = await reviews.aggregate([
    {
      $match: {
        product : product_id, //_id this is product id and product_id that belongs to the reivew
        //means get me all reviews that belong to this product
      }
    }
    ,
    {
      $group: {// group all reviews to so some stats
       _id:'$product', // group all them using the prodit
       ratingsAverage :  {$avg: '$rating'},
       numberOfReviews: {$sum : 1},
      }
    }
    ,
    
  ])
 
  if(stats.length > 0) {
   await products.findByIdAndUpdate(product_id , {
    ratingsAverage: stats[0].ratingsAverage, // stats[0]?.numAvg || 0
    numberOfReviews: stats[0].numberOfReviews
  })
  }
  else {
    await products.findByIdAndUpdate(product_id , {
      averageRatings: 0,
      numberOfReviews: 0
    })
  }
} 

reviewsScheam.post('save' ,async function(){
  const review = this ;
  await review.constructor.calcAverageRatings(review.product)
})

reviewsScheam.post(/^findOneAnd/, async function(review) {
  await review.constructor.calcAverageRatings(review.product);
});
 
reviewsScheam.index({product :1 , user :1} , {
  unique: true,
})


const reviews = mongoose.model('review' , reviewsScheam);
module.exports = reviews;

