const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const jwt = require('jsonwebtoken');
const AppError = require('../utils/ErrorHandler/appError');
const helperFn = require('../../utils/helperFn');
const constants = require('../../constants');
const { uploadImg } = require('../../utils/uploadImg');

const createUser = async (req, res, next) => {
  try {
    const {
      email, fullname, password, address, avatar, phone, gender,
    } = req.body;
    if (!email || !fullname || !password || !address || !phone || !gender) {
      return next(new AppError(constants.FILL_OUT, 400));
    }
    const existUser = await prisma.user.findFirst({
      where: { email },
    });
    if (existUser.is_active == true) {
      return next(new AppError(constants.EXIST_ACCOUNT, 400));
    }
    if (existUser.is_active == false) {
      return next(new AppError('The account have been created but not active yet', 400));
    }
    const hashPass = (await helperFn.hashPassword(password)).toString();
    const uploadedAvatar = await uploadImg(req.file.path);
    if (!uploadedAvatar) return helperFn.returnFail(req, res, 'upload avatar failed');
    await prisma.user.create({
      data: {
        email,
        fullname,
        password: hashPass,
        address,
        avatar: uploadedAvatar,
        phone,
        gender,
      },
    });
    const token = helperFn.generateToken({ email }, '15m');
    helperFn.sendMail(
      email,
      constants.SUCCESS_EMAIL,
      constants.SUCCESS_EMAIL_DES,
      constants.SUCCESS_EMAIL_ENDPOINT,
      token,
    );
    helperFn.returnSuccess(req, res, 'check your mail to verify account');
  } catch (err) {
    console.log(err);
  }
};
const changeAvatar = async (req, res, next) => {
  const { id } = req.user;
  const changedAvatar = await uploadImg(req.file.path);
  if (!changedAvatar) return helperFn.returnFail(req, res, 'upload avatar failed');
  await prisma.user.updateMany({
    where: { id },
    data: { avatar: changedAvatar },
  });
  helperFn.returnSuccess(req, res, 'Change avatar successfully');
};

const verifyUser = async (req, res, next) => {
  const { token } = req.params;
  try {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    const updateUser = await prisma.user.update({
      where: { email: decodedToken.email },
      data: { is_active: true },
    });
    if (!updateUser) {
      return next(new AppError(constants.EMAIL_NOT_AVA, 401));
    }
    helperFn.returnSuccess(req, res, constants.SUCCESS_VERIFY);
  } catch (err) {
    console.log(err);
  }
};

const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const result = await prisma.user.findFirst({ where: { email, is_active: true } });
    if (!result) return helperFn.returnFail(req, res, 'User not found or not active yet');
    const token = helperFn.generateToken({ email }, '15m');
    await prisma.user.updateMany({
      where: {
        email,
        is_active: true,
      },
      data: { resetToken: token },
    });
    await helperFn.forgotPassword(email, token);
    helperFn.returnSuccess(req, res, 'An email sent to you, please check the mail to reset password');
  } catch (err) {
    console.log(err);
  }
};

const verifyResetPassword = async (req, res, next) => {
  const { email, token } = req.params;
  helperFn.verifyToken(token);
  const user = prisma.user.findFirst({
    where: { email, resetToken: token },
  });
  if (!user) { res.send('<h1>This email is expired. Please use the latest email</h1>'); }
  // helperFn.returnSuccess(req, res, { email, token });
  res.render('auth/forgotPassword', { email, token });
};

const resetPassword = async (req, res, next) => {
  const { password, email } = req.body;
  const hashPass = await helperFn.hashPassword(password);
  try {
    await prisma.user.updateMany({
      where: { email },
      data: {
        password: hashPass,
        resetToken: null,
      },
    });
    helperFn.returnSuccess(req, res, 'reset password successfully');
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createUser,
  verifyUser,
  forgotPassword,
  verifyResetPassword,
  resetPassword,
  changeAvatar,
};
