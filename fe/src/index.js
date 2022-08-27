import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { ApolloClient,createHttpLink, InMemoryCache, ApolloProvider, gql } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Provider } from 'react-redux';
import store from './store';
// const client = new ApolloClient({
//   uri: 'http://localhost:4007/graphql',
//   cache: new InMemoryCache(),
// });
const httpLink = createHttpLink({
  uri: 'http://localhost:4007/graphql',
});

const authLink = setContext((_, { headers }) => {

  // get the authentication token from local storage if it exists
  const user = localStorage.getItem('user');
  const token = user ? JSON.parse(user).token : "";
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
     <Provider store={store}>
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>,
    </Provider>
  </React.StrictMode>
);