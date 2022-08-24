const { PrismaClient } = require('@prisma/client');
const constants = require('../../../../../constants');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
require('dotenv').config();

exports.addToCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { productId } = args.inputProduct;
  const quantity = args.inputProduct.quantity || 1;

  try {
    const checkProduct = await prisma.product.findUnique({ where: { id: productId } });

    if (!checkProduct) {
      return new Error(constants.NO_PRODUCT_FOUND);
    }

    if (quantity > checkProduct.amount) {
      return new Error(constants.PRODUCT_EXCEED);
    }

    const cartItem = await prisma.cart.findFirst({ where: { userId }, include: { cartProduct: true } });
    const productInCart = await prisma.cartProduct.findFirst({ where: { productId, cartId: cartItem.id } });

    let run = [];
    if (!cartItem) {
      const createCartItem = prisma.cart.createMany({ data: { userId } });
      run = [createCartItem];
    }
    if (productInCart) {
      if (quantity === 1) {
        const increaseCartItem = prisma.cartProduct.updateMany({
          where: { productId, cartId: cartItem.id },
          data: { quantity: { increment: 1 } },
        });
        run = [increaseCartItem];
      } else {
        const updateCartItem = prisma.cartProduct.updateMany({
          where: { productId, cartId: cartItem.id },
          data: { quantity },
        });
        run = [updateCartItem];
      }
    } else {
      const createCartProduct = prisma.cartProduct.createMany({ data: { cartId: cartItem.id, productId, quantity } });
      run = [createCartProduct];
    }
    await prisma.$transaction(run);
    return constants.PRODUCT_TO_CART;
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
            include: {
              productImage: {
                where: { isDefault: true },
              },
            },
          },
        },
      },
    },
  });
  if (cartItems.cartProduct.length === 0) return new Error(constants.NO_PRODUCT_IN_CART);
  // const tempt = cartItems.cartProduct;
  let products;
  if (cartItems) {
    products = cartItems.cartProduct.map((Cproduct) => ({
      cartId: cartItems.id,
      productId: Cproduct.product.id,
      name: Cproduct.product.name,
      description: Cproduct.product.description,
      quantity: Cproduct.quantity,
      thumbnail: Cproduct.product.productImage[0].href,
    }));
  }

  return products;
};

exports.deleteItemCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { productId } = args.inputItem;
  const findCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });
  if (!findCart) return new Error(constants.NO_FOUND_CART);
  const foundProduct = await prisma.cartProduct.deleteMany({
    where: {
      cartId: findCart.id,
      productId,
    },
  });
  if (foundProduct.count === 0) return new Error();
  return constants.DELETE_SUCCESS;
};
