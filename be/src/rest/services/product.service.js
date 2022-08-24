const { PrismaClient } = require('@prisma/client');
const { ERROR } = require('../../common/constants');
const helperFn = require('../../utils/helperFn');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const addProduct = async (req, res) => {
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
      // eslint-disable-next-line no-restricted-syntax
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
  );
};

const getProducts = async (req, res, next) => {
  try {
    const products = await prisma.product.findMany({
      include: {
        categoryProduct: true,
        productImage: true,
      },
    });
    if (!products) return helperFn.returnFail(req, res, ERROR.NO_PRODUCT_FOUND);
    return products;
  } catch (err) {
    console.log(err);
  }
};

const getProduct = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_PRODUCT_ID);

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
  if (!foundProduct) { return helperFn.returnFail(req, res, ERROR.NO_PRODUCT_FOUND); }
  return foundProduct;
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
          // console.log('🚀 ~ file: admin.controller.js ~ line 425 ~ updateCtg ~ categoryId', typeof categoryId);
          console.log('🚀 ~ file: admin.controller.js ~ line 425 ~ updateCtg ~ tempt', typeof tempt);
          console.log('🚀 ~ file: admin.controller.js ~ line 422 ~ updateCtg ~ item', item);
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
  } catch (err) {
    console.log(err);
  }
};

const deleteProduct = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_PRODUCT_ID);

  try {
    // findProduct
    const foundProduct = await prisma.product.findUnique({
      where: { id },
    });
    if (!foundProduct) {
      helperFn.returnFail(req, res, ERROR.NO_PRODUCT_FOUND);
    }
    const findProductInOrder = await prisma.productInOrder.findMany({
      where: { productId: id },
    });
    if (findProductInOrder.length > 0) {
      return helperFn.returnFail(req, res, ERROR.PRODUCT_IN_ORDER);
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
  } catch (err) {
    console.log(err);
  }
};

const uploadImageProduct = async (req, res, next) => {
  try {
    const productId = +req.params.productId;
    if (!productId) return helperFn.returnFail(req, res, ERROR.PROVIDE_PRODUCT_ID);

    const foundProduct = await prisma.product.findUnique({ where: { id: productId } });
    if (!foundProduct) return helperFn.returnFail(req, res, ERROR.NO_PRODUCT_FOUND);

    if (!req.files) return helperFn.returnFail(req, res, ERROR.NO_IMAGE_UPLOADED);

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
  } catch (err) {
    console.log(err);
  }
};

const defaultImage = async (req, res, next) => {
  const { imgId } = req.params;
  if (!imgId) return helperFn.returnFail(req, res, ERROR.PROVIDE_DEFAULT_IMAGE_ID);

  try {
    const foundProduct = await prisma.productImage.findMany({ where: { id: +imgId } });
    if (!foundProduct) return helperFn.returnFail(req, res, ERROR.NO_IMAGE_FOUND);

    const { productId, id } = await prisma.productImage.update({ where: { id: +imgId }, data: { isDefault: true } });
    await prisma.productImage.updateMany({ where: { productId, NOT: { id } }, data: { isDefault: false } }); // removeIsDefault
  } catch (err) {
    console.log(err);
  }
};

const deleteImage = async (req, res, next) => {
  const { productId, imgId } = req.params;
  if (!req.params) return helperFn.returnFail(req, res, ERROR.PROVIDE_PRODUCTI_IMGID);

  try {
    const foundImg = await prisma.productImage.deleteMany({
      where: { id: +imgId, productId: +productId },
    });

    if (foundImg.count === 0) return helperFn.returnFail(req, res, ERROR.NO_IMAGE_FOUND);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  addProduct,
  getProducts,
  getProduct,
  editProduct,
  deleteProduct,
  uploadImageProduct,
  defaultImage,
  deleteImage,
};
