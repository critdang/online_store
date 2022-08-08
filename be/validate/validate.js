const Joi = require('joi');
const moment = require('moment');
const AppError = require('../utils/ErrorHandler/appError');
const constants = require('../constants');

const resetPasswordSchema = Joi.object({
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com', 'net'] },
    })
    .required()
    .error(
      new AppError('invalid email. required @com or @net', 400),
    ),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .error(
      new AppError('invalid password , must contain at least 6 characters', 400),
    ),
});

const createCategory = Joi.object({
  name: Joi.string()
    .required()
    .error(
      new AppError('Please provide category name', 400),
    ),
  description: Joi.string()
    .required()
    .error(
      new AppError('Please provide category description', 400),
    ),
});

const createUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .error(
      new AppError('invalid email. required com or net', 400),
    ),

  fullname: Joi.string(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .error(
      new AppError('invalid password , must contain at least 6 characters', 400),
    ),
  address: [Joi.string().empty()],
  phone: [Joi.string(), Joi.number().empty()],
  gender: [Joi.string().valid('Male', 'Female')],

});

const avatarSchema = Joi.object({
  avatar: Joi.required()
    .error(
      new AppError(constants.PROVIDE_AVA, 400),
    ),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .error(
      new AppError(constants.EMAIL_PROVIDE, 400),
    ),
  password: Joi.string()
    .required()
    .error(
      new AppError(constants.PASSWORD_PROVIDE, 400),
    ),
});

const categorySchema = Joi.object({
  name: Joi.string()
    .required()
    .error(
      new AppError(constants.PROVIDE_CATE_NAME, 400),
    ),
  description: Joi.string()
    .required()
    .error(
      new AppError(constants.PROVIDE_CATE_DESCRIPTION, 400),
    ),
});

const productSchema = Joi.object({
  name: Joi.string()
    .required()
    .error(
      new AppError(constants.PROVIDE_PRODUCT_NAME, 400),
    ),
  description: Joi.string(),
  price: Joi.number()
    .required()
    .error(
      new AppError(constants.PROVIDE_PRODUCT_PRICE, 400),
    ),
  amount: Joi.number()
    .required()
    .error(
      new AppError(constants.PROVIDE_PRODUCT_AMOUNT, 400),
    ),
  categoryId: Joi.number(),
});

exports.resetPasswordValidate = async (req, res, next) => {
  try {
    await resetPasswordSchema.validateAsync(req.body);
    next();
  } catch (err) {
    console.log(err);
  }
};
exports.createUserValidate = async (req, res, next) => {
  try {
    await createUserSchema.validate(req.body);
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.formatDay = (day) => moment(day, 'YYYY MM DD').utc(true).toDate();

exports.createCategory = async (args) => {
  try {
    await createCategory.validateAsync(args);
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.loginValidate = async (req, res, next) => {
  try {
    await loginSchema.validateAsync(req.body);
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.avatarValidate = async (req, res, next) => {
  try {
    await avatarSchema.validateAsync(req.body);
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.categoryValidate = async (req, res, next) => {
  try {
    await categorySchema.validateAsync(req.body);
    next();
  } catch (err) {
    console.log(err);
  }
};

exports.productValidate = async (req, res, next) => {
  try {
    await productSchema.validateAsync(req.body);
    next();
  } catch (err) {
    console.log(err);
  }
};
