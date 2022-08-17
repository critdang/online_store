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
    // include: {
    //   user: {
    //     select: {
    //       id: true,
    //       fullname: true,
    //       address: true,
    //       phone: true,
    //     },
    //   },
    //   productInOrder: {
    //     select: {
    //       quantity: true,
    //       total: true,
    //       price: true,
    //       product: {
    //         select: {
    //           description: true,
    //           price: true,
    //           name: true,
    //         },
    //       },
    //     },
    //   },
    // },
  });
  return orders;
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
