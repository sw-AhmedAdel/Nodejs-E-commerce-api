const mongoose = require('mongoose');
const tours = require('./tours.mongo');

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
  //reivew will have the tour id and the user id coz user will write his review about the tour
  tour : 
    {
      type: mongoose.Schema.Types.ObjectId,
      ref :'tour',
      required:[true, 'Review must belong to a tour']
    }
  ,
  user : 
    {
      type : mongoose.Schema.Types.ObjectId,
      ref:'user',
      required:[true, 'Review must belong to a user']
    }
  
}, {
  timestamps:true,
  toJSON:{virtuals: true},
  toObject:{virtuals: true},
})

reviewsScheam.statics.calcAverageRatings = async function (tour_id) {
  const stats = await reviews.aggregate([

    {
      $match: {
        tour : tour_id, // means get me all reviews that belongs to that tour id
      }
    }
    ,
    {
      $group: {// group all reviews to so some stats
       _id:'$tour', // group all them using the tour id
       numRatings: {$sum : 1},
       numAvg : {$avg:'$rating'},
      }
    }
  ])

  if(stats.length > 0) {
   await tours.findByIdAndUpdate(tour_id , {
    ratingsAverage: stats[0].numAvg,
    ratingsQuantity: stats[0].numRatings
  })
  }
  else {
    await tours.findByIdAndUpdate(tour_id , {
      ratingsAverage: 0,
      ratingsQuantity:0,
    })
  }
} 

reviewsScheam.post('save' ,async function(){
  //use it when save the reivew make tha all stats on tour
  //here use constructor coz it points to the model review coz it did not create yet 
  // use review.constructor why coz it is supposed to use the model which is reviews but here it did not create yer
  const review = this ;
  await review.constructor.calcAverageRatings(review.tour)
})

reviewsScheam.post(/^findOneAnd/, async function(review) {
  await review.constructor.calcAverageRatings(review.tour);
});

//prevern dub reviews
reviewsScheam.index({tour :1 , user :1} , {
  unique: true,
})
//populate the all users for the all reivew mean show me each review has been made by user 
// this is a middleware so any middle ware use find this will make it populate so when i get one tour
//i will get the all data about review
reviewsScheam.pre(/^find/ , function(next) {
 this.populate({
  path:'user',
  select:'name photo'
})/*.populate({
  path:'tour',
  select:'-guides _id name'
})here if i want to get the name of tour for each review but when i get the tour i want to get the reivew but
coz if here i populate the tour i will get it inside the review then i get the tour */
  next();
})

const reviews = mongoose.model('review' , reviewsScheam);
module.exports = reviews;