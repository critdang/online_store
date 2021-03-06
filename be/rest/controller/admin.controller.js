const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

require('dotenv').config();
// set up for uploading Images
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');
const Promise = require('bluebird');
const helperFn = require('../utils/helperFn');
const { formatDay } = require('../../validate/validate');
const { uploadImg } = require('../../utils/uploadImg');
const AppError = require('../utils/ErrorHandler/appError');
const constants = require('../../constants');

const getUsers = async (req, res, next) => {
  const users = await prisma.user.findMany();
  // helperFn.returnSuccess(req, res, data);
  res.render('details/user.ejs', { users });
};

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
    // helperFn.returnSuccess(req, res, "login successfully");
    next();
  } catch (err) {
    console.log(err);
  }
};

const getLoginView = async (req, res, next) => {
  res.render('auth/login');
};

const dashboard = async (req, res, next) => {
//  global.user=req.user
  const fetchProducts = await prisma.product.findMany({
    include: {
      productImage: true,
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
  console.log(fetchOrders[0].paymentDate);
  const categoryProductResult = fetchProducts.map((product) => {
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
  // console.log(req.user)
  // console.log('req.user',{user:req.user});
};

const forgotPasswordView = async (req, res, next) => {
  res.render('auth/forgotPassword');
};

const uploadAdminAvatar = async (req, res, next) => {
  console.log(req.user);
  const { id } = req.user;
  try {
    const avatar = await uploadImg(req.file.path);
    if (!avatar) return helperFn.returnFail(req, res, 'upload avatar failed');
    await prisma.admin.update({
      where: { id },
      data: {
        avatar,
      },
    });
    return helperFn.returnSuccess(req, res, 'upload admin avatar successfully');
  } catch (err) {
    console.log(err);
  }
};
// eslint-disable-next-line consistent-return

const getUser = async (req, res, next) => {
  const idUser = +req.params.id;
  const data = await prisma.user.findUnique({
    where: { id: idUser },
  });
  helperFn.returnSuccess(req, res, data);
};

const deleteUser = async (req, res, next) => {
  const idUser = +req.params.id;
  try {
    const data = await prisma.user.deleteMany({
      where: { id: idUser, is_active: false },
    });
    if (!data) return res.send('User not found or activated');
    helperFn.returnSuccess(req, res, data);
  } catch (err) {
    console.log(err);
  }
};

const changeBlockUserStt = async (req, res, next) => {
  const idUser = +req.params.id;
  try {
    const existStatus = await prisma.user.findFirst({
      where: { id: idUser },
    });
    const updateUser = await prisma.user.update({
      where: { id: idUser },
      data: { is_blocked: !existStatus.is_blocked },
    });
    helperFn.returnSuccess(req, res, updateUser);
  } catch (err) {
    console.log(err);
  }
};

const addCategory = async (req, res, next) => {
  const { name, description } = req.body;
  if (!name || !description) { return helperFn.returnFail(req, res, 'Missing input data'); }
  const existCategory = await prisma.category.findFirst({ where: { name } });
  if (existCategory) {
    return helperFn.returnFail(req, res, 'Category already exists');
  }
  let image;
  if (req.file) {
    image = await uploadImg(req.file.path);
  } else {
    return helperFn.returnFail(req, res, 'No image uploaded');
  }
  try {
    await prisma.category.create({
      data: {
        name,
        description,
        thumbnail: image,
      },
    });
    helperFn.returnSuccess(req, res, 'Category created successfully');
  } catch (e) {
    console.log(e);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const categories = await prisma.category.findMany({});
    // helperFn.returnSuccess(req, res, data);
    res.render('details/category.ejs', { categories });
  } catch (err) {
    console.log(err);
  }
};

const getCategory = async (req, res, next) => {
  const id = +req.params.id;
  const newCategory = await prisma.category.findUnique({
    where: { id },
  });
  helperFn.returnSuccess(req, res, newCategory);
};

const editCategory = async (req, res, next) => {
  const data = req.body;
  const id = +req.params.id;
  const updateCategory = await prisma.category.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
  helperFn.returnSuccess(req, res, updateCategory);
};

const editThumbnail = async (req, res, next) => {
  try {
    const { id } = req.params;
    const thumbnail = await uploadImg(req.file.path);
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
    const existCategoryProduct = await prisma.categoryProduct.findFirst({
      where: { categoryId: id },
    });
    if (existCategoryProduct) {
      return next(
        new AppError('Have product in category. Can not delete', 400),
      );
    }
    const deletedCategory = await prisma.category.delete({
      where: { id },
    });
    return helperFn.returnSuccess(req, res, deletedCategory);
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
        for (const file of req.files) {
          const link = await uploadImg(file.path);
          const createImage = await prisma.productImage.create({
            data: {
              productId: +idNewProduct,
              href: link,
            },
          });
        }
      },
      {
        maxWait: 100000, // default: 2000
        timeout: 100000, // default: 5000
      },
    );
    helperFn.returnSuccess(req, res, 'Add Product successfully');
  } catch (err) {
    console.log(err);
  }
};
const getProducts = async (req, res, next) => {
  const products = await prisma.product.findMany({
    include: {
      categoryProduct: true,
      productImage: true,
    },
  });
  helperFn.returnSuccess(req, res, products);
  // res.render('details/product.ejs', {products})
};
const getProduct = async (req, res, next) => {
  const id = +req.params.id;
  const data = await prisma.product.findUnique({
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
  helperFn.returnSuccess(req, res, data);
};

const editProduct = async (req, res, next) => {
  const {
    name, description, price, amount, categoryId,
  } = req.body;
  try {
    const id = +req.params.id;
    const initialCheck = await prisma.categoryProduct.findMany({ where: { productId: id } });
    const submitCheck = categoryId;
    const diffCategory = initialCheck.filter((x) => !submitCheck.includes(x.categoryId.toString()));

    const foundProduct = await prisma.product.findFirst({ where: { id } });
    if (!foundProduct) { return helperFn.returnFail(req, res, 'Product not found'); }

    const result = await prisma.$transaction(
      async (prisma) => {
        const updateProduct = await prisma.product.update({
          where: { id },
          data: {
            name,
            description,
            price: +price,
            amount: +amount,
          },
        });
        // categoryId.forEach(async(item) => {
        //   const ctgProduct = await prisma.categoryProduct.findFirst({where: {
        //     productId: foundProduct.id,
        //     categoryId: +item
        //   }})
        //   if(!ctgProduct) {
        //     await prisma.categoryProduct.createMany({
        //       data: {
        //         productId: foundProduct.id,
        //         categoryId: +item
        //       }
        //     })
        //   }
        // });

        await Promise.mapSeries(categoryId, async (item) => {
          const ctgProduct = await prisma.categoryProduct.findFirst({
            where: {
              productId: foundProduct.id,
              categoryId: +item,
            },
          });
          if (!ctgProduct) {
            await prisma.categoryProduct.createMany({
              data: {
                productId: foundProduct.id,
                categoryId: +item,
              },
            });
          }
        });
        await Promise.mapSeries(diffCategory, async (item) => {
          await prisma.categoryProduct.deleteMany({
            where: {
              productId: id,
              categoryId: +item.categoryId,
            },
          });
        });
        // diffCategory.forEach(async(item) => {
        //   // delete unchecked categoryProduct
        //   await prisma.categoryProduct.deleteMany({
        //     where: {
        //       productId: id,
        //       categoryId: +item.categoryId
        //     }
        //   })
        // });
      },
      {
        maxWait: 100000, // default: 2000
        timeout: 100000, // default: 5000
      },
    );
    helperFn.returnSuccess(req, res, foundProduct);
  } catch (err) {
    console.log(err);
  }
};
const uploadImageProduct = async (req, res, next) => {
  const { productId } = req.params;
  if (!req.files) return helperFn.returnFail(req, res, 'No file provided');
  try {
    for (const file of req.files) {
      const link = await uploadImg(file.path);
      await prisma.productImage.create({
        data: {
          productId: +productId,
          href: link,
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
  try {
    const foundProduct = await prisma.productImage.findMany({ where: { id: +imgId } });
    if (!foundProduct) return helperFn.returnFail(req, res, 'No product image found');
    const { productId, id } = await prisma.productImage.update({ where: { id: +imgId }, data: { is_default: true } });
    const removeIsDefault = await prisma.productImage.updateMany({ where: { productId, NOT: { id } }, data: { is_default: false } });
    helperFn.returnSuccess(req, res, 'Update default product image');
  } catch (err) {
    console.log(err);
  }
};

const deleteImage = async (req, res, next) => {
  const { productId, imgId } = req.params;
  try {
    const result = await prisma.productImage.deleteMany({
      where: { productId: +productId, id: +imgId },
    });
    return helperFn.returnSuccess(req, res, result);
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = +req.params.id;
  try {
    // findProduct
    const findProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!findProduct) {
      helperFn.returnFail(req, res, 'Product not found');
    }
    const findProductInOrder = await prisma.productInOrder.findMany({
      where: { productId: id },
    });
    if (findProductInOrder.length > 0) {
      return helperFn.returnFail(req, res, 'Product in order.Can not deleted');
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
    helperFn.returnSuccess(req, res, 'Deleted Product Successfully');
  } catch (err) {
    console.log(err);
  }
};

// Order
const getOrders = async (req, res, next) => {
  const orders = await prisma.order.findMany({});
  helperFn.returnSuccess(req, res, orders);
  // res.render('details/order.ejs', {orders})
};

const getOrder = async (req, res, next) => {
  const id = +req.params.id;
  const data = await prisma.order.findUnique({
    where: { id },
  });
  helperFn.returnSuccess(req, res, data);
};

const changeStatus = async (req, res, next) => {
  const id = +req.params.id;
  const { newStatus } = req.body;
  try {
    const data = await prisma.order.updateMany({
      where: {
        id,
        paymentMethod: 'cash',
        status: 'pending',
      },
      data: {
        status: newStatus,
      },
    });
    helperFn.returnSuccess(req, res, data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  login,
  getLoginView,
  dashboard,
  profile,
  forgotPasswordView,
  uploadAdminAvatar,
  getUsers,
  getUser,
  deleteUser,
  changeBlockUserStt,
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  editThumbnail,
  deleteCategory,
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  uploadImageProduct,
  defaultImage,
  deleteProduct,
  getOrders,
  getOrder,
  changeStatus,
  deleteImage,
};
