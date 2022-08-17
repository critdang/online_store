const { parse } = require('path'); // This is node built in package
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// eslint-disable-next-line no-async-promise-executor
const uploadStreamOneImg = async (file) => new Promise(async (resolve, reject) => {
  const { createReadStream, filename } = await file;

  const stream = createReadStream();
  const { name } = parse(filename);
  const imageName = `${name}-${Date.now()}`;

  const cldUploadStream = cloudinary.uploader.upload_stream(
    {
      folder: 'foo',
      public_id: imageName,
      format: 'jpg',
    },
    (error, result) => {
      if (result) resolve(result);
      if (error) reject(error);
    },
  );
  stream.pipe(cldUploadStream);
});

module.exports.uploadImageFunc = async (file) => {
  const result = await uploadStreamOneImg(file);
  return result.url;
};
