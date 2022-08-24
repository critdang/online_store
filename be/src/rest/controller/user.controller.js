const helperFn = require('../../utils/helperFn');
const { ERROR, RESPONSE } = require('../../common/constants');
const userService = require('../services/user.service');

const getUsers = async (req, res, next) => {
  try {
    const data = await userService.getUser();
    return helperFn.returnSuccess(req, res, data);
  } catch (err) {
    console.log(err);
    return helperFn.returnError(res, err.message);
  }
};

const getUser = async (req, res, next) => {
  const idUser = +req.params.id;
  if (!idUser) return helperFn.returnFail(req, res, ERROR.PROVIDE_ID);
  try {
    const data = await userService.getUser(req, res);
    if (data == null) return helperFn.returnFail(req, res, ERROR.NO_FOUND_USER);
    return helperFn.returnSuccess(req, res, data);
  } catch (err) {
    console.log(err);
    return helperFn.returnError(res, err.message);
  }
};

const deleteUser = async (req, res) => {
  const idUser = +req.params.id;
  if (!idUser) return helperFn.returnFail(req, res, ERROR.PROVIDE_ID);

  try {
    const data = await userService.deleteUser(req, res);
    if (!data) return helperFn.returnFail(ERROR.DELETE_FAIL);
    return helperFn.returnSuccess(req, res, ERROR.DELETE_USER_SUC);
  } catch (err) {
    console.log(err);
    return helperFn.returnError(res, err.message);
  }
};

const changeBlockUserStt = async (req, res) => {
  const idUser = +req.params.id;
  if (!idUser) return helperFn.returnFail(req, res, ERROR.PROVIDE_ID);
  try {
    await userService.changeBlockUserStt(req, res);
    return helperFn.returnSuccess(req, res, RESPONSE.BLOCK_SUC);
  } catch (err) {
    console.log(err);
    return helperFn.returnError(res, err.message);
  }
};

module.exports = {
  getUsers,
  getUser,
  deleteUser,
  changeBlockUserStt,
};
