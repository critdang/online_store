const { PrismaClient } = require('@prisma/client');
const AppError = require('../../utils/ErrorHandler/appError');
const constants = require('../../common/constants');
const helperFn = require('../../utils/helperFn');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const login = async (req, res, data) => {
  const { email: inputEmail, password: inputPassword } = req.body;

  const admin = await prisma.admin.findFirst({
    where: { email: inputEmail },
  });
  if (!admin) {
    return new AppError(constants.EMAIL_NOT_CORRECT, 400);
  }

  const { password } = admin;
  const wrongPassword = await helperFn.comparePassword(
    inputPassword,
    password,
  );
  if (!wrongPassword) {
    return new AppError(constants.PASS_NOT_CORRECT, 400);
  }
};

const uploadAdminAvatar = async (req, res, next) => {
  const { id } = req.user;

  const avatar = await req.file.path;

  await prisma.admin.update({
    where: { id },
    data: {
      avatar,
    },
  });
};

module.exports = {
  login,
  uploadAdminAvatar,
};
