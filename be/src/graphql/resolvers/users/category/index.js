const { PrismaClient } = require('@prisma/client');
const { ApolloError } = require('apollo-server-express');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
require('dotenv').config();

exports.listCategories = async (parent, args, context, info) => {
  try {
    const { name } = args.input;
    const { amount } = args.input;
    if (name) {
      const data = await prisma.category.findMany({
        orderBy: [{ name }],
      });
      return data;
    }
    if (amount) {
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
    return data;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.categories = async (parent, args, context, info) => {
  try {
    const categories = await prisma.category.findMany({});
    return categories;
  } catch (err) {
    throw new ApolloError(err);
  }
};
