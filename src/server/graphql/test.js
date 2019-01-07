import { gql } from 'apollo-server-koa';

const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: (source, args, context) => {
      console.log(context);
      return 'Hello world!';
    }
  }
};

export {
  typeDefs,
  resolvers
};
