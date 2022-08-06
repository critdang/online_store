const path = require('path');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const { promisify } = require('util');
const moment = require('moment');
require('dotenv').config();

// config cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// setting for image upload
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, 'public/image/client');
    // if(req.params.user_id)
    cb(null, 'public/image/product');
  },
  filename: (req, file, cb) =>
  // if(req.params.id){
  // cb(null, `${file.fieldname}-product-${req.params.id}-${Date.now()}.jpeg`);
  // }
  // if(req.route.path == '/category') {
  //   cb(null, `${file.fieldname}-category-${Date.now()}.jpeg`);
  // }
  // if(req.originalUrl == "/user") {
  //   cb(null, `${file.fieldname}-user-${Date.now()}.jpeg`);
  // }
    cb(null, `${file.fieldname}-draft-${Date.now()}.jpeg`),

});

const fileFilter = (req, file, cb) => {
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

// const removeFileAsync = promisify(fs.unlink);

exports.uploadImg = async (path) => {
  try {
    let res;
    res = await cloudinary.uploader.upload(path);
    // await removeFileAsync(path);
    return res.secure_url;
  } catch (error) {
    return error;
  }
};
