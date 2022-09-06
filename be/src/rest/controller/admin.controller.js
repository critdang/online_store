/* eslint-disable no-restricted-syntax */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

require('dotenv').config();
// set up for uploading Images
const Promise = require('bluebird');
const helperFn = require('../../utils/helperFn');
const constants = require('../../common/constants');

const logout = async (req, res, next) => {
  req.session.destroy();
  res.redirect('/loginView');
};
const getLoginView = async (req, res, next) => {
  res.render('auth/login');
};

const dashboard = async (req, res, next) => {
//  global.user=req.user
  const fetchProducts = await prisma.product.findMany({
    include: {
      productImage: { where: { isDefault: true } },
      categoryProduct: {
        include: {
          category: true,
        },
      },
    },
  });

  const fetchUsers = await prisma.user.findMany();
  const fetchCategories = await prisma.category.findMany();
  const fetchOrders = await prisma.order.findMany();
  const categoryProductResult = fetchProducts.map((product) => {
    // eslint-disable-next-line no-unused-vars
    const { categoryProduct, ...obj } = product;
    obj.categories = product.categoryProduct.map((item) => ({
      id: item.categoryId,
      ctgName: item.category.name,
      thumbnail: item.category.thumbnail,
    }));

    return obj;
  });
  res.render('admin/dashboard.ejs', {
    products: fetchProducts,
    users: fetchUsers,
    categories: fetchCategories,
    orders: fetchOrders,

    categoryProductResult,
  });
};

const profile = async (req, res, next) => {
  res.render('auth/profile.ejs', { user: req.user });
};

const forgotPasswordView = async (req, res, next) => {
  res.render('auth/forgotPassword');
};

const error = async (req, res, next) => {
  res.render('components/error');
};

const userView = async (req, res, next) => {
  const fetchUsers = await prisma.user.findMany();
  res.render('details/user', { users: fetchUsers });
};

const categoryView = async (req, res, next) => {
  const fetchCategories = await prisma.category.findMany();
  res.render('details/category', {
    categories: fetchCategories,
  });
};

const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        categoryProduct: true,
        productImage: true,
      },
    });
    if (!products) return helperFn.returnFail(req, res, constants.NO_PRODUCT_FOUND);
    return helperFn.returnSuccess(req, res, products);
    // res.render('details/product.ejs', {products})
  } catch (err) {
    console.log(err);
  }
};

const productView = async (req, res, next) => {
  const fetchProducts = await prisma.product.findMany({
    include: {
      productImage: { where: { isDefault: true } },
      categoryProduct: {
        include: {
          category: true,
        },
      },
    },
  });
  const fetchCategories = await prisma.category.findMany();
  const categoryProductResult = fetchProducts.map((product) => {
    // eslint-disable-next-line no-unused-vars
    const { categoryProduct, ...obj } = product;
    obj.categories = product.categoryProduct.map((item) => ({
      id: item.categoryId,
      ctgName: item.category.name,
      thumbnail: item.category.thumbnail,
    }));

    return obj;
  });
  res.render('details/product', {
    products: fetchProducts,
    categories: fetchCategories,
    categoryProductResult,
  });
};

const editProduct = async (req, res, next) => {
  const {
    name, description, price, amount, categoryId,
  } = req.body;
  try {
    const id = +req.params.id;
    const initialCheck = await prisma.categoryProduct.findMany({ where: { productId: id } });
    const submitCheck = categoryId;
    const tempt = submitCheck.split('"').join('');
    let diffCategory;
    if (submitCheck) {
      diffCategory = initialCheck.filter((x) => !submitCheck.includes(x.categoryId.toString()));
    }
    const foundProduct = await prisma.product.findFirst({ where: { id } });
    if (!foundProduct) { return helperFn.returnFail(req, res, 'Product not found'); }

    const result = await prisma.$transaction(
      // eslint-disable-next-line no-shadow
      async (prisma) => {
        const updatedProduct = await prisma.product.update({
          where: { id },
          data: {
            name,
            description,
            price: +price,
            amount: +amount,
          },
        });
        const updateCtg = await Promise.mapSeries(tempt, async (item) => {
          const ctgProduct = await prisma.categoryProduct.findFirst({
            where: {
              productId: foundProduct.id,
              categoryId: +item,
            },
          });
          if (!ctgProduct || ctgProduct === null) {
            await prisma.categoryProduct.createMany({
              data: {
                productId: foundProduct.id,
                categoryId: +item,
              },
            });
          }
        });
        const deletedCtg = await Promise.mapSeries(diffCategory, async (item) => {
          await prisma.categoryProduct.deleteMany({
            where: {
              productId: id,
              categoryId: +item.categoryId,
            },
          });
        });
        return { updatedProduct, updateCtg, deletedCtg };
      },
    );
    if (!result) return helperFn.returnFail(req, res, 'Product have not been updated.Please login again');

    return helperFn.returnSuccess(req, res, 'Product have been updated successfully!');
  } catch (err) {
    console.log(err);
  }
};

const orderView = async (req, res, next) => {
  const fetchOrders = await prisma.order.findMany();
  res.render('details/order', { orders: fetchOrders });
};

module.exports = {
  logout,
  error,
  getLoginView,
  dashboard,
  profile,
  forgotPasswordView,
  userView,
  categoryView,
  getProducts,
  productView,
  editProduct,
  orderView,
};
