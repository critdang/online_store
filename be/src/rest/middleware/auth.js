const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// const rateLimit = require('express-rate-limit');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const passport = require('passport');
const catchAsync = require('../../utils/ErrorHandler/catchAsync');
require('dotenv').config();

// exports.loginLimiter = rateLimit({
//   windowMs: 3 * 60 * 1000, // 3 minutes
//   max: process.env.NODE_ENV === 'test' ? 100 : 5,
//   message: 'Something went wrong , try again after 3 minutes',
//   standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//   legacyHeaders: false, // Disable the `X-RateLimit-*` headers
// });

exports.authUser = catchAsync(async (passsport) => {
  passport.serializeUser((user, done) => {
    done(null, user.id);
  });
  passport.deserializeUser(async (id, done) => {
    // eslint-disable-next-line no-unused-vars
    const existAdmin = await prisma.admin.findUnique({ where: { id } }).then((user) => {
      done(null, user);
    }).catch((err) => {
      console.log(err);
    });
  });
  passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    (async (email, password, done) => {
      const result = await prisma.admin.findFirst({
        where: { email },
      });
      if (!result) return done(null, false, { message: 'Wrong email' });
      const existUser = await bcrypt.compare(password, result.password);
      if (!existUser) return done(null, false, { message: 'Wrong password' });
      return done(null, result);
    }),
  ));
});

exports.protectingRoutes = catchAsync(async (req, res, next) => {
  if (!req.isAuthenticated()) return res.status(401).json({ message: 'No Authentication' });
  next();
});
