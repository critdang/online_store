const { parse } = require('path'); // This is node built in package
require('dotenv').config();

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

const uploadStreamOneImg = async (file) => new Promise(async (resolve, reject) => {
  const { createReadStream, filename } = await file;

  const stream = createReadStream();
  const { name } = parse(filename);
  const imageName = `${name}-${Date.now()}`;

  const cld_upload_stream = cloudinary.uploader.upload_stream(
    {
      folder: 'foo',
      public_id: imageName,
      format: 'jpg',
    },
    (error, result) => {
      console.log(error);
      if (result) resolve(result);
      if (error) reject(error);
    },
  );
  stream.pipe(cld_upload_stream);
  console.log('ggygvy', file);
});

module.exports.uploadImageFunc = async (file) => {
  const result = await uploadStreamOneImg(file);
  return result.url;
};
