const { PrismaClient } = require('@prisma/client');
const { ERROR } = require('../../common/constants');
const helperFn = require('../../utils/helperFn');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const getUsers = async (req, res) => {
  const users = await prisma.user.findMany();
  return users;
};

const getUser = async (req, res) => {
  const idUser = +req.params.id;

  const data = await prisma.user.findUnique({
    where: { id: idUser },
  });
  return data;
};

const deleteUser = async (req, res) => {
  const idUser = +req.params.id;

  const data = await prisma.user.deleteMany({
    where: { id: idUser },
  });
  return data;
};

const changeBlockUserStt = async (req, res) => {
  const idUser = +req.params.id;
  try {
    const existStatus = await prisma.user.findFirst({
      where: { id: idUser },
    });
    if (!existStatus) return helperFn.returnFail(req, res, ERROR.NO_FOUND_USER);

    const updateBlockUser = await prisma.user.update({
      where: { id: idUser },
      data: { isBlocked: !existStatus.isBlocked },
    });
    return updateBlockUser;
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getUsers,
  getUser,
  deleteUser,
  changeBlockUserStt,
};
