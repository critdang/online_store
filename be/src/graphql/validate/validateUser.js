const Joi = require('joi');

const createUserSchema = Joi.object({
  email: Joi.string()
    .email()
    .required(),
  // .messages(
  //   { 'any.required': 'invalid email. required com or net' },
  // ),

  fullname: Joi.string()
    .required(),
  // .messages({ 'any.required': 'Provided fullname' }),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{6,30}$/)
    .required(),
  // .messages(
  //   { 'any.required': 'invalid password , must contain at least 6 characters' },
  // ),
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
  // .error(() => new Error('Format email is not correct. Please try again')),
  password: Joi.string()
    .required(),
  // .error(() => new Error('Format password is not correct. Please try again')),
});

exports.createUserValidate = (args) => {
  const error = createUserSchema.validate(args);
  if (error) return error;
};
exports.loginUserSchema = async (args) => {
  const { error } = loginUserSchema.validate(args);
  if (error) return error;
};
