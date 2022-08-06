// const { ApolloServer } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express');
const context = require('./services/context.services');
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
// import all type definitions
// import all resolvers
const resolvers = require('./src/graphql/resolvers');

const app = express();
const passport = require('passport');
const session = require('express-session');
const typeDefs = require('./src/graphql/typeDefs');
const routes = require('./rest/routes');
const viewEngine = require('./rest/config/viewEngine');
require('dotenv').config();
const reminder = require('./utils/reminder');
// reminder
// cron.schedule('*/3 * * * * *', reminder);

// middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: '50mb' }));
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
}));
// passport
app.use(express.static('public')); // secret key for session
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: true,
};
app.use(cors(corsOptions));
// import viewEngine for ejs
viewEngine(app);

// route REST
app.use('/', routes);

// Mount GraphQL
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  playground: true,
  introspection: true,

  formatError(err) {
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    }
    if (!err.originalError) {
      return err;
    }
    // const { data } = err.originalError;
    // const message = err.message || 'An error occurred.';
    // const code = err.originalError.code || 400;
    // return { message, status: code, data };
    return err;
  },
});

apolloServer.applyMiddleware({ app, path: '/graphql' });
const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
