const express = require('express');
const userController = require('../controller/user.controller');
const { upload } = require('../../utils/uploadImg');
const validate = require('../../validate/validate');

const router = express.Router();

router.post('/', upload.single('avatar'), userController.createUser);
router.post('/changeAvatar', upload.single('avatar'), userController.changeAvatar);
router.get('/verify/:token', userController.verifyUser);
router.post('/forgotPassword', userController.forgotPassword);
router.get('/:email/:token/reset-password', userController.verifyResetPassword);
router.post('/resetpassword', validate.resetPasswordValidate, userController.resetPassword);
module.exports = router;
