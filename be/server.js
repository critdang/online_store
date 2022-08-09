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
  csrfPrevention: true,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
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
    const customError = err.message.slice(7);
    console.log('🚀 ~ file: server.js ~ line 70 ~ formatError ~ customError', customError);

    const error = getErrorCode(customError);
    console.log('err message', err.message);
    return ({ message: error.message, statusCode: error.statusCode });
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
