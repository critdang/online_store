const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const moment = require('moment');
const Swal = require('sweetalert2');

// eslint-disable-next-line arrow-body-style
exports.comparePassword = async (inputPassword, outputPassword) => {
  return bcrypt.compare(inputPassword, outputPassword);
};

exports.generateToken = (key, time) => jwt.sign(key, process.env.JWT_SECRET, {
  expiresIn: time,
});
// exports.formatDay = (day) => moment(day, 'YYYY MM DD').toDate();
exports.formatDay = (day) => moment(new Date(day)).format('DD/MM/YYYY');

exports.verifyToken = (key) => jwt.verify(key, process.env.JWT_SECRET);

exports.swalNoti = (title, text, icon, confirmButtonText = 'OK') => {
  Swal.fire({
    title,
    text,
    icon,
    confirmButtonText,
  });
};

exports.returnSuccess = (req, res, message = 'success') => {
  res.status(200).json({
    message,
  });
};

exports.returnFail = (req, res, err = 'fail') => {
  res.status(400).json({
    err,
  });
};

const getKeyByValue = (object, value) => Object.keys(object).find((key) => object[key] === value);
const getErrorMessage = (code) => {
  const message = getKeyByValue(400, code);
  return message ? message.replace(/([A-Z])/g, ' $1').trim() : `${code}`;
};
exports.returnError = (res, errorCode = 101, data = {}) => {
  const code = Number(errorCode);
  let message = '';
  if (Number.isInteger(code)) message = getErrorMessage(code);
  else {
    message = errorCode;
  }
  return res.status(200).json({
    success: false,
    message,
    errorCode: code,
  });
};

// eslint-disable-next-line arrow-body-style
exports.hashPassword = async (inputPassword) => {
  return bcrypt.hash(inputPassword, 8);
};

const transport = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS,
  },
});

exports.sendMail = async (
  email,
  subject,
  text,
  endpoint = '/',
  token = '',
) => {
  const domain = 'http://localhost:3000';

  const transporter = nodemailer.createTransport({
    host: 'smtp.mailtrap.io',
    port: 2525,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS,
    },
  });
  const link = `${domain + endpoint + token}`;
  const data = await ejs.renderFile('./src/views/createVerifyNoti/verify.ejs', { link });

  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject,
    html: data,
  };
  await transporter.sendMail(mailOption);
};
exports.reminderCart = async (username, to, products) => {
  let temp = products.map((product) => `<tr>
      <td>${product.product.name}</td>
      <td>${product.product.name}</td>
      <td>${product.product.price}</td>
      </tr>`);
  temp = temp.toString().split(',').join('');
  await transport.sendMail({
    from: 'critdang@gmail.com',
    to,
    subject: 'Remind product in cart',
    text: `Dear ${username}, you have some product in your cart`,
    html: `<table style="width:100%;border:1px solid #bbbbbb;">
                      <tr>
                          <th style="border:1px solid #bbbbbb;">Product name</th>
                          <th style="border:1px solid #bbbbbb;">Quantity</th>
                          <th style="border:1px solid #bbbbbb;">Price</th>
                      </tr>
                      ${temp}
              </table>`,

  });
};

exports.createOrder = async (to, orders) => {
  const parseOrder = orders.map((item) => ({
    ...item,
    paymentDate: moment(item.paymentDate).format('DD/MM/YYYY'),
  }));
  console.log('🚀 ~ file: helperFn.js ~ line 137 ~ exports.createOrder= ~ orders', orders);
  const data = await ejs.renderFile('./src/views/createOrderNoti/order.ejs', { orders: parseOrder });
  transport.sendMail({
    from: 'critdang@gmail.com',
    to,
    subject: 'Order completed',
    text: `Dear customer ${to}, This is your ${orders}`,
    html: data,
  }, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(`Message sent:${info.response}`);
    }
  });
};
exports.forgotPassword = async (to, token) => {
  const link = `http://localhost:${process.env.FE_PORT}/forgotPassword/${token}`;
  const data = await ejs.renderFile('./src/views/createForgotPassNoti/forgotPassword.ejs', { link });

  await transport.sendMail({
    from: 'critdang@gmail.com',
    to,
    subject: 'Reset Password',
    text: 'Dear customer',
    html: data,
  });
};
