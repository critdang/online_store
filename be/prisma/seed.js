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
      avatar: 'https://img.freepik.com/premium-vector/man-avatar-profile-round-icon_24640-14044.jpg?w=740',
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

  const seedProduct1 = await prisma.product.create({
    data: {
      name: 'Polo Shirt',
      description: 'high-quality brand',
      price: 20,
      amount: 5,
    },
  });
  const seedProduct2 = await prisma.product.create({
    data: {
      name: 'Dot Jean',
      description: 'QUẦN THỂ THAO BÓ GẤU, QUẦN KAKI',
      price: 20,
      amount: 5,
    },
  });
  const seedProduct3 = await prisma.product.create({
    data: {
      name: 'Sneaker',
      description: 'GIÀY SNEAKER BUỘC DÂY',
      price: 20,
      amount: 5,
    },
  });
  const seedProductImage = await prisma.productImage.createMany({
    data: [
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/0706/330/400/2/w/529/0706330400_1_1_1.jpg?ts=1660231656449',
        productId: seedProduct1.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/0761/301/600/2/w/602/0761301600_2_4_1.jpg?ts=1660894861156',
        productId: seedProduct2.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/1/2/p/2230/920/107/2/w/293/2230920107_6_1_1.jpg?ts=1659968324894',
        productId: seedProduct3.id,
        isDefault: true,
      },
    ],
  });

  const order = await prisma.order.create({
    data: {
      userId: seedUser.id,
      status: 'Pending',
      paymentMethod: 'Visa',
      paymentDate: new Date(),
    },
  });

  const seedProductInOrder = await prisma.productInOrder.create({
    data: {
      orderId: order.id,
      productId: seedProduct1.id,
      quantity: 3,
      price: 200.000,
    },
  });

  const seedCategory = await prisma.category.create({
    data: {
      name: 'Shirt',
      thumbnail: 'https://static.zara.net/photos///2022/I/0/2/p/3471/300/251/2/w/288/3471300251_6_1_1.jpg?ts=1657277625826',
      description: 'This is shirt category',
    },
  });
  const seedCategory2 = await prisma.category.create({
    data: {
      name: 'Jean',
      thumbnail: 'https://static.zara.net/photos///2022/I/0/2/p/5646/078/401/2/w/529/5646078401_1_1_1.jpg?ts=1659608134834',
      description: 'This is jean category',
    },
  });
  const seedCategory3 = await prisma.category.create({
    data: {
      name: 'Shoe',
      thumbnail: 'https://static.zara.net/photos///2022/I/0/2/p/0761/301/600/2/w/602/0761301600_2_4_1.jpg?ts=1660894861156',
      description: 'This is shoe category',
    },
  });

  const seedCategoryProduct = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct1.id,
      categoryId: seedCategory.id,
    },
  });
  const seedCategoryProduct2 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct2.id,
      categoryId: seedCategory.id,
    },
  });
  const seedCategoryProduct3 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct3.id,
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
      productId: seedProduct1.id,
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
