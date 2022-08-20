const { PrismaClient } = require('@prisma/client');
const validateUser = require('../../../../../validate/validateUser');
const helperFn = require('../../../../../utils/helperFn');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
require('dotenv').config();

exports.createOrder = async (parent, args, context, info) => {
  try {
    const { userId } = context.currentUser;
    const { cartId } = args;
    let { paymentMethod } = args;
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

    const orders = [];
    if (foundCarts.cartProduct) {
      let paymentDate;
      let statusPayment = 'Pending';

      if (paymentMethod === 'VISA') {
        paymentMethod = 'Visa';
        paymentDate = validateUser.formatDay(new Date());
        statusPayment = 'Completed';
      }
      const order = await prisma.order.create({
        data: {
          userId,
          status: statusPayment,
          paymentDate,
          paymentMethod: paymentMethod || 'Pending',
          createdAt: validateUser.formatDay(new Date()),
          updatedAt: validateUser.formatDay(new Date()),
        },
      });

      const run = [];
      // const promises = [];
      // load foundCarts
      foundCarts.cartProduct.map(async (item) => {
        if (item.quantity > item.product.amount) {
          throw new Error('Exceed quantity limit');
        }

        const obj = {};
        obj.orderId = order.id;
        obj.quantity = item.quantity;
        obj.total = item.quantity * item.product.price;
        obj.productId = item.product.id;
        obj.productName = item.product.name;
        obj.paymentDate = paymentDate;
        obj.paymentMethod = paymentMethod;
        obj.price = item.product.price;
        orders.push(obj);

        const checkProduct = await prisma.product.findFirst({ where: { id: item.product.id } });

        const amount = checkProduct.amount - item.quantity;

        const updateProductAmount = prisma.product.update({ where: { id: item.product.id }, data: { amount } });
        run.push(updateProductAmount);

        const createProductInOrder = prisma.productInOrder.create({
          data: {
            orderId: obj.orderId,
            quantity: obj.quantity,
            productId: obj.productId,
            price: obj.price,
          },
        });
        run.push(createProductInOrder);

        const deleteCartProduct = prisma.cartProduct.deleteMany({ where: { productId: obj.productId } });
        run.push(deleteCartProduct);

        await prisma.$transaction(run);

        // const p = new Promise((resolve, reject) => {
        //  obj['orderId'] = order.id;
        //  obj['quantity'] =  item.quantity;
        //  obj['total'] = item.quantity * item.product.price;
        //  obj['productId'] = item.product.id;
        //  obj['productName'] = item.product.name;
        //  obj['paymentDate'] = paymentDate;
        //  obj['payment'] = payment;
        //  obj['price'] = item.product.price;

      // orders.push(obj);
      // const updateProductAmount = prisma.product.findFirst({  where: {id: item.product.id}  })
      //   .then(result =>
      //     prisma.product.update({  where: {id: item.product.id}, data: {amount: result.amount - item.quantity}}
      //     ))
      //   .catch(err => reject(err));
      // run = [updateProductAmount];
      // const createProductInOrder = prisma.productInOrder.create({data: {
      //   orderId: obj.orderId,
      //   quantity: obj.quantity,
      //   productId: obj.productId,
      //   price: obj.price,
      // }})
        // .then(() => {const deleteCartProduct =  prisma.cartProduct.deleteMany({
        //       where: {productId:obj.productId}
        //     })
        //     // run = [deleteCartProduct]
        //   },
        // )
        // .then(() => resolve("already deleted cart product"))
        // .catch(err => reject(err));
        // run = [updateProductAmount];
      // });
      // promises.push(p);
      });
      //  await Promise.all(promises);
      await helperFn.createOrder(context.currentUser.email, orders);
      return orders;
    }
    return new Error('No product in cart');
  } catch (err) {
    return err;
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
    const orderDate = helperFn.formatDay(order.paymentDate);
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

  let { sortDate, sortAmount } = args.input;
  if (sortDate) sortDate = sortDate.toLowerCase();
  if (sortAmount) sortAmount = sortAmount.toLowerCase();
  if (sortDate && sortAmount) {
    return result.sort((productA, productB) => {
      let paymentDateA = helperFn.formatDay(productA.paymentDate);
      let paymentDateB = helperFn.formatDay(productB.paymentDate);
      paymentDateA = new Date(paymentDateA);
      paymentDateB = new Date(paymentDateB);
      // const completedDateB = new Date(productB.completedDate);
      const amountA = parseFloat(productA.totalAmount);
      const amountB = parseFloat(productB.totalAmount);
      const date = sortDate === 'desc' ? paymentDateB - paymentDateA : paymentDateA - paymentDateB;
      const amount = sortAmount === 'desc' ? amountB - amountA : amountA - amountB;
      return date || amount;
    });
  }
  if (sortDate) {
    return result.sort((productA, productB) => {
      const paymentDateA = helperFn.formatDay(productA.paymentDate);
      const paymentDateB = helperFn.formatDay(productB.paymentDate);
      const date = sortDate === 'desc' ? paymentDateB - paymentDateA : paymentDateA - paymentDateB;
      return date;
    });
  }
  if (sortAmount) {
    return result.sort((productA, productB) => {
      const amountA = parseFloat(productA.totalAmount);
      const amountB = parseFloat(productB.totalAmount);
      const amount = sortAmount === 'desc' ? amountB - amountA : amountA - amountB;
      return amount;
    });
  }
  return result;
};

exports.orderDetail = async (parent, args, context, info) => {
  console.log(args);
  const { id } = args.orderId;

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
      return new Error('Order not found');
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
    return new Error(err);
  }
};
