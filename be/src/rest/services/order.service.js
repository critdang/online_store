const { PrismaClient } = require('@prisma/client');
const { ERROR } = require('../../common/constants');
const helperFn = require('../../utils/helperFn');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const getOrders = async (req, res, next) => {
  const orders = await prisma.order.findMany({});
  if (!orders) return helperFn.returnFail(req, res, ERROR.NO_ORDER_FOUND);
  return orders;
};

const getOrder = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_ORDER_ID);

  const order = await prisma.order.findUnique({
    where: { id },
  });
  if (!order) return helperFn.returnFail(req, res, ERROR.NO_ORDER_FOUND);
  return order;
};

const changeStatus = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_ORDER_ID);

  const { newStatus } = req.body;
  if (!newStatus) return helperFn.returnFail(req, res, ERROR.PROVIDE_ORDER_STATUS);
  try {
    const order = await prisma.order.updateMany({
      where: {
        id,
        paymentMethod: 'Cash',
        status: 'Pending',
      },
      data: {
        status: newStatus,
      },
    });
    if (order.count === 0) return helperFn.returnFail(req, res, ERROR.NO_ORDER_FOUND);
  } catch (err) {
    console.log(err);
  }
};
module.exports = {
  getOrders,
  getOrder,
  changeStatus,
};
