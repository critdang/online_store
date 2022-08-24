const express = require('express');
const passport = require('passport');
const authController = require('../controller/auth.controller');
const { upload } = require('../../utils/uploadImg');
const auth = require('../middleware/auth');
const validate = require('../../validate/validate');

const router = express.Router();
require('../middleware/auth').authUser(passport);

router.post('/', validate.loginValidate, passport.authenticate('login', { failureRedirect: '/loginerror' }), authController.login);
router.post('/avatar', auth.protectingRoutes, upload.single('avatar'), authController.uploadAdminAvatar);

module.exports = router;
