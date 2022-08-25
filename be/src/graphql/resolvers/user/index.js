const { UserInputError } = require('apollo-server-express');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const validateUser = require('../../validate/validateUser');
const helperFn = require('../../../utils/helperFn');
const { uploadImageFunc } = require('../fileUpload');
const { MESSAGE, RESPONSE, ERROR } = require('../../../common/constants');

require('dotenv').config();

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
exports.createUser = async (parent, args, context, info) => {
  const {
    email, password, fullname, phone, address,
  } = args.inputSignup;
  const { error } = validateUser.createUserValidate(args.inputSignup);
  if (error) {
    throw new UserInputError('Fail to create a character', { validationError: error.message });
  }
  const existUser = await prisma.user.findFirst({
    where: { email },
  });
  if (existUser) {
    if (existUser.isActive === true) {
      return new Error(ERROR.EXIST_ACCOUNT);
    }
    if (existUser.isActive === false) {
      return new Error(ERROR.NOT_ACTIVE_ACCOUNT);
    }
  }
  const hashPw = await bcrypt.hash(password, 12);
  const user = await prisma.user.create({
    data: {
      email,
      password: hashPw,
      fullname,
      phone,
      address,
    },
  });
  const token = helperFn.generateToken({ email: user.email }, '15m');

  helperFn.sendMail(
    email,
    MESSAGE.SUCCESS_EMAIL,
    MESSAGE.SUCCESS_EMAIL_DES,
    MESSAGE.SUCCESS_EMAIL_ENDPOINT,
    token,
  );
  return RESPONSE.CREATE_USER_SUCCESS;
};

exports.verify = async (parent, args, context, info) => {
  const { token } = args.inputToken;
  const decodedUser = helperFn.verifyToken(token);
  const foundUser = await prisma.user.findFirst({ where: { email: decodedUser.email } });

  if (!foundUser) return new Error(ERROR.NO_FOUND_USER);

  const updateUser = await prisma.user.updateMany({
    where: { email: decodedUser.email },
    data: { isActive: true },
  });
  if (!updateUser) {
    return new Error(ERROR.EMAIL_NOT_AVA);
  }
  return RESPONSE.VERIFY_SUCCESS;
};

exports.login = async (parent, args, context, info) => {
  let FoundUser = null;
  const { email, password } = args.inputLogin;
  const { error } = validateUser.loginUserSchema(args.inputLogin);
  if (error) {
    return new UserInputError('Fail to create a character', { validationError: error.message });
  }
  try {
    FoundUser = await prisma.user.findFirst({
      where: { email, isActive: true },
    });
    if (!FoundUser) {
      return new Error(ERROR.USER_NOT_FOUND);
    }

    const isEqual = await helperFn.comparePassword(password, FoundUser.password);
    if (!isEqual) {
      return new Error(ERROR.WRONG_PASS);
    }
    const token = helperFn.generateToken({
      userId: FoundUser.id,
      email: FoundUser.email,
    }, '1h');
    return { token, userId: FoundUser.id };
  } catch (err) {
    console.log(err);
  }
};

exports.changePassword = async (parent, args, context, info) => {
  try {
    if (!args.inputPassword) {
      return new Error(ERROR.PROVIDE_PASS);
    }

    const foundUser = await prisma.user.findUnique({ where: { id: context.currentUser.userId } });
    const isEqual = await helperFn.comparePassword(args.inputPassword.oldPassword, foundUser.password);
    if (!isEqual) {
      return new Error(ERROR.WRONG_CURRENT_PASS);
    }

    const hashPass = await helperFn.hashPassword(args.inputPassword.newPassword);
    await prisma.user.update({
      where: { id: context.currentUser.userId },
      data: {
        password: hashPass,
      },
    });
    return foundUser;
  } catch (err) {
    throw new Error(err);
  }
};

exports.requestReset = async (parent, args, context, info) => {
  let { email } = args.inputRequest;
  email = email.toLowerCase();

  // Check that user exists.
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) throw new Error(ERROR.NO_FOUND_USER);

  // const resetToken = helperFn.generateToken({ email }, '15m');
  const resetToken = jwt.sign({ email }, 'taskkhoqua');

  // const resultToken = `Bearer ${resetToken}`;
  // console.log(resultToken);
  // const decodedToken = helperFn.verifyToken(resetToken);
  // console.log('decoded token', decodedToken);

  const data = await prisma.user.update(
    {
      where: { email },
      data: { resetToken },
    },
  );
  if (!data) throw new Error(ERROR.REQUEST_RESET_FAIL);
  await helperFn.forgotPassword(email, resetToken);
  return resetToken;
};

exports.resetPassword = async (parent, args, context, info) => {
  try {
    const { token, password, confirmPassword } = args.inputReset;

    // check token
    const decodedToken = jwt.verify(args.inputReset.token, 'taskkhoqua');
    const user = prisma.user.findFirst({
      where: { email: decodedToken.token, resetToken: token },
    });
    if (!user) {
      throw new Error(
        ERROR.RESET_PASSWORD_TOKEN_EXPIRED,
      );
    }
    // check if passwords match
    if (password !== confirmPassword) {
      throw new Error(ERROR.PASSWORD_NOT_MATCH);
    }
    const hashPass = await helperFn.hashPassword(password);
    await prisma.user.updateMany({
      where: { email: decodedToken.token },
      data: {
        password: hashPass,
        resetToken: null,
      },
    });
    return RESPONSE.PASSWORD_UPDATE_SUCCESS;
  } catch (err) {
    console.log(err);
  }
};

exports.editProfile = async (parent, args, context, info) => {
  try {
    const convertBirthday = new Date(args.inputProfile.birthday);

    const editProfile = await prisma.user.update({
      where: { id: context.currentUser.userId },
      data: {
        email: args.inputProfile.email,
        fullname: args.inputProfile.fullname,
        address: args.inputProfile.address,
        phone: args.inputProfile.phone,
        gender: args.inputProfile.gender,
        birthday: convertBirthday,
      },
    });
    return editProfile;
  } catch (err) {
    console.log(err);
  }
};

exports.uploadAvatar = async (parent, args, context, info) => {
  try {
    const avatar = await uploadImageFunc(args.file);
    if (!avatar) throw new Error(ERROR.UPLOAD_AVATAR_FAIL);
    const data = await prisma.user.update({
      where: { id: context.currentUser.userId },
      data: { avatar },
    });
    if (!data) return new Error(ERROR.UPDATE_AVATAR_FAIL);
    return avatar;
  } catch (err) {
    console.log(err);
  }
};

exports.getUser = async (parent, args, context, info) => {
  try {
    const result = await prisma.user.findUnique({
      where: { id: context.currentUser.userId },
    });
    return result;
  } catch (err) {
    console.log(err);
  }
};
