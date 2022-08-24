const express = require('express');
const userController = require('../controller/user.controller');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth.protectingRoutes, userController.getUsers);
router.get('/:id', auth.protectingRoutes, userController.getUser);
router.delete('/:id', auth.protectingRoutes, userController.deleteUser);
router.post('/block/:id', auth.protectingRoutes, userController.changeBlockUserStt);

module.exports = router;
