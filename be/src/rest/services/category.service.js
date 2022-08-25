const { PrismaClient } = require('@prisma/client');
const { ERROR } = require('../../common/constants');
const helperFn = require('../../utils/helperFn');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

const addCategory = async (req, res, next) => {
  const { name, description } = req.body;
  try {
    const existCategory = await prisma.category.findFirst({ where: { name } });
    if (existCategory) {
      return helperFn.returnFail(req, res, ERROR.EXIST_CATE);
    }

    const thumbnail = await req.file.path;
    if (!thumbnail) {
      return helperFn.returnFail(req, res, ERROR.ERROR_IMG);
    }

    const createCategory = await prisma.category.create({
      data: {
        name,
        description,
        thumbnail,
      },
    });
    return createCategory;
  } catch (err) {
    console.log(err);
  }
};

const getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({});
  if (!categories) helperFn.returnFail(req, res, ERROR.NO_CATEGORIES);
  return categories;
};

const getCategory = async (req, res, next) => {
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_CATE_ID);

  const foundCategory = await prisma.category.findUnique({
    where: { id },
  });
  if (!foundCategory) return helperFn.returnFail(req, res, ERROR.NO_FOUND_CATE);

  return foundCategory;
};

const editCategory = async (req, res, next) => {
  const { name, description } = req.body;
  const id = +req.params.id;
  if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_CATE_ID);

  const foundCategory = await prisma.category.findUnique({
    where: { id },
  });
  if (!foundCategory) return helperFn.returnFail(req, res, ERROR.NO_FOUND_CATE);

  const updateCategory = await prisma.category.update({
    where: { id },
    data: {
      name,
      description,
    },
  });

  return updateCategory;
};

const editThumbnail = async (req, res, next) => {
  const { id } = req.params;
  if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_CATE_ID);

  const thumbnail = await req.file.path;
  const updateThumbnail = await prisma.category.update({
    where: { id: +id },
    data: { thumbnail },
  });
  return updateThumbnail;
};

const deleteCategory = async (req, res, next) => {
  try {
    const id = +req.params.id;

    if (!id) return helperFn.returnFail(req, res, ERROR.PROVIDE_CATE_ID);
    const foundCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!foundCategory) return helperFn.returnFail(req, res, ERROR.NO_FOUND_CATE);
    const existCategoryProduct = await prisma.categoryProduct.findFirst({
      where: { categoryId: id },
    });

    if (existCategoryProduct) {
      return helperFn.returnFail(req, res, ERROR.HAVE_PRODUCT);
    }

    const deleteC = await prisma.category.delete({
      where: { id },
    });
    return deleteC;
  } catch (err) {
    console.log(err);
  }
};

const categoryView = async (req, res, next) => {
  const fetchCategories = await prisma.category.findMany();
  res.render('details/category', {
    categories: fetchCategories,
  });
  return categoryView;
};
module.exports = {
  addCategory,
  getCategories,
  getCategory,
  editCategory,
  editThumbnail,
  deleteCategory,
  categoryView,
};
