const _ = require('lodash');

const userResolvers = require('./users');
// const productResolvers = require('./products');
module.exports = _.merge({},
 userResolvers
);