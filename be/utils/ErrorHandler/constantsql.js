exports.errorName = {
  USER_NOT_FOUND: 'USER_NOT_FOUND',
  WRONG_PASS: 'WRONG_PASS',
  WRONG_CURRENT_PASS: 'WRONG_CURRENT_PASS',
  SERVER_ERROR: 'SERVER_ERROR',
};

exports.errorType = {
  USER_NOT_FOUND: {
    message: 'User not found or not active yet',
    statusCode: 400,
  },
  WRONG_PASS: {
    message: 'Password is incorrect',
    statusCode: 400,
  },
  WRONG_CURRENT_PASS: {
    message: 'Wrong current password',
    statusCode: 400,
  },
  SERVER_ERROR: {
    message: 'Server error.',
    statusCode: 500,
  },
};
