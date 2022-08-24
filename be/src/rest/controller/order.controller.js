const orderService = require('../services/order.service');
const helperFn = require('../../utils/helperFn');
const { RESPONSE } = require('../../common/constants');

const getOrders = async (req, res, next) => {
  try {
    const orders = await orderService.getOrders(req, res);
    helperFn.returnSuccess(req, res, orders);
  } catch (err) {
    console.log(err);
  }
};

const getOrder = async (req, res, next) => {
  try {
    const order = await orderService.getOrder(req, res);
    helperFn.returnSuccess(req, res, order);
  } catch (err) {
    console.log(err);
  }
};

const changeStatus = async (req, res, next) => {
  try {
    await orderService.changeStatus(req, res);
    helperFn.returnSuccess(req, res, RESPONSE.CHANGE_STATUS_SUCC);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getOrders,
  getOrder,
  changeStatus,
};
