// eslint-disable-next-line import/order
const helperFn = require('../utils/helperFn');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();
const moment = require('moment');

async function main() {
  // Add new Admin
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
  // Add new User
  const seedUser = await prisma.user.upsert({
    where: { email: 'user@gmail.com' },
    update: {},
    create: {
      email: 'user@gmail.com',
      fullname: 'Alice',
      password: (await helperFn.hashPassword('123456')).toString(),
      address: '125 pham huy thong',
      birthday: moment(Date.now()),
      avatar: 'mac dinh',
      phone: '0945246026',
      gender: 'Female',
      isActive: true,
    },
  });
  // Add Products
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

  const seedProduct4 = await prisma.product.create({
    data: {
      name: 'Baseball Shirt',
      description: 'ÁO SƠ MI BASEBALL CÓ CÁC MIẾNG ĐÁP',
      price: 20,
      amount: 100,
    },
  });

  const seedProduct5 = await prisma.product.create({
    data: {
      name: 'Oxford shirt',
      description: 'Áo sơ mi dáng relaxed fit, cổ trụ, dài tay. Cài khuy phía trước.',
      price: 40.000,
      amount: 50,
    },
  });
  const seedProduct6 = await prisma.product.create({
    data: {
      name: 'Denim Shirt',
      description: ' Vải hiệu ứng bạc màu. Cài phía trước bằng khuy cài.',
      price: 20,
      amount: 5,
    },
  });
  const seedProduct7 = await prisma.product.create({
    data: {
      name: 'Poplin Shirt',
      description: 'Áo sơ mi oversize. Gấu lệch, xẻ hai bên',
      price: 600.000,
      amount: 55,
    },
  });
  const seedProduct8 = await prisma.product.create({
    data: {
      name: 'Moccasin shoe',
      description: 'Giày moccasin dáng giày driver.',
      price: 800.000,
      amount: 40,
    },
  });
  const seedProduct9 = await prisma.product.create({
    data: {
      name: 'Chelsea Sneaker',
      description: 'Bốt chelsea. Màu trơn, bề mặt nhẵn.',
      price: 190.000,
      amount: 56,
    },
  });

  const seedProduct10 = await prisma.product.create({
    data: {
      name: 'Casual Sneaker',
      description: 'Giày da dáng blucher. Có nhiều màu để lựa chọn. Chần chỉ nổi trên thân và mu giày.',
      price: 400.000,
      amount: 70,
    },
  });

  const seedProduct11 = await prisma.product.create({
    data: {
      name: 'Cargo Pant',
      description: 'Có hai túi đáp có nắp phía trước và hai túi may viền phía sau.',
      price: 600.000,
      amount: 80,
    },
  });

  const seedProduct12 = await prisma.product.create({
    data: {
      name: 'Jogger',
      description: 'Quần cạp co giãn, có dây rút để điều chỉnh.',
      price: 200.000,
      amount: 40,
    },
  });
  // ######################
  // Add Product Images
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
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/2795/315/712/2/w/750/2795315712_6_1_1.jpg?ts=1661240343014',
        productId: seedProduct4.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/4738/014/526/2/w/750/4738014526_6_1_1.jpg?ts=1658477178444',
        productId: seedProduct5.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/2553/351/405/2/w/750/2553351405_6_1_1.jpg?ts=1659949367733',
        productId: seedProduct6.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/5708/507/712/2/w/750/5708507712_6_1_1.jpg?ts=1657269175604',
        productId: seedProduct7.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/1/2/p/2656/921/102/2/w/288/2656921102_6_1_1.jpg?ts=1659537151682',
        productId: seedProduct8.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/1/2/p/2029/822/100/2/w/288/2029822100_6_1_1.jpg?ts=1660728600607',
        productId: seedProduct9.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/1/2/p/2656/921/102/2/w/288/2656921102_6_1_1.jpg?ts=1659537151682',
        productId: seedProduct10.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/5862/333/710/2/w/750/5862333710_6_1_1.jpg?ts=1652177343700',
        productId: seedProduct11.id,
        isDefault: true,
      },
      {
        href: 'https://static.zara.net/photos///2022/I/0/2/p/0706/540/982/2/w/750/0706540982_6_1_1.jpg?ts=1661509550795',
        productId: seedProduct12.id,
        isDefault: true,
      },
    ],
  });

  // Add order
  const order = await prisma.order.create({
    data: {
      userId: seedUser.id,
      status: 'Pending',
      paymentMethod: 'Visa',
      paymentDate: new Date(),
    },
  });

  // Add product in order
  const seedProductInOrder = await prisma.productInOrder.create({
    data: {
      orderId: order.id,
      productId: seedProduct1.id,
      quantity: 3,
      price: 200.000,
    },
  });

  // Add Categories
  const seedCategory1 = await prisma.category.create({
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

  // Add Category for each products
  const seedCategoryProduct = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct1.id,
      categoryId: seedCategory1.id,
    },
  });
  const seedCategoryProduct2 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct2.id,
      categoryId: seedCategory1.id,
    },
  });
  const seedCategoryProduct3 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct3.id,
      categoryId: seedCategory1.id,
    },
  });

  const seedCategoryProduct4 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct4.id,
      categoryId: seedCategory1.id,
    },
  });

  const seedCategoryProduct5 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct5.id,
      categoryId: seedCategory1.id,
    },
  });

  const seedCategoryProduct6 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct6.id,
      categoryId: seedCategory1.id,
    },
  });

  const seedCategoryProduct7 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct7.id,
      categoryId: seedCategory1.id,
    },
  });

  const seedCategoryProduct8 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct8.id,
      categoryId: seedCategory3.id,
    },
  });

  const seedCategoryProduct9 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct9.id,
      categoryId: seedCategory3.id,
    },
  });

  const seedCategoryProduct10 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct10.id,
      categoryId: seedCategory2.id,
    },
  });

  const seedCategoryProduct11 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct11.id,
      categoryId: seedCategory2.id,
    },
  });

  const seedCategoryProduct12 = await prisma.categoryProduct.create({
    data: {
      productId: seedProduct12.id,
      categoryId: seedCategory2.id,
    },
  });

  // Add Cart
  const seedCart = await prisma.cart.create({
    data: {
      userId: seedUser.id,
    },
  });

  // Add cart product
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
