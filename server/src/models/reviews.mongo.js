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
        product : product_id, // means get me all reviews that belongs to that tour id
      }
    }
    ,
    {
      $group: {// group all reviews to so some stats
       _id:'$product', // group all them using the tour id
       numRatings: {$sum : 1},
       numAvg : {$avg:'$rating'},
      }
    }
  ])

  if(stats.length > 0) {
   await products.findByIdAndUpdate(product_id , {
    averageRatings: stats[0].numAvg,
    ratingsQuantity: stats[0].numRatings
  })
  }
  else {
    await products.findByIdAndUpdate(product_id , {
      ratingsAverage: 0,
      ratingsQuantity:0,
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

