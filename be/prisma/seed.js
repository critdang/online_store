// eslint-disable-next-line import/order
const helperFn = require('../utils/helperFn');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const moment = require('moment');

async function main() {
  // Add new User
  const seedAmin = await prisma.admin.upsert({
    where: { email: 'admin@gmail.com' },
    update: {},
    create: {
      email: 'admin@gmail.com',
      fullname: 'admin',
      password: (await helperFn.hashPassword('123456')).toString(),
      address: '10 Ngo gia tu',
      avatar: 'mac dinh',
      phone: '0945246026',
      birthday: moment(Date.now()).format('DD.MM.YYYY'),
      gender: 'Male',
    },
  });

  const seedUser = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      fullname: 'Alice',
      password: (await helperFn.hashPassword('123456')).toString(),
      address: '125 pham huy thong',
      avatar: 'mac dinh',
      phone: '0945246026',
      gender: 'Female',
      isActive: true,
    },
  });

  const seedProduct = await prisma.product.create({
    data: {
      name: 'Shirt',
      description: 'high-quality brand',
      price: 20,
      amount: 5,
    },
  });
  const order = await prisma.order.create({
    data: {
      userId: seedUser.id,
      status: 'Pending',
      paymentMethod: 'visa',
      paymentDate: new Date(),
    },
  });

  const seedProductInOrder = await prisma.productInOrder.create({
    data: {
      orderId: order.id,
      productId: seedProduct.id,
      quantity: 3,
      price: 200.000,
    },
  });

  const seedProductImage = await prisma.productImage.create({
    data: {
      href: 'https://',
      productId: seedProduct.id,
      isDefault: true,
    },
  });

  const seedCategory = await prisma.category.create({
    data: {
      name: 'Trang phuc',
      thumbnail: 'no image',
      description: 'Bo suu tap trang phuc',
    },
  });

  const seedCategoryProduct = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct.id,
      categoryId: seedCategory.id,
    },
  });

  const seedCart = await prisma.cart.create({
    data: {
      userId: seedUser.id,
    },
  });

  const seedCartProduct = await prisma.cartProduct.create({
    data: {
      productId: seedProduct.id,
      quantity: 2,
      cartId: seedCart.id,
    },
  });

  console.log({ seedAmin });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
