const { PrismaClient } = require('@prisma/client');
const { RESPONSE, ERROR } = require('../../../common/constants');

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
      return new Error(ERROR.NO_PRODUCT_FOUND);
    }

    if (quantity < 0) {
      return new Error(ERROR.WRONG_INPUT_QUANTITY);
    }

    if (quantity > checkProduct.amount) {
      return new Error(ERROR.PRODUCT_EXCEED);
    }

    const cartItem = await prisma.cart.findFirst({ where: { userId }, include: { cartProduct: true } });
    let productInCart;
    if (cartItem) {
      productInCart = await prisma.cartProduct.findFirst({ where: { productId, cartId: cartItem.id } });
      if (!productInCart) {
        // create new product if no product in cart
        await prisma.cartProduct.create({ data: { productId, cartId: cartItem.id, quantity } });
      }
    }
    let run = [];
    if (cartItem == null) {
      // eslint-disable-next-line no-unused-vars
      await prisma.$transaction(
        async (prisma) => {
          // create cart
          await prisma.cart.createMany({ data: { userId } });
          // find new cart
          const findNewCartItem = await prisma.cart.findFirst({ where: { userId } });
          // create cart product
          await prisma.cartProduct.createMany({ data: { cartId: findNewCartItem.id, productId, quantity } });
        },
      );
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
      await prisma.$transaction(run);
    }

    return ERROR.PRODUCT_TO_CART;
  } catch (err) {
    console.log('🚀 ~ file: index.js ~ line 54 ~ exports.addToCart= ~ err', err);
    return new Error(err);
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
  if (cartItems.cartProduct.length === 0) return new Error(ERROR.NO_PRODUCT_IN_CART);
  // const tempt = cartItems.cartProduct;
  let products;
  if (cartItems) {
    products = cartItems.cartProduct.map((Cproduct) => ({
      cartId: cartItems.id,
      productId: Cproduct.product.id,
      name: Cproduct.product.name,
      price: Cproduct.product.price,
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
  if (!findCart) return new Error(ERROR.NO_FOUND_CART);
  const foundProduct = await prisma.cartProduct.deleteMany({
    where: {
      cartId: findCart.id,
      productId,
    },
  });
  if (foundProduct.count === 0) return new Error();
  return RESPONSE.DELETE_ITEM_IN_CART_SUC;
};
