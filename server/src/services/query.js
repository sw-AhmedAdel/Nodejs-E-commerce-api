const DEFAULT_PAGE_NUMBER = 1;
const DEFAULT_PAGE_LIMIT = 0;

function getPagination(query) {
  const page = Math.abs(query.page) || DEFAULT_PAGE_NUMBER;
  const limit = Math.abs(query.limit) || DEFAULT_PAGE_LIMIT;
  const skip = (page - 1) * limit; 
 
  return {
    skip,
    limit,
  };
}

class filterFun  {
  constructor(query , filter) {
    this.query = query;
    this.filter =filter;
  }

  // ?rating[gte]=4&price[gte]=100
  filterFun(){
    let modifyFilter = JSON.stringify(this.filter);
    modifyFilter = modifyFilter.replace(/\b(gte|gt|lt|lte)\b/g , match => `$${match}`) ;
    return  JSON.parse(modifyFilter);
  }

  //?sortBy=-price,rating
  //use xss-clean to prevent user to use dub filed coz if he used 2 price like price=,price=
  //express will take these dub and put them in array so can not use eplit on arr so this is a problem
  sortBy() {
    if(this.query.sortBy) {
      return this.query.sortBy.split(',').join(' ')
    }else {
      return 'createdAt'
    }
  }

  //?fields=name,price
  fieldsFilter() {
    if(this.query.fields) {
      return this.query.fields.split(',').join(' ');
    }
    
  }
}


 function checkPermissions (requestUser , resouceUserID) {
    if(requestUser.role ==='admin') return  true;
   else if(requestUser._id.toString()  === resouceUserID.toString()) return true;
   else 
    return false;
    
}

const catchAsync = fn => {
  return (req , res , next) => {
    fn(req , res , next).catch(next);
  }
}


module.exports = {
  getPagination,
  filterFun,
  catchAsync,
  checkPermissions
}