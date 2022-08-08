const multer = require('multer');

const AppError = require('../../utils/ErrorHandler/appError');
require('dotenv').config();

// setting for image upload
// const fileStorage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // cb(null, 'public/image/client');
//     // if(req.params.user_id)
//     cb(null, 'public/image/user');
//   },

//   filename: (req, file, cb) => {
//     if (req.params.client_id) {
//       cb(null, `client-${req.params.client_id}-avatar.jpeg`); // edit filename
//     }
//     if (req.params.user_id) {
//       cb(null, `user-${req.params.user_id}-avatar.jpeg`); // edit filename
//     }
//   },
// });

// const fileFilter = (req, file, cb) => {
//   // eslint-disable-next-line eqeqeq
//   if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') {
//     cb(null, true);
//   } else {
//     cb(new AppError('Unsupported file format', 400), false);
//   }
// };

// exports.upload = multer({
//   storage: fileStorage,
//   fileFilter,
// });
