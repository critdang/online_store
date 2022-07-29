const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const multer = require('multer');

const AppError = require('./ErrorHandler/appError');
require('dotenv').config();

exports.generateToken = (key, time) => jwt.sign(key, process.env.JWT_SECRET, {
  expiresIn: time,
});

exports.returnSuccess = (req, res, message = 'success') => res.json({
  status: 200,
  message,
});

exports.returnFail = (req, res, message = 'error') => res.json({
  status: 404,
  message,
});

// eslint-disable-next-line no-return-await
exports.comparePassword = async (inputPassword, userPassword) => await bcrypt.compare(inputPassword, userPassword);

exports.hashPassword = async (inputPassword) => bcrypt.hash(inputPassword, 8);

// setting for image upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'public/image/client');
    // if(req.params.user_id)
    cb(null, 'public/image/user');
  },

  filename: (req, file, cb) => {
    if (req.params.client_id) {
      cb(null, `client-${req.params.client_id}-avatar.jpeg`); // edit filename
    }
    if (req.params.user_id) {
      cb(null, `user-${req.params.user_id}-avatar.jpeg`); // edit filename
    }
  },
});

const fileFilter = (req, file, cb) => {
  // eslint-disable-next-line eqeqeq
  if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
    cb(null, true);
  } else {
    cb(new AppError('Unsupported file format', 400), false);
  }
};

exports.upload = multer({
  storage: fileStorage,
  fileFilter,
});
