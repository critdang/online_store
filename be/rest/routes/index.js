const express = require('express');

const adminRoutes = require('./admin.route');
const userRoutes = require('./user.route');
const router = express.Router(); // eslint-disable-line new-cap

router.use('/admin', adminRoutes);
router.use('/user', userRoutes);
module.exports = router;
