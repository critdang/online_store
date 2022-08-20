/* eslint-disable no-restricted-syntax */
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

require('dotenv').config();
// set up for uploading Images
const Promise = require('bluebird');
const helperFn = require('../../utils/helperFn');
const AppError = require('../../utils/ErrorHandler/appError');
const constants = require('../../constants');

const getUsers = async (req, res, next) => {
  const users = await prisma.user.findMany();
  helperFn.returnSuccess(req, res, users);
  // res.render('details/user.ejs', { users });
};

// eslint-disable-next-line consistent-return
const login = async (req, res, next) => {
  const { email: inputEmail, password: inputPassword } = req.body;
  try {
    if (!inputEmail || !inputPassword) {
      return next(new AppError(constants.PROVIDE, 400));
    }
    const admin = await prisma.admin.findFirst({
      where: { email: inputEmail },
    });
    if (!admin) {
      return next(new AppError(constants.EMAIL_NOT_CORRECT, 400));
    }
    const { password } = admin;
    const wrongPassword = await helperFn.comparePassword(
      inputPassword,
      password,
    );
    if (!wrongPassword) {
      return next(new AppError(constants.PASS_NOT_CORRECT, 400));
    }
    req.user = admin;
    helperFn.returnSuccess(req, res, 'Login successfully');
  } catch (err) {
    console.log(err);
  }
};
const logout = async (req, res, next) => {
  req.logout((err) => {
    if (err) { return next(err); }
    res.redirect('/loginView');
  });
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
  // return helperFn.returnSuccess(req, res, {fetchOrders});
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

const uploadAdminAvatar = async (req, res, next) => {
  const { id } = req.user;
  try {
    const avatar = await req.file.path;
    if (!avatar) return helperFn.returnFail(req, res, constants.PROVIDE_ADMIN_AVA);
    await prisma.admin.update({
      where: { id },
      data: {
        avatar,
      },
    });
    return helperFn.returnSuccess(req, res, constants.AVA_SUC);
  } catch (err) {
    console.log(err);
  }
};
// eslint-disable-next-line consistent-return

const getUser = async (req, res, next) => {
  const idUser = +req.params.id;
  if (!idUser) return helperFn.returnFail(req, res, constants.PROVIDE_ID);

  try {
    const data = await prisma.user.findUnique({
      where: { id: idUser },
    });
    helperFn.returnSuccess(req, res, data);
  } catch (err) {
    console.log(err);
  }
};
const userView = async (req, res, next) => {
  const fetchUsers = await prisma.user.findMany();
  res.render('details/user', { users: fetchUsers });
};

// eslint-disable-next-line consistent-return
const deleteUser = async (req, res, next) => {
  const idUser = +req.params.id;
  if (!idUser) return helperFn.returnFail(req, res, constants.PROVIDE_ID);

  try {
    const data = await prisma.user.deleteMany({
      where: { id: idUser, isActive: false },
    });
    if (!data) return res.send('User not found or activated');
    helperFn.returnSuccess(req, res, 'Deleted user successfully');
  } catch (err) {
    console.log(err);
  }
};

const changeBlockUserStt = async (req, res, next) => {
  const idUser = +req.params.id;
  if (!idUser) return helperFn.returnFail(req, res, constants.PROVIDE_ID);

  try {
    const existStatus = await prisma.user.findFirst({
      where: { id: idUser },
    });
    if (!existStatus) return helperFn.returnFail(req, res, constants.NO_USER);

    await prisma.user.update({
      where: { id: idUser },
      data: { isBlocked: !existStatus.isBlocked },
    });
    helperFn.returnSuccess(req, res, 'Block user successfully!');
  } catch (err) {
    console.log(err);
  }
};

const addCategory = async (req, res, next) => {
  const { name, description } = req.body;
  const existCategory = await prisma.category.findFirst({ where: { name } });
  if (existCategory) {
    return helperFn.returnFail(req, res, constants.EXIST_CATE);
  }
  const thumbnail = await req.file.path;
  if (!thumbnail) {
    return helperFn.returnFail(req, res, constants.ERROR_IMG);
  }
  try {
    await prisma.category.create({
      data: {
        name,
        description,
        thumbnail,
      },
    });
    helperFn.returnSuccess(req, res, constants.CREATE_SUC);
  } catch (e) {
    console.log(e);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({});
    if (!categories) helperFn.returnFail(req, res, constants.NO_CATEGORIES);
    helperFn.returnSuccess(req, res, categories);
    // res.render('details/category.ejs', { categories });
  } catch (err) {
    console.log(err);
  }
};

const getCategory = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_CATE_ID);

  const foundCategory = await prisma.category.findUnique({
    where: { id },
  });
  if (!foundCategory) return helperFn.returnFail(req, res, constants.NO_FOUND_CATE);
  helperFn.returnSuccess(req, res, foundCategory);
};
const categoryView = async (req, res, next) => {
  const fetchCategories = await prisma.category.findMany();
  res.render('details/category', {
    categories: fetchCategories,
  });
};
const editCategory = async (req, res, next) => {
  const { name, description } = req.body;
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_CATE_ID);

  const updateCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  });
  helperFn.returnSuccess(req, res, updateCategory);
};

const editThumbnail = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_CATE_ID);

    const thumbnail = await req.file.path;
    console.log(thumbnail);
    await prisma.category.update({
      where: { id: +id },
      data: { thumbnail },
    });
    return helperFn.returnSuccess(req, res, 'Thumbnail edited successfully');
  } catch (err) {
    console.log(err);
  }
};

// eslint-disable-next-line consistent-return
const deleteCategory = async (req, res, next) => {
  try {
    const id = +req.params.id;
    if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_CATE_ID);

    const existCategoryProduct = await prisma.categoryProduct.findFirst({
      where: { categoryId: id },
    });
    if (existCategoryProduct) {
      return helperFn.returnFail(req, res, constants.HAVE_PRODUCT);
    }
    await prisma.category.delete({
      where: { id },
    });
    return helperFn.returnSuccess(req, res, constants.DELETE_SUC);
  } catch (err) {
    console.log(err);
  }
};

const addProduct = async (req, res, next) => {
  try {
    const {
      name, description, price, amount, categoryId,
    } = req.body;

    await prisma.$transaction(
      // eslint-disable-next-line no-shadow
      async (prisma) => {
        const newProduct = await prisma.product.create({
          data: {
            name,
            description,
            price: +price,
            amount: +amount,
            categoryProduct: {
              create: {
                categoryId: +categoryId,
              },
            },
          },
        });
        const idNewProduct = newProduct.id;
        const { files } = req;
        for (const file of files) {
          const { path } = file;
          // eslint-disable-next-line no-await-in-loop
          await prisma.productImage.createMany({
            data: {
              productId: +idNewProduct,
              href: path,
            },
          });
        }
      },
      {
        maxWait: 100000, // default: 2000
        timeout: 100000, // default: 5000
      },
    );
    helperFn.returnSuccess(req, res, constants.PRODUCT_SUC);
  } catch (err) {
    console.log(err);
  }
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

const getProduct = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_PRODUCT_ID);

  const foundProduct = await prisma.product.findUnique({
    where: { id },
    include: {
      categoryProduct: {
        include: {
          category: true,
        },
      },
      productImage: true,
    },
  });
  if (!foundProduct) { return helperFn.returnFail(req, res, constants.NO_PRODUCT_FOUND); }
  return helperFn.returnSuccess(req, res, foundProduct);
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
    console.log('🚀 ~ file: admin.controller.js ~ line 403 ~ editProduct ~ submitCheck', submitCheck);
    const tempt = submitCheck.split('"').join('');
    console.log('🚀 ~ file: admin.controller.js ~ line 404 ~ editProduct ~ tempt', tempt);
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
          // console.log('🚀 ~ file: admin.controller.js ~ line 425 ~ updateCtg ~ categoryId', typeof categoryId);
          console.log('🚀 ~ file: admin.controller.js ~ line 425 ~ updateCtg ~ tempt', typeof tempt);
          console.log('🚀 ~ file: admin.controller.js ~ line 422 ~ updateCtg ~ item', item);
          const ctgProduct = await prisma.categoryProduct.findFirst({
            where: {
              productId: foundProduct.id,
              categoryId: +item,
            },
          });
          console.log('🚀 ~ file: admin.controller.js ~ line 430 ~ updateCtg ~ ctgProduct', ctgProduct);
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
      // {
      //   maxWait: 100000, // default: 2000
      //   timeout: 100000, // default: 5000
      // },
    );
    if (!result) return helperFn.returnFail(req, res, 'Product have not been updated.Please login again');

    return helperFn.returnSuccess(req, res, 'Product have been updated successfully!');
  } catch (err) {
    console.log(err);
  }
};

const uploadImageProduct = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    if (!productId) return helperFn.returnFail(req, res, constants.PROVIDE_PRODUCT_ID);

    const foundProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!foundProduct) return helperFn.returnFail(req, res, constants.NO_PRODUCT_FOUND);

    if (!req.files) return helperFn.returnFail(req, res, constants.NO_IMAGE_UPLOADED);

    // eslint-disable-next-line no-restricted-syntax
    for (const file of req.files) {
      const { path } = file;
      // eslint-disable-next-line no-await-in-loop
      await prisma.productImage.create({
        data: {
          productId: +productId,
          href: path,
        },
      });
    }
    return helperFn.returnSuccess(req, res, 'Images Uploaded');
  } catch (err) {
    console.log(err);
  }
};

const defaultImage = async (req, res, next) => {
  const { imgId } = req.params;
  if (!imgId) return helperFn.returnFail(req, res, constants.PROVIDE_DEFAULT_IMAGE_ID);

  try {
    const foundProduct = await prisma.productImage.findMany({ where: { id: +imgId } });
    if (!foundProduct) return helperFn.returnFail(req, res, constants.NO_IMAGE_FOUND);

    const { productId, id } = await prisma.productImage.update({ where: { id: +imgId }, data: { isDefault: true } });
    await prisma.productImage.updateMany({ where: { productId, NOT: { id } }, data: { isDefault: false } }); // removeIsDefault
    helperFn.returnSuccess(req, res, 'Update default product image');
  } catch (err) {
    console.log(err);
  }
};

const deleteImage = async (req, res, next) => {
  const { productId, imgId } = req.params;
  if (!req.params) return helperFn.returnFail(req, res, constants.PROVIDE_PRODUCTI_IMGID);

  try {
    const foundImg = await prisma.productImage.deleteMany({
      where: { id: +imgId, productId: +productId },
    });

    if (foundImg.count === 0) return helperFn.returnFail(req, res, constants.NO_IMAGE_FOUND);

    return helperFn.returnSuccess(req, res, constants.DELETE_PRODUCT_IMAGE_SUC);
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_PRODUCT_ID);

  try {
    // findProduct
    const foundProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!foundProduct) {
      helperFn.returnFail(req, res, constants.NO_PRODUCT_FOUND);
    }
    const findProductInOrder = await prisma.productInOrder.findMany({
      where: { productId: id },
    });
    if (findProductInOrder.length > 0) {
      return helperFn.returnFail(req, res, constants.PRODUCT_IN_ORDER);
    }

    const deleteCategoryProduct = prisma.categoryProduct.deleteMany({
      where: { productId: id },
    });
    const deleteProductImage = prisma.productImage.deleteMany({
      where: { productId: id },
    });
    const deleteCartProduct = prisma.cartProduct.deleteMany({
      where: { productId: id },
    });
    const deletedProduct = prisma.product.delete({
      where: { id },
    });

    await prisma.$transaction([
      deleteCategoryProduct,
      deleteProductImage,
      deleteCartProduct,
      deletedProduct,
    ]);
    helperFn.returnSuccess(req, res, constants.DELETE_PRODUCT_SUC);
  } catch (err) {
    console.log(err);
  }
};

// Order
const getOrders = async (req, res, next) => {
  const orders = await prisma.order.findMany({});
  if (!orders) return helperFn.returnFail(req, res, constants.NO_ORDER_FOUND);

  helperFn.returnSuccess(req, res, orders);
  // res.render('details/order.ejs', {orders})
};

const getOrder = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_ORDER_ID);

  const order = await prisma.order.findUnique({
    where: { id },
  });
  if (!order) return helperFn.returnFail(req, res, constants.NO_ORDER_FOUND);

  helperFn.returnSuccess(req, res, order);
};

const orderView = async (req, res, next) => {
  const fetchOrders = await prisma.order.findMany();
  res.render('details/order', { orders: fetchOrders });
};

const changeStatus = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, constants.PROVIDE_ORDER_ID);

  const { newStatus } = req.body;
  if (!newStatus) return helperFn.returnFail(req, res, constants.PROVIDE_ORDER_STATUS);

  try {
    const order = await prisma.order.updateMany({
      where: {
        id,
        paymentMethod: 'Cash',
        status: 'Pending',
      },
      data: {
        status: newStatus,
      },
    });
    if (order.count === 0) return helperFn.returnFail(req, res, constants.NO_ORDER_FOUND);

    helperFn.returnSuccess(req, res, order);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  login,
  logout,
  error,
  getLoginView,
  dashboard,
  profile,
  forgotPasswordView,
  uploadAdminAvatar,
  getUsers,
  getUser,
  userView,
  deleteUser,
  changeBlockUserStt,
  addCategory,
  getCategories,
  getCategory,
  categoryView,
  editCategory,
  editThumbnail,
  deleteCategory,
  addProduct,
  getProducts,
  getProduct,
  productView,
  editProduct,
  uploadImageProduct,
  defaultImage,
  deleteProduct,
  getOrders,
  getOrder,
  orderView,
  changeStatus,
  deleteImage,
};
