const constants = {
  PROVIDE : 'Please provide email and password!',
  //create_notify
  FILL_OUT : 'Fill out completely',
  EXIST_ACCOUNT : 'Account has already been created',
  PROVIDE_EMAIL : 'Please provide your email',

  // verify email
  SUCCESS_EMAIL : 'Verify your email',
  SUCCESS_EMAIL_DES : 'please click the link below to verify your email',
  SUCCESS_EMAIL_ENDPOINT : '/user/verify/',

  //Login notify
  PROVIDE : 'Please provide email and password!',
  EMAIL_NOT_CORRECT : 'your email is not correct',
  DISABLED : 'your account has been disabled or not active yet , please contact admin',
  PASS_NOT_CORRECT : 'your password is not correct',

  //verify email
  EMAIL_NOT_AVA : 'this email not available',
  TOKEN_EXPIRED : 'Your token has expired',
  SUCCESS_VERIFY : 'success. Your email has been actived',
  
  // Update Password
  CHECK_PASS : 'please try the right old password',

  //REGIS class
  REGIS_EXISTS : 'Your registration has been already existed ',
  CLASS_FULL : 'Class is full. Please try again later',

  //Find registration
  NO_REGIS : 'does not have registration',
  
  //CLASS
  NO_CLASS : 'this class does not exist',

  //ADMIN
  //Create Class
  EXIST_CLASS : 'Existed class in DB',
  NO_CLASS_FOUND : 'No class found ',
  NO_DELETE : 'Class have student , can not delete',
  CLASS_CLOSE : 'the class is close, can not accept at this time',

  //EMAIL
  CONGRA : 'Congratulation',
  CONGRA_MSG : 'Congratulation , your registered class has been accepted',
  CANCEL : 'Cancel Class',
  CANCEL_MSG : 'Your registered class has been cancel because you doesn not meet the class requirements.Try again later.'
}   

module.exports = constants