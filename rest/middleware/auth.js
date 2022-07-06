const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const jwt = require('jsonwebtoken');
// const rateLimit = require('express-rate-limit');
const AppError = require('../utils/ErrorHandler/appError');
const catchAsync = require('../utils/ErrorHandler/catchAsync');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
require('dotenv').config();

exports.protectingRoutes = catchAsync(async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith('Bearer') &&
    req.headers.authorization.split(' ')[1];

  if (!token || token === 'null') {
    return next(new AppError('You are not logged in', 401));
  }
  const decoded = await jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findOne({
    attributes: { exclude: ['password', 'countLogin'] },
    where: { id: decoded.id },
  });
  if (!user) {
    return next(new AppError('this user does not exist', 401));
  }

  req.user = user;
  next();
});

// exports.loginLimiter = rateLimit({
//   windowMs: 3 * 60 * 1000, // 3 minutes
//   max: process.env.NODE_ENV === 'test' ? 100 : 5,
//   message: 'Something went wrong , try again after 3 minutes',
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

exports.authUser = catchAsync(async passport => {
  passport.serializeUser((user,done) => {
    done(null,user);
  })
  passport.deserializeUser((user,done) => {
    done(null,user);
  })
  passport.use('login', new LocalStrategy({usernameField: 'email'},
    async function(email,password,done) {
      const result = await prisma.admin.findFirst({
        where: {email},
      })
      .then(async(user) => {
        if(!user) return done(null,false, {message: 'Wrong email'});
        let passport = await bcrypt.compare(password, user.password);
        if(!passport) return done(null,false, {message: 'Wrong password'});
        return done(null,user)
      })
    }
  ))
})

exports.protectingRoutes = catchAsync(async(req,res,next)=> {
  if(!req.isAuthenticated()) return res.status(401).json({message: 'No Authentication'});
  next();
})