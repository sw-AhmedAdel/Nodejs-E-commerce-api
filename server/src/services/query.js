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

module.exports = {
  getPagination,
  filterFun
}