const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const { ApolloError } = require('apollo-server-express');
require('dotenv').config();

exports.products = async (parent, args, context, info) => {
  try {
    const { isDefault } = args;
    if (isDefault) {
      const data = await prisma.product.findMany({
        include: {
          productImage: {
            where: {
              isDefault,
            },
          },
        },
      });
      return data;
    }
    const data = await prisma.product.findMany({
      include: {
        productImage: true,
      },
    });
    return data;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.listProducts = async (parent, args, context, info) => {
  try {
    // eslint-disable-next-line prefer-const
    let { name, price } = args.productOrderBy;
    if (name) {
      name = name.toLowerCase();
      const data = await prisma.product.findMany({
        include: {
          productImage: true,
        },
        orderBy: { name },
      });
      return data;
    }

    if (price) {
      price = price.toLowerCase();
      const data = await prisma.product.findMany({
        include: {
          productImage: true,
        },
        orderBy: { price },
      });
      return data;
    }
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.productDetail = async (parent, args, context, info) => {
  const { productId } = args.productId;
  console.log(args.productId.productId);
  try {
    const existProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: {
        productImage: true,
        categoryProduct: {
          include: {
            category: true,
          },
        },
      },
    });
    return existProduct;
  } catch (err) {
    console.log(err);
  }
};

exports.productImage = async (parent, args, context, info) => {
  try {
    const data = await prisma.productImage.findMany({});
    return data;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.filterProductByCategory = async (parent, args, context, info) => {
  const { categoryId } = args.categoryId;
  const productsByCategory = await prisma.category.findFirst({
    where: {
      id: categoryId,
    },
    include: {
      categoryProduct: {
        include: {
          product: {
            include: {
              productImage: {
                where: {
                  isDefault: true,
                },
              },
            },
          },
        },
      },
    },
  });
  const products = productsByCategory.categoryProduct.map((item) => {
    if (item.product.productImage.length > 0) {
      // eslint-disable-next-line no-param-reassign
      item.product.thumbnail = item.product.productImage[0].link;
    }
    return item.product;
  });
  return products;
};
