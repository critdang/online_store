const { ApolloServer } = require('apollo-server-express');
const { graphqlUploadExpress } = require('graphql-upload');
const session = require('express-session');
const passport = require('passport');
// eslint-disable-next-line import/no-extraneous-dependencies
const { ApolloServerPluginLandingPageLocalDefault } = require('apollo-server-core');
const express = require('express');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
const context = require('./src/graphql/services/context.services');
const typeDefs = require('./src/graphql/typeDefs');
const resolvers = require('./src/graphql/resolvers');
const initRouters = require('./src/config/routerConfig');
const viewEngine = require('./src/rest/config/viewEngine');
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
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

const corsOptions = {
  origin: true,
};
app.use(cors(corsOptions));

// import viewEngine for ejs
viewEngine(app);

// route REST
initRouters(app);

// Mount GraphQL
const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context,
  csrfPrevention: false,
  cache: 'bounded',
  plugins: [
    ApolloServerPluginLandingPageLocalDefault({ embed: true }),
  ],
});

async function startServer() {
  app.use(graphqlUploadExpress());
  await apolloServer.start();
  apolloServer.applyMiddleware({ app, path: '/graphql' });
}
startServer();

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server started at http://localhost:${port}`));
