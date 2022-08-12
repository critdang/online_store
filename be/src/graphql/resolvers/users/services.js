const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
const { ApolloError, UserInputError } = require('apollo-server-express');
const jwt = require('jsonwebtoken');

const bcrypt = require('bcryptjs');
const helperFn = require('../../../../utils/helperFn');
const validateUser = require('../../../../validate/validateUser');
const { uploadImageFunc } = require('./fileUpload');
const { errorName } = require('../../../../utils/ErrorHandler/constantsql');

require('dotenv').config();

exports.createUser = async (parent, args, context, info) => {
  // const errors = [];
  // if (!validator.isEmail(args.inputSignup.email)) {
  //   throw new Error('Email is invalid');
  // }
  // if (validator.isEmpty(args.inputSignup.password)) {
  //   throw new Error('Password is too short');
  // }
  // if (errors.length > 0) {
  //   throw new Error('Invalid input');
  // }
  const { email, password, fullname } = args.inputSignup;
  const { error } = validateUser.createUserValidate(args.inputSignup);
  if (error) {
    throw new UserInputError('Fail to create a character', { validationError: error.message });
  }
  const hashPw = await bcrypt.hash(password, 12);

  const foundUser = await prisma.user.findFirst({ where: { email } });
  if (foundUser) { throw new Error('User already exists'); }

  const user = await prisma.user.create({
    data: {
      email,
      password: hashPw,
      fullname,
    },
  });
  return user;
};

exports.login = async (parent, args, context, info) => {
  let FoundUser = null;
  const { email, password } = args.inputLogin;
  const { error } = validateUser.loginUserSchema(args.inputLogin);
  if (error) {
    throw new UserInputError('Fail to create a character', { validationError: error.message });
  }
  try {
    FoundUser = await prisma.user.findFirst({
      where: { email, isActive: true },
    });
    if (!FoundUser) {
      throw new Error(errorName.USER_NOT_FOUND);
    }

    const isEqual = await helperFn.comparePassword(password, FoundUser.password);
    if (!isEqual) {
      throw new Error(errorName.WRONG_PASS);
    }
    const token = helperFn.generateToken({
      userId: FoundUser.id,
      email: FoundUser.email,
    }, '1h');
    return { token, userId: FoundUser.id };
  } catch (err) {
    throw new Error(err);
  }
};

// eslint-disable-next-line consistent-return
exports.changePassword = async (parent, args, context, info) => {
  try {
    if (!args.inputPassword) {
      throw new Error('Fill in');
    }

    const foundUser = await prisma.user.findUnique({ where: { id: context.currentUser.userId } });
    const isEqual = await helperFn.comparePassword(args.inputPassword.oldPassword, foundUser.password);
    if (!isEqual) {
      throw new Error(errorName.WRONG_CURRENT_PASS);
    }

    const hashPass = await helperFn.hashPassword(args.inputPassword.newPassword);
    await prisma.user.update({
      where: { id: context.currentUser.userId },
      data: {
        password: hashPass,
      },
    });
    return foundUser;
  } catch (err) {
    throw new Error(err);
  }
};

exports.editProfile = async (parent, args, context, info) => {
  try {
    const convertBirthday = new Date(args.inputProfile.birthday);

    const editProfile = await prisma.user.update({
      where: { id: context.currentUser.userId },
      data: {
        email: args.inputProfile.email,
        fullname: args.inputProfile.fullname,
        address: args.inputProfile.address,
        phone: args.inputProfile.phone,
        gender: args.inputProfile.gender,
        birthday: convertBirthday,
      },
    });
    return editProfile;
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.requestReset = async (parent, args, context, info) => {
  let { email } = args.inputRequest;
  email = email.toLowerCase();

  // Check that user exists.
  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) throw new Error('No user found with that email.');

  // const resetToken = helperFn.generateToken({ email }, '15m');
  const resetToken = jwt.sign({ email }, 'taskkhoqua');
  console.log(resetToken);

  // const resultToken = `Bearer ${resetToken}`;
  // console.log(resultToken);
  // const decodedToken = helperFn.verifyToken(resetToken);
  // console.log('decoded token', decodedToken);

  await prisma.user.update(
    {
      where: { email },
      data: { resetToken },
    },
  );

  // Email them the token
  await helperFn.forgotPassword(email, resetToken);

  return resetToken;
};

exports.resetPassword = async (parent, args, context, info) => {
  const { token, password, confirmPassword } = args.inputReset;

  // check token
  const decodedToken = jwt.verify(args.inputReset.token, 'taskkhoqua');
  const user = prisma.user.findFirst({
    where: { email: decodedToken.token, resetToken: token },
  });
  if (!user) {
    throw new Error(
      'Your password reset token is either invalid or expired.',
    );
  }
  // check if passwords match
  if (password !== confirmPassword) {
    throw new Error('Your passwords don\'t match');
  }
  const hashPass = await helperFn.hashPassword(password);
  await prisma.user.updateMany({
    where: { email: decodedToken.token },
    data: {
      password: hashPass,
      resetToken: null,
    },
  });
  return 'Your password has been updated successfully';
};

exports.uploadAvatar = async (parent, args, context, info) => {
  try {
    const avatar = await uploadImageFunc(args.file);
    if (!avatar) throw new ApolloError('Fail to upload avatar');
    await prisma.user.update({
      where: { id: context.currentUser.userId },
      data: { avatar },
    });
  } catch (err) {
    throw new ApolloError(err);
  }
};

exports.getUser = async (parent, args, context, info) => {
  try {
    const result = await prisma.user.findUnique({
      where: { id: context.currentUser.userId },
    });
    return result;
  } catch (err) {
    throw new ApolloError(err);
  }
};

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

// eslint-disable-next-line consistent-return
exports.listProducts = async (parent, args, context, info) => {
  try {
    const { name, price, categoryId } = args.productOrderBy;

    if (name) {
      const data = await prisma.product.findMany({
        include: {
          productImage: true,
        },
        orderBy: [{ name }],
      });
      return data;
    }

    if (price) {
      const data = await prisma.product.findMany({
        include: {
          productImage: true,
        },
        orderBy: [{ price: 'asc' }],
      });
      return data;
    }

    if (categoryId) {
      const data = await prisma.category.findMany({
        where: {
          id: +categoryId,
        },
        include: {
          categoryProduct: {
            include: {
              product: {
                include: {
                  productImage: true,
                },
              },
            },
          },
        },
      });
      return data;
    }
  } catch (err) {
    throw new ApolloError(err);
  }
};

// eslint-disable-next-line consistent-return
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

exports.cartProduct = async (parent, args, context, info) => {
  try {
    const data = await prisma.cartProduct.findMany({});
    return data;
  } catch (err) {
    throw new ApolloError(err);
  }
};

// eslint-disable-next-line consistent-return
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
    const { id } = args;
    const data = await prisma.category.findUnique({
      where: { id },
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

exports.getCart = async (parent, args, context, info) => {
  const cartItems = await prisma.cart.findFirst({
    where: { userId: context.currentUser.userId },
    include: {
      cartProduct: {
        include: {
          product: {
            select: {
              name: true,
              price: true,
              description: true,
              productImage: true,
              categoryProduct: true,
            },
          },
        },
      },
    },
  });
  return cartItems;
};

// eslint-disable-next-line consistent-return
exports.addToCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { quantity, productId } = args;
  try {
    const checkProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!checkProduct) {
      throw new Error('Product not found');
    }

    if (quantity > checkProduct.amount) {
      throw new Error('Product quantity exceed');
    }

    const cartItem = await prisma.cart.findFirst({ where: { userId }, include: { cartProduct: true } });
    const productInCart = await prisma.cartProduct.findFirst({ where: { productId, cartId: cartItem.id } });

    let run = [];
    if (!cartItem) {
      const createCartItem = prisma.cart.createMany({ data: { userId } });
      run = [createCartItem];
    }
    if (productInCart) {
      const updateCartItem = prisma.cartProduct.updateMany({
        where: { productId, cartId: cartItem.id },
        data: { quantity },
      });
      run = [updateCartItem];
    } else {
      const createCartProduct = prisma.cartProduct.createMany({ data: { cartId: cartItem.id, productId, quantity } });
      run = [createCartProduct];
    }
    await prisma.$transaction([...run]);
    return run;
  } catch (err) {
    console.log(err);
    throw new Error(err);
  }
};

exports.deleteItemCart = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const { productId } = args;

  const findCart = await prisma.cart.findFirst({
    where: {
      userId,
    },
  });

  await prisma.cartProduct.deleteMany({
    where: {
      cartId: findCart.id,
      productId,
    },
  });
};
exports.createOrder = async (parent, args, context, info) => {
  try {
    const { userId } = context.currentUser;
    const { cartId } = args;
    let { paymentMethod } = args;
    const foundCarts = await prisma.cart.findFirst({
      where: { userId, id: cartId },
      include: {
        cartProduct: {
          include: {
            product: true,
          },
        },
      },
    });

    const orders = [];
    if (foundCarts.cartProduct) {
      let paymentDate;
      let statusPayment = 'Pending';

      if (paymentMethod === 'VISA') {
        paymentMethod = 'Visa';
        paymentDate = validateUser.formatDay(new Date());
        statusPayment = 'Completed';
      }
      const order = await prisma.order.create({
        data: {
          userId,
          status: statusPayment,
          paymentDate,
          paymentMethod: paymentMethod || 'Pending',
          createdAt: validateUser.formatDay(new Date()),
          updatedAt: validateUser.formatDay(new Date()),
        },
      });

      const run = [];
      // const promises = [];
      // load foundCarts
      foundCarts.cartProduct.map(async (item) => {
        if (item.quantity > item.product.amount) {
          throw new Error('Exceed quantity limit');
        }

        const obj = {};
        obj.orderId = order.id;
        obj.quantity = item.quantity;
        obj.total = item.quantity * item.product.price;
        obj.productId = item.product.id;
        obj.productName = item.product.name;
        obj.paymentDate = paymentDate;
        obj.paymentMethod = paymentMethod;
        obj.price = item.product.price;
        orders.push(obj);

        const checkProduct = await prisma.product.findFirst({ where: { id: item.product.id } });

        const amount = checkProduct.amount - item.quantity;

        const updateProductAmount = prisma.product.update({ where: { id: item.product.id }, data: { amount } });
        run.push(updateProductAmount);

        const createProductInOrder = prisma.productInOrder.create({
          data: {
            orderId: obj.orderId,
            quantity: obj.quantity,
            productId: obj.productId,
            price: obj.price,
          },
        });
        run.push(createProductInOrder);

        const deleteCartProduct = prisma.cartProduct.deleteMany({ where: { productId: obj.productId } });
        run.push(deleteCartProduct);

        await prisma.$transaction(run);

        // const p = new Promise((resolve, reject) => {
        //  obj['orderId'] = order.id;
        //  obj['quantity'] =  item.quantity;
        //  obj['total'] = item.quantity * item.product.price;
        //  obj['productId'] = item.product.id;
        //  obj['productName'] = item.product.name;
        //  obj['paymentDate'] = paymentDate;
        //  obj['payment'] = payment;
        //  obj['price'] = item.product.price;

      // orders.push(obj);
      // const updateProductAmount = prisma.product.findFirst({  where: {id: item.product.id}  })
      //   .then(result =>
      //     prisma.product.update({  where: {id: item.product.id}, data: {amount: result.amount - item.quantity}}
      //     ))
      //   .catch(err => reject(err));
      // run = [updateProductAmount];
      // const createProductInOrder = prisma.productInOrder.create({data: {
      //   orderId: obj.orderId,
      //   quantity: obj.quantity,
      //   productId: obj.productId,
      //   price: obj.price,
      // }})
        // .then(() => {const deleteCartProduct =  prisma.cartProduct.deleteMany({
        //       where: {productId:obj.productId}
        //     })
        //     // run = [deleteCartProduct]
        //   },
        // )
        // .then(() => resolve("already deleted cart product"))
        // .catch(err => reject(err));
        // run = [updateProductAmount];
      // });
      // promises.push(p);
      });
      //  await Promise.all(promises);
      await helperFn.createOrder(context.currentUser.email, orders);
      return orders;
    }
    return new Error('No product in cart');
  } catch (err) {
    return err;
  }
};

exports.listOrders = async (parent, args, context, info) => {
  const { userId } = context.currentUser;
  const orders = await prisma.order.findMany({
    where: { userId },
    // include: {
    //   user: {
    //     select: {
    //       id: true,
    //       fullname: true,
    //       address: true,
    //       phone: true,
    //     },
    //   },
    //   productInOrder: {
    //     select: {
    //       quantity: true,
    //       total: true,
    //       price: true,
    //       product: {
    //         select: {
    //           description: true,
    //           price: true,
    //           name: true,
    //         },
    //       },
    //     },
    //   },
    // },
  });
  return orders;
};

// eslint-disable-next-line consistent-return
exports.changeOrderStatus = async (parent, args, context, info) => {
  const { orderId, status } = args;
  let { paymentMethod } = args;
  if (paymentMethod === 'CASH') paymentMethod = 'Cash';
  try {
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        paymentMethod: 'Pending',
        status: 'Pending',
      },
    });
    if (!order) {
      return new ApolloError('Order not found');
    }
    await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        paymentMethod,
        status,
        paymentDate: validateUser.formatDay(new Date()),
      },
    });
  } catch (err) {
    console.log(err);
  }
};
