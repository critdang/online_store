const authService = require('../services/auth.service');
const helperFn = require('../../utils/helperFn');
const { ERROR, RESPONSE } = require('../../common/constants');

const login = async (req, res, next) => {
  try {
    await authService.login(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.LOGIN_SUCCESS);
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};

const uploadAdminAvatar = async (req, res) => {
  try {
    if (!req.file.path) return helperFn.returnFail(req, res, ERROR.PROVIDE_ADMIN_AVA);

    await authService.uploadAdminAvatar(req, res);
    return helperFn.returnSuccess(req, res, RESPONSE.AVA_SUC);
  } catch (err) {
    console.log(err);
    helperFn.returnError(res, err.message);
  }
};

module.exports = {
  login,
  uploadAdminAvatar,
};
