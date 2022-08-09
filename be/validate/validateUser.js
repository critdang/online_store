const Joi = require('joi');
const moment = require('moment');

const createUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages(
      { 'any.required': 'invalid email. required com or net' },
    ),

  fullname: Joi.string()
    .required()
    .messages({ 'any.required': 'Provided fullname' }),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required()
    .messages(
      { 'any.required': 'invalid password , must contain at least 6 characters' },
    ),
  address: [Joi.string().empty()],
  phone: [Joi.string(), Joi.number().empty()],
  gender: [Joi.string().valid('Male', 'Female')],

});
const loginUserSchema = Joi.object({
  email: Joi.string()
    .required()
    .email()
    .messages({
      'any.required': 'Provided email address',
    }),
  password: Joi.string()
    .required()
    .messages({
      'any.required': 'Provided password',
    }),
});
exports.formatDay = (day) => moment(day, 'YYYY MM DD').utc(true).toDate();

exports.createUserValidate = (args) => {
  const { error } = createUserSchema.validate(args);
  if (error) return { error };
  return true;
};
exports.loginUserSchema = (args) => {
  const { error } = loginUserSchema.validate(args);
  if (error) return { error };
  return true;
};
