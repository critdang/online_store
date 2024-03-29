const { PrismaClient } = require('@prisma/client');
const validateUser = require('../../validate/validateUser');
const helperFn = require('../../../utils/helperFn');
const { RESPONSE, ERROR } = require('../../../common/constants');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

require('dotenv').config();

exports.createOrder = async (parent, args, context, info) => {
  try {
    const { userId } = context.currentUser;
    const { cartId } = args.inputOrder;
    let { paymentMethod } = args.inputOrder;
    const foundCarts = await prisma.cart.findFirst({
      where: { userId, id: cartId },
      include: {
        cartProduct: {
          include: {
            product: true,
          },
        },
      },
    });
    if (!foundCarts) return Error('No cart found');
    const orders = [];
    const orderDetail = [];
    if (foundCarts.cartProduct) {
      let paymentDate;
      let statusPayment;

      if (paymentMethod === 'VISA') {
        paymentMethod = 'Visa';
        paymentDate = new Date();
        statusPayment = 'Completed';
      } else {
        paymentMethod = 'Cash';
        paymentDate = new Date();
        statusPayment = 'Pending';
      }

      const order = await prisma.order.create({
        data: {
          userId,
          status: statusPayment,
          paymentDate,
          paymentMethod: paymentMethod || 'Pending',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      const run = [];
      foundCarts.cartProduct.map(async (item) => {
        if (item.quantity > item.product.amount) {
          throw new Error(ERROR.EXCEED_QUANTITY);
        }

        // obj to create order
        const obj = {};
        obj.orderId = order.id;
        obj.quantity = item.quantity;
        obj.productId = item.product.id;
        obj.price = item.product.price;
        orders.push(obj);

        // d to send email
        const d = {};
        d.total = item.quantity * item.product.price;
        d.productName = item.product.name;
        d.paymentDate = paymentDate;
        d.paymentMethod = paymentMethod;
        d.quantity = item.quantity;
        d.productId = item.product.id;
        d.price = item.product.price;
        orderDetail.push(d);

        const checkProduct = await prisma.product.findFirst({ where: { id: item.product.id } });
        const amount = checkProduct.amount - item.quantity;
        const updateProductAmount = prisma.product.update({ where: { id: item.product.id }, data: { amount } });
        run.push(updateProductAmount);
        await prisma.$transaction(run);
      });

      // eslint-disable-next-line no-unused-vars
      const createProductInOrder = await prisma.productInOrder.createMany({
        data: orders,
      });
      // eslint-disable-next-line no-unused-vars
      const deleteCartProduct = await prisma.cartProduct.deleteMany({ where: { cartId } });

      await helperFn.createOrder(context.currentUser.email, orderDetail);
      return RESPONSE.ORDER_SUC;
    }
    return new Error(ERROR.NO_PRODUCT_IN_CART);
  } catch (err) {
    console.log(err);
  }
};

exports.listOrders = async (parent, args, context, info) => {
  const { userId } = context.currentUser;

  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      productInOrder: {
        include: {
          product: {
            include: {
              productImage: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const result = orders.map((order) => {
    const orderId = order.id;
    const orderDate = order.paymentDate;
    const totalAmount = order.productInOrder.reduce((total, currentValue) => total + (currentValue.quantity * currentValue.price), 0);
    const firstItem = order.productInOrder[0];
    const firstItemInfo = {
      id: firstItem.product.id,
      name: firstItem.product.name,
      thumbnail: firstItem.product.thumbnail,
      price: firstItem.product.price,
    };
    const output = {
      orderId,
      paymentDate: orderDate,
      firstItem: firstItemInfo,
      totalItem: order.productInOrder.length,
      totalAmount,
    };
    return output;
  });
  if (args.input === undefined) return result;

  let { date, amount } = args.input;
  if (date) date = date.toLowerCase();
  if (amount) amount = amount.toLowerCase();
  if (date && amount) {
    result.sort((productA, productB) => {
      let paymentDateA = helperFn.formatDay(productA.paymentDate);
      let paymentDateB = helperFn.formatDay(productB.paymentDate);
      paymentDateA = new Date(paymentDateA);
      paymentDateB = new Date(paymentDateB);
      const amountA = parseFloat(productA.totalAmount);
      const amountB = parseFloat(productB.totalAmount);
      const sortDate = date === 'desc' ? paymentDateB - paymentDateA : paymentDateA - paymentDateB;
      const sortAmount = amount === 'desc' ? amountB - amountA : amountA - amountB;
      return sortDate || sortAmount;
    });
    // eslint-disable-next-line no-param-reassign, array-callback-return
    result.map((order) => { order.paymentDate = helperFn.formatDay(order.paymentDate); });
  }
  if (date) {
    result.sort((productA, productB) => {
      const paymentDateA = new Date(productA.paymentDate);
      const paymentDateB = new Date(productB.paymentDate);
      const sortDate = date === 'desc' ? paymentDateB - paymentDateA : paymentDateA - paymentDateB;
      return sortDate;
    });
    // eslint-disable-next-line no-param-reassign, array-callback-return
    result.map((order) => { order.paymentDate = helperFn.formatDay(order.paymentDate); });
  }
  if (amount) {
    result.sort((productA, productB) => {
      const amountA = parseFloat(productA.totalAmount);
      const amountB = parseFloat(productB.totalAmount);
      const sortAmount = amount === 'desc' ? amountB - amountA : amountA - amountB;
      return sortAmount;
    });
    // eslint-disable-next-line no-param-reassign, array-callback-return
    result.map((order) => { order.paymentDate = helperFn.formatDay(order.paymentDate); });
  }

  return result;
};

exports.orderDetail = async (parent, args, context, info) => {
  const { id } = args.orderId;
  try {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        productInOrder: {
          include: {
            product: {
              include: {
                productImage: {
                  where: {
                    isDefault: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const orderDate = order.createdAt !== null ? helperFn.formatDay(order.createdAt) : null;
    const paymentDate = order.paymentDate !== null ? helperFn.formatDay(order.paymentDate) : null;
    const product = order.productInOrder.map((item) => ({
      totalAmount: item.quantity * item.price,
      name: item.product.name,
      thumbnail: item.product.productImage[0].href,
      price: item.price,
      quantity: item.quantity,
    }));

    const result = {
      paymentDate,
      orderDate,
      product,
      totalAmount: order.productInOrder.length,
    };
    return result;
  } catch (err) {
    console.log(err);
  }
};

exports.changeOrderStatus = async (parent, args, context, info) => {
  const { orderId, status } = args;
  let { paymentMethod } = args;
  if (paymentMethod === 'CASH') paymentMethod = 'Cash';
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        paymentMethod: 'Pending',
        status: 'Pending',
      },
    });
    if (!order) {
      return new Error(ERROR.ORDER_NOT_FOUND);
    }
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentMethod,
        status,
        paymentDate: validateUser.formatDay(new Date()),
      },
    });
  } catch (err) {
    console.log(err);
  }
};
