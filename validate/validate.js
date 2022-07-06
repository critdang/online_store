const { empty } = require('@prisma/client/runtime');
const Joi = require('joi');
const moment = require('moment');
const AppError = require('../rest/utils/ErrorHandler/appError');

const resetPasswordSchema = Joi.object({
  email: Joi.string()
  .email({
    minDomainSegments: 2,
        tlds: { allow: ['com', 'net'] },
  })
  .required()
  .error(
    new AppError('invalid email. required @com or @net', 400)
  ),
  password: Joi.string()
  .regex(/^[a-zA-Z0-9]{6,30}$/)
  .required()
  .error(
      new AppError('invalid password , must contain at least 6 characters', 400)
  ),
})

const createCategory = Joi.object({
  name: Joi.string(),
  description: Joi.string(),
})

const createUserSchema = Joi.object({
  email: Joi.string()
  .email()
  .required()
  .error(
    new AppError('invalid email. required com or net', 400)
  ),
   
  fullname: Joi.string(),
  password: Joi.string()
  .regex(/^[a-zA-Z0-9]{6,30}$/)
  .required()
  .error(
      new AppError('invalid password , must contain at least 6 characters', 400)
  ),
  address: [Joi.string().empty()],
  phone: [Joi.string(),Joi.number().empty()],
  gender: [Joi.string().valid('Male', 'Female')]

})
exports.resetPasswordValidate = async(req, res, next) => {
  try{
    await resetPasswordSchema.validateAsync(req.body);
    next();
  }catch(err) {
    console.log(err)
  }
}
exports.createUserValidate = (req, res, next) => {
 
    const {error,value}= createUserSchema.validate(req.body);
    if(error){
      return console.log(error);
    }
    next();
  
}

exports.formatDay = (day) => {
  return moment(day,'YYYY MM DD').utc(true).toDate();
}

exports.createCategory = async(args) => {
  try{
    await createCategory.validateAsync(args);
    next();
  }catch(err) {
    console.log(err)
  } 
}