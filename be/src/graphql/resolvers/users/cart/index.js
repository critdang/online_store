const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
require('dotenv').config();

exports.addToCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { quantity, productId } = args;
  try {
    const checkProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!checkProduct) {
      throw new Error('Product not found');
    }

    if (quantity > checkProduct.amount) {
      throw new Error('Product quantity exceed');
    }

    const cartItem = await prisma.cart.findFirst({ where: { userId }, include: { cartProduct: true } });
    const productInCart = await prisma.cartProduct.findFirst({ where: { productId, cartId: cartItem.id } });

    let run = [];
    if (!cartItem) {
      const createCartItem = prisma.cart.createMany({ data: { userId } });
      run = [createCartItem];
    }
    if (productInCart) {
      const updateCartItem = prisma.cartProduct.updateMany({
        where: { productId, cartId: cartItem.id },
        data: { quantity },
      });
      run = [updateCartItem];
    } else {
      const createCartProduct = prisma.cartProduct.createMany({ data: { cartId: cartItem.id, productId, quantity } });
      run = [createCartProduct];
    }
    await prisma.$transaction([...run]);
    return run;
  } catch (err) {
    throw new Error(err);
  }
};

exports.cartProduct = async (parent, args, context, info) => {
  try {
    const data = await prisma.cartProduct.findMany({});
    return data;
  } catch (err) {
    throw new Error(err);
  }
};

exports.getCart = async (parent, args, context, info) => {
  const cartItems = await prisma.cart.findFirst({
    where: { userId: context.currentUser.userId },
    include: {
      cartProduct: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              description: true,
              productImage: true,
              categoryProduct: true,
            },
          },
        },
      },
    },
  });
  return cartItems;
};

exports.deleteItemCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { productId } = args;

  const findCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  await prisma.cartProduct.deleteMany({
    where: {
      cartId: findCart.id,
      productId,
    },
  });
};
