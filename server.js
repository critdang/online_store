// const { ApolloServer } = require('apollo-server');
const { ApolloServer } = require('apollo-server-express') ;
const context = require('./services/context.services');
const express = require('express'); 
const { createServer } = require('http');
const cors = require('cors');
const cron = require('node-cron');
const routes = require('./rest/routes')
// import all type definitions
const typeDefs = require('./src/graphql/typeDefs');
// import all resolvers
const resolvers = require('./src/graphql/resolvers');
const app = express();
const passport = require('passport');
const session = require('express-session');
const viewEngine = require('./rest/config/viewEngine');
require('dotenv').config();
const userRoutes = require('./rest/routes/user.route');
const reminder = require('./utils/reminder');
// reminder
// cron.schedule('*/3 * * * * *', reminder);

// import CORS
// app.use(cors) //why doesn't need this one

// middleware
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(session({secret: 'key'}));

app.set('view engine', 'ejs');
app.use(cors());
// import viewEngine for ejs
viewEngine(app);

//route REST
app.use("/", routes);

// passport
app.use(express.static('public')); // secret key for session
app.use(passport.initialize());
app.use(passport.session());
// Mount GraphQL
const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
    context,
    playground: true,
    introspection: true,
    formatError(err) {
      if(!err.originalError) {
        return err
      }
      const data = err.originalError.data;
      const message = err.message || 'An error occurred ';
      const code = err.originalError.code || 500;
      return {message: message, status: code, data: data};
    }
  });
  
apolloServer.applyMiddleware({ app, path: '/graphql' });
const port = process.env.PORT || 4001;
  
// const server = createServer(app);
// server.listen({ port }, () => console.log(
//   `🚀 Server REST ready at http://localhost:${port}` 
// ));

app.listen(port, () => console.log(`Server started at http://localhost:${port}`));

  
// module.exports = server;

