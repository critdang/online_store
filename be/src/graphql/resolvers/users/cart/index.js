const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
require('dotenv').config();

exports.addToCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { quantity, productId } = args.inputProduct;
  try {
    const checkProduct = await prisma.product.findUnique({ where: { id: productId } });
    console.log('🚀 ~ file: index.js ~ line 13 ~ exports.addToCart= ~ checkProduct', checkProduct);

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
    return 'Add product successfully';
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
  if (cartItems.cartProduct.length === 0) return new Error('No Product in cart');
  const cartItem = cartItems.cartProduct[0];
  const result = {
    productName: cartItem.product.name,
    thumbnail: cartItem.product.productImage[0].href,
    quantity: cartItem.quantity,
    price: cartItem.product.amount,
  };

  return result;
};

exports.deleteItemCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { productId } = args;

  const findCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });
  if (!findCart) return new Error('Cart doesn\'t found ');
  const foundProduct = await prisma.cartProduct.deleteMany({
    where: {
      cartId: findCart.id,
      productId,
    },
  });
  if (foundProduct.count === 0) return new Error('Can not find product in cart ');
  return 'Deleted Successfully';
};
