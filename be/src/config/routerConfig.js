const adminRoutes = require('../rest/routes/admin.route');
const authRoutes = require('../rest/routes/auth.route');
const categoryRoutes = require('../rest/routes/category.route');
const orderRoutes = require('../rest/routes/order.route');
const productRoutes = require('../rest/routes/product.route');
const userRoutes = require('../rest/routes/user.route');

const initRouters = (app) => {
  app.use('/', adminRoutes);
  app.use('/api', authRoutes);
  app.use('/api/user', userRoutes);
  app.use('/api/category', categoryRoutes);
  app.use('/api/product', productRoutes);
  app.use('/api/order', orderRoutes);
};

module.exports = initRouters;
