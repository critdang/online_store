const { errorType } = require('./errorName');

const getErrorCode = (errorName) => {
  const a = errorType[errorName];
  return a;
};
module.exports = getErrorCode;
