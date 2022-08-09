const { errorType } = require('./constantsql');

const getErrorCode = (errorName) => {
  const a = errorType[errorName];
  console.log('a', a);
  return a;
};
module.exports = getErrorCode;
