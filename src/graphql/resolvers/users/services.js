const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');
const { ApolloError } = require('apollo-server-express');

const bcrypt = require('bcryptjs');
const validator = require('validator');
const helperFn = require('../../../../utils/helperFn');
const validate = require('../../../../validate/validate');
exports.createUser = async (parent, args, context,info) => {
  // validator
  const errors = [];
  if(!validator.isEmail(args.email)) {
    errors.push({message: 'Email is invalid'});
  }
  if(validator.isEmpty(args.password) || validator.isLength(args.password,{min: 5})) {
    errors.push({message: 'Password is too short'});
  }
  if(errors.length > 0) {
    const error = new Error('Invalid input');
    error.data = errors;
    error.code = 401;
    throw error;
  }
  // logic
    const hashPw = await bcrypt.hash(args.password, 12);
    const user = await prisma.user.create({
      data: {
        email: args.email,
        password: hashPw,
      },
    });
    return user;
  },
exports.login = async (parent, args, context,info) => {
    let userFind = null;
    try {
      // findFirst = findOne
      userFind = await prisma.user.findFirst({
        where: { email: args.email },
      });
      if (!userFind) {
        const error = new Error('User not found.');
        error.code = 401;
        throw error;
      }
      const isEqual = helperFn.comparePassword(args.password, userFind.password);
      if (!isEqual) {
        const error = new Error('Password is incorrect.');
        error.code = 401;
        throw error;
      }
      const token = helperFn.generateToken({
        userId: userFind.id,
        email: userFind.email,
      },'1h');
      return { token, userId: userFind.id };
    } catch (err) {
      return console.log(err);
    }
  },
  // eslint-disable-next-line consistent-return
exports.changePassword = async (parent, args, context,info) => {
    try {
      // console.log('context client', context);s
      if (!context.currentUser) {
        throw new ApolloError('You must login to change password');
      }

      const foundUser = await prisma.user.findFirst({ where: { email: args.email } });
      const isEqual = await helperFn.comparePassword(args.oldPassword, foundUser.password);
      if (!isEqual) {
        return 'login failed';
      }
      const hashPass = await helperFn.hashPassword(args.newPassword);
      const newPassword = await prisma.user.update({
        where: { email: args.email },
        data: {
          password: hashPass,
        },
      });
      return newPassword;
    } catch (err) {
      throw new ApolloError(err);
    }
  }
exports.editProfile = async(parent, args, context,info) => {
  try{
    const editProfile = await prisma.user.update({
      where: {id: context.currentUser.userId},
      data: {
        email: args.email,
        fullname: args.fullname,
        address: args.address,
        phone: args.phone,
        gender: args.gender,
        birthday: args.birthday,
        
      }
    })
    return editProfile
  }catch(err){
    throw new ApolloError(err);
  }
}
exports.getUser = async(parent, args, context,info) => {
  try{
    const result = await prisma.user.findUnique({
      where: {id: context.currentUser.userId},
    })
    return result

  }catch(err){
    throw new ApolloError(err);
  }
}

exports.listProducts = async (parent, args,context,info) => {
  try{
    const name= args.input.name;
    if(name) {
      const data = await prisma.product.findMany({
        orderBy:[{name:name}],
      });
      return data;
    }
    const price = args.input.price;
    if(price) {
      const data = await prisma.product.findMany({
        orderBy:[{price:'asc'}],
      });
      return data;
    }
    const category = args.input.category;
    if(category) {
      const data = await prisma.category.findMany({
        where: {
          name:category
        },
        include: {
          categoryProduct: {
            include: {
              product: {
              }
            }
          }
        }
      })
      return data;
    }
  }catch(err) {
    throw new ApolloError(err);
  }
}

exports.productDetail = async(parent, args, context,info) => {
  const productId = args.productId;
  try{
    const existProduct = await prisma.product.findUnique({
      where: {id:productId},
      include: {
      productImage: true,
      categoryProduct: {
        include: {
          category: true
          }
        }
      }
    });
    return existProduct;
  }catch(err) {
    console.log(err);
  }
}

exports.productImage = async (parent, args,context,info) => {
  try{
    const data = await prisma.productImage.findMany({})
    return data
  }catch(err) {
    throw new ApolloError(err);

  }
}

exports.cartProduct = async (parent, args,context,info) => {
  try{
    const data = await prisma.cartProduct.findMany({})
    return data
  }catch(err) {
    throw new ApolloError(err);

  }
}


exports.listCategories = async(parent, args, context,info) => {
  try{
    const name= args.input.name;
    const amount = args.input.amount;
    if(name) {
      const data = await prisma.category.findMany({
        orderBy:[{name:name}],
      });
      return data;
    }
    if(amount) {
      const existProduct = await prisma.product.findMany({
        orderBy:[{amount:amount}],
        include: {
          categoryProduct: {
            include: {
              category: true
            }
          }
        }
      });
      const result = existProduct.map(data => data.categoryProduct).flat().map(item=>item.category);
      return result;
    }
    else {
      const data = await prisma.product.findMany({});
      return data;
    }
  }catch(err) {
    console.log(err);
  }
}


exports.listCategory = async(parent, args, context,info) => {
  try{
    id = args.id;
    const data = await prisma.category.findFirst({
      where: {id},
      include: {
        categoryProduct: {
          include:{
            product:{
              select: {
                amount: true
              }
            }
          }
        }
      }
    })
    return data
  }catch(err) {
    throw new ApolloError(err);
  }
}

exports.getCart = async(parent,args,context,info) => {
  const userId = context.currentUser.userId;
  const data = await prisma.cart.findFirst({
    where: {
      userId
    },
    include: {
      cartProduct: {
        include: {
          product: {
            select:{
              name: true,
              description: true,
              price: true,
              amount: true,
            }
          }
        }
      }
    }
  });
  return data;
}
exports.getListItemInCart = async(parent, args, context,info) => {
  let cartItems = await prisma.cart.findFirst({
    where: {userId: context.currentUser.userId},
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
            }
          },
        }
      }
    }
  })
  console.log(cartItems)
  console.log(cartItems.cartProduct)
  return cartItems
}

exports.addToCart = async (parent, args,context,info) => {
  const userId = context.currentUser.userId;
  const quantity = args.quantity;
  const productId = args.productId;
  try{
      const checkProduct = await prisma.product.findUnique({where:{id:productId}});
      let errors = [];
      if (!checkProduct) {
        const error = new Error('Product not found');
        error.data = errors;
        error.code = 422;
        throw error;
      };
      if (quantity > checkProduct.amount) {
        const error = new Error('Product quantity exceed');
        error.data = errors;
        error.code = 422;
        throw error;
      }
      const cartItem = await  prisma.cart.findFirst({ where: { userId },include: {cartProduct:true} });
      const productInCart = await prisma.cartProduct.findFirst({ where: { productId, cartId: cartItem.id } });
      let run = [];
      if (!cartItem) {
        const createCartItem =  prisma.cart.createMany({data:{ userId }});
        run = [createCartItem]
      }
      if (productInCart) {
        const updateCartItem =  prisma.cartProduct.updateMany({
          where: { productId, cartId: cartItem.id },
          data: {amount: quantity}
        })
        run = [updateCartItem]
      } else {
        const createCartProduct =  prisma.cartProduct.create({data:{ cartId: cartItem.id, productId, amount:quantity }});
        run = [createCartProduct]
      }
      await prisma.$transaction([...run]);
      return cartItem
  }catch(err) {
    console.log(err)
  }
}


exports.deleteItemCart = async(parent,args,context,info) => {
  const userId = context.currentUser.userId;
  const deleteItem  = args.deleteItem
  const findCart = await prisma.cart.findFirst({
    where: {
      userId
    }
  })
  await prisma.cartProduct.deleteMany({
    where: {
      cartId:findCart.id,
      productId:deleteItem
    }
  })
}
exports.createOrder = async(parent,args,context,info) => {
  try{
    const userId = context.currentUser.userId;
    const payment = args.payment;
    const cartId = args.cartId;
    const errors = [];
  
    let foundCarts = await prisma.cart.findFirst({
      where: {userId, id: cartId},
      include: {
        cartProduct: {
          include: {
            product: true
          }
        }
      }
    })
    let run = [];
    let orders = [];
  if(foundCarts.cartProduct) {
    let temp = new Date();
    let paymentDate = null;
    if(payment === 'visa') {
      paymentDate = validate.formatDay(temp);
    }
    const order = await  prisma.order.create({
      data: {
        userId,
        status: 'pending',
        paymentDate,
        paymentMethod:payment,
        createdAt:validate.formatDay(new Date()),
        updatedAt:validate.formatDay(new Date())
      }
    })
    // run = [order];
    const promises = [];
    //load foundCarts
    foundCarts.cartProduct.map((item) => {
      if(item.quantity > item.product.amount) {
       throw new Error('Exceed quantity limit')
      }

      let obj = {};
      const p = new Promise((resolve, reject) => {
       obj['orderId'] = order.id;
       obj['quantity'] =  item.quantity;
       obj['total'] = item.quantity * item.product.price;
       obj['productId'] = item.product.id;
       obj['productName'] = item.product.name;
       obj['paymentDate'] = paymentDate;
       obj['payment'] = payment;
       obj['price'] = item.product.price;

      orders.push(obj);
      const updateProductAmount = prisma.product.findFirst({  where: {id: item.product.id}  })
        .then(result => 
          prisma.product.update({  where: {id: item.product.id}, data: {amount: result.amount - item.quantity}} 
          ))
        .catch(err => reject(err));
      // run = [updateProductAmount];
      const createProductInOrder = prisma.productInOrder.create({data: {
        orderId: obj.orderId,
        quantity: obj.quantity,
        productId: obj.productId,
        price: obj.price,
      }})
      
        .then(() => {const deleteCartProduct =  prisma.cartProduct.deleteMany({
              where: {productId:obj.productId}
            })
            // run = [deleteCartProduct]
          },
        )
        .then(() => resolve("already deleted cart product"))
        .catch(err => reject(err));
        // run = [updateProductAmount];
      });
      promises.push(p);
   });
   await Promise.all(promises);
   await helperFn.createOrder(context.currentUser.email,orders)
  //  await prisma.$transaction([...run]);
   return orders;
  }else{
    return new Error('No product in cart')
  }
  }catch(err) {
    return err;
  }
}


exports.listAllOrders = async(parent,args,context,info) => {
  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          id: true,
          fullname: true,
          address: true,
          phone: true,
        }
      },
      productInOrder: {
        select: {
          quantity: true,
          total: true,
          price: true,
          product: {
            select:{
              description: true,
              price: true,
              name: true
            }
          }
        },
      }
    }
  })
  return orders
}

exports.changeOrderStatus = async(parent, args, context,info) => {
  const orderId = args.orderId;
  const payment = args.payment || 'pending';
  const userId = context.currentUser.userId;
  try {
    const order = await prisma.order.findFirst({
      userId,
      id: orderId
    })
    if(!order) {
      return new ApolloError('Order not found');
    }
    await prisma.order.update({
      where: {
        userId,
        id: orderId
      },
      data: {
        status: payment,
        paymentDate: validate.formatDay(new Date())
      }
    })
  }catch(err) {
    console.log(err)
  }
}


