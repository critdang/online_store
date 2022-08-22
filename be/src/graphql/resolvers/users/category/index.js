const { PrismaClient } = require('@prisma/client');
const constants = require('../../../../../constants');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
require('dotenv').config();

exports.listCategories = async (parent, args, context, info) => {
  try {
    let { name } = args.input;
    let { amount } = args.input;
    if (name) {
      name = name.toLowerCase();
      const data = await prisma.category.findMany({
        orderBy: [{ name }],
        include: {
          categoryProduct: {
            include: {
              category: true,
            },
          },
        },
      });
      return data;
    }
    if (amount) {
      amount = amount.toLowerCase();
      const existProduct = await prisma.product.findMany({
        orderBy: [{ amount }],
        include: {
          categoryProduct: {
            include: {
              category: true,
            },
          },
        },
      });
      const result = existProduct.map((data) => data.categoryProduct).flat().map((item) => item.category);
      return result;
    }
    const data = await prisma.product.findMany({});
    return data;
  } catch (err) {
    console.log(err);
  }
};

exports.listCategory = async (parent, args, context, info) => {
  try {
    const { categoryId } = args.categoryId;
    const data = await prisma.category.findUnique({
      where: { id: categoryId },
      include: {
        categoryProduct: {
          include: {
            product: {
              select: {
                amount: true,
              },
            },
          },
        },
      },
    });
    if (!data) return new Error(constants.NO_FOUND_CATE);
    return data;
  } catch (err) {
    console.log(err);
  }
};

exports.categories = async (parent, args, context, info) => {
  try {
    const categories = await prisma.category.findMany({});
    if (!categories) return new Error(constants.NO_FOUND_CATE);

    return categories;
  } catch (err) {
    console.log(err);
  }
};
