const { PrismaClient } = require('@prisma/client');
const { reminderCart } = require('./helperFn');
const prisma = new PrismaClient();

module.exports = async() => {
 try {
  let cartItems = await prisma.cart.findMany({
    include: {
      user: {
        select: {
          email: true,
          fullname: true,
        }
      },
      cartProduct: {
        include: {
          product: true
        }
      }
    }
  });
  // console.log(cartItems)
  // console.log(cartItems[0].cartProduct)
   cartItems.map(async item => {
    await reminderCart(item.user.fullname, item.user.email, item.cartProduct);
  })

  return cartItems
 } catch (error) {
  return error;
 }
}