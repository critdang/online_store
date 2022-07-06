const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer =  require('nodemailer');
const fs = require("fs");
const ejs = require("ejs");
const moment = require("moment");
// eslint-disable-next-line arrow-body-style
exports.comparePassword = async (inputPassword, outputPassword) => {
  return bcrypt.compare(inputPassword, outputPassword);
};

exports.generateToken = (key,time) => {
  return jwt.sign(key, process.env.JWT_SECRET, {
      expiresIn: time, 
  });
};

exports.verifyToken = (key) => {
  return jwt.verify(key, process.env.JWT_SECRET, (err,decoded) =>{
    if(err) throw err;
  });
}

exports.returnSuccess = (req,res,data = "success") => {
  res.status(200).json({
    status: 'success',
    data:data,
  });
}

exports.returnFail = (req,res,err) => {
  res.status(404).json({
    status: 'fail',
    err:err,
  });
};

// eslint-disable-next-line arrow-body-style
exports.hashPassword = async (inputPassword) => {
  return bcrypt.hash(inputPassword, 8);
};

let transport = nodemailer.createTransport({
  host: "smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASS
  }
});

exports.sendMail = async (
  email,
  subject,
  text,
  endpoint = '/',
  token = ''
) => {
  const domain = `http://localhost:${process.env.PORT}`;

  const transporter = nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.AUTH_USER,
      pass: process.env.AUTH_PASS
    }
  });
  const mailOption = {
    from: process.env.EMAIL,
    to: email,
    subject,
    html: `<a href=${domain + endpoint + token} target="_blank">${text}</a>`, 
  };
  await transporter.sendMail(mailOption);
}
exports.reminderCart = async (username, to, products) => {
  let temp = products.map(product =>
      `<tr>
      <td>${product.product.name}</td>
      <td>${product.product.name}</td>
      <td>${product.product.price}</td>
      </tr>` 
    )
  temp = temp.toString().split(',').join('');
  await transport.sendMail({
    from: "critdang@gmail.com",
    to,
    subject: "Remind product in cart",
    text: `Dear ${username}, you have some product in your cart`,
      html: `<table style="width:100%;border:1px solid #bbbbbb;">
                      <tr>
                          <th style="border:1px solid #bbbbbb;">Product name</th>
                          <th style="border:1px solid #bbbbbb;">Quantity</th>
                          <th style="border:1px solid #bbbbbb;">Price</th>
                      </tr>
                      ${temp}
              </table>`

  })
}

exports.createOrder = async(to,orders) => {
  const style = 'border:1px solid #bbbbbb';
  const parseOrder = orders.map(item =>( {
    ...item,
    paymentDate: moment(item.paymentDate).format('YYYY-MM-DD')
    
  }))
  const data = await ejs.renderFile("views/order.ejs", { orders: parseOrder});
  transport.sendMail({
    from: "critdang@gmail.com",
    to,
    subject: "Order completed",
    text: `Dear customer ${to}, This is your ${orders}`,
    html: data
  },(err,info) => {
    if(err) {
      console.log(err);
    } else {
      console.log('Message sent:' + info.response);
    }
  })
}

exports.forgotPassword = async(to, token) => {
  await transport.sendMail({
    from: "critdang@gmail.com",
    to,
    subject: "Reset Password",
    text: "Dear customer",
    html:  `<h2><a href='http://localhost:${process.env.PORT}/users/${to}/${token}/reset-password'>click here to reset password</a></h2>`
  })
};