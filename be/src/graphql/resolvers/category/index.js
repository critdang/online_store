const { PrismaClient } = require('@prisma/client');
const { ERROR } = require('../../../common/constants');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
require('dotenv').config();

exports.listCategories = async (parent, args, context, info) => {
  try {
    const data = await prisma.category.findMany({});
    if (!data) return new Error(ERROR.NO_FOUND_CATE);
    if (args.input === undefined) {
      return data;
    }
    let { name } = args.input;
    let { amount } = args.input;
    if (name) {
      name = name.toLowerCase();
      const foundCategory = await prisma.category.findMany({
        orderBy: [{ name }],
        include: {
          categoryProduct: {
            include: {
              category: true,
            },
          },
        },
      });
      return foundCategory;
    }
    if (amount) {
      amount = amount.toLowerCase();
      // eslint-disable-next-line no-shadow
      const foundCategory = await prisma.category.findMany({
        include: {
          categoryProduct: {
            include: {
              product: true,
            },
          },
        },
      });
      const result = foundCategory.map((item) => {
        const { id } = item;
        // eslint-disable-next-line no-shadow
        const { name } = item;
        const { thumbnail } = item;
        const { description } = item;
        const { categoryProduct } = item;
        const output = {
          id,
          name,
          thumbnail,
          description,
          categoryProduct,
        };
        return output;
      });
      result.sort((categoryA, categoryB) => {
        const categoryProductA = categoryA.categoryProduct.length;
        const categoryProductB = categoryB.categoryProduct.length;
        const sortCategory = amount === 'desc' ? categoryProductB - categoryProductA : categoryProductA - categoryProductB;
        return sortCategory;
      });
      return result;
    }
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
    if (!data) return new Error(ERROR.NO_FOUND_CATE);
    return data;
  } catch (err) {
    console.log(err);
  }
};

// exports.categories = async (parent, args, context, info) => {
//   try {
//     const categories = await prisma.category.findMany({});
//     if (!categories) return new Error(ERROR.NO_FOUND_CATE);

//     return categories;
//   } catch (err) {
//     console.log(err);
//   }
// };
