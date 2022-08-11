const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const session = require('express-session');
const passport = require('passport');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const context = require('./services/context.services');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const routes = require('./rest/routes');
const getErrorCode = require('./utils/ErrorHandler/getCodeError');
const viewEngine = require('./rest/config/viewEngine');
require('dotenv').config();
// const cron = require('node-cron');
// const reminder = require('./utils/reminder');

const app = express();
// cron.schedule('*/3 * * * * *', reminder);// reminder

// middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: '50mb' }));
app.use(session({
  secret: 'key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 },
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
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
  formatError(err) {
    console.log('🚀 ~ file: server.js ~ line 59 ~ formatError ~ err', err[0]);
    if (err.message.startsWith('Database Error: ')) {
      return new Error('Internal server error');
    }
    if (!err.originalError) {
      return err;
    }
    // error code
    const customError = err.message.slice(7);
    const error = getErrorCode(customError) || err.extensions.validationError || err;
    // error in validation
    console.log('err.extensions.validationError', err.extensions.validationError);
    return ({ message: error.message || error, statusCode: error.statusCode });
    // return err;
  },
});

async function startServer() {
  app.use(graphqlUploadExpress());
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
}
startServer();

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
