const express = require('express');
const userController = require('../controller/user.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth.protectingRoutes1, userController.getUsers);
router.get('/:id', auth.protectingRoutes1, userController.getUser);
router.delete('/:id', auth.protectingRoutes1, userController.deleteUser);
router.post('/block/:id', auth.protectingRoutes1, userController.changeBlockUserStt);

module.exports = router;
