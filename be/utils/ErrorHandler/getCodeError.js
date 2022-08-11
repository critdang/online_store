const { errorType } = require('./constantsql');

const getErrorCode = (errorName) => {
  const a = errorType[errorName];
  return a;
};
module.exports = getErrorCode;
