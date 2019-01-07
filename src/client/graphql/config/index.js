import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';


const graphUrl = 'http://localhost:3000/graphql';

export default ({ req }) => {
  const httpLink = new HttpLink({
    uri: graphUrl,
    credentials: 'same-origin'
  });

  const authLink = setContext((_, { headers }) => {
    let token;
    if (process.server) {
      let jwtToken;
      if (req.headers.cookie) {
        jwtToken = req.headers.cookie.split(';').find(c => c.trim().startsWith('accessToken='));
      }
      token = jwtToken || null;
    } else {
      // eslint-disable-next-line no-underscore-dangle
      token = window.__NUXT__.state ? window.__NUXT__.state.accessToken : null;
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : null
      }
    };
  });
  return {
    link: ApolloLink.from([authLink, httpLink]),
    cache: new InMemoryCache(),
    defaultHttpLink: false
  };
};
