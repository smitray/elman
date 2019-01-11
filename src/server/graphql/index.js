import { ApolloServer, gql } from 'apollo-server-koa';
import { merge } from 'lodash';
import mongoose from 'mongoose';


// import { typeDefs, resolvers } from './test';
// import {
//   authorDefs,
//   authorResolvers,
//   authorModel,
//   authorCrud
// } from './author.graph';

// import {
//   bookDefs,
//   bookResolvers,
//   bookModel,
//   bookCrud
// } from './book.graph';

import {
  accountModel,
  accountCrud,
  accountDefs,
  accountResolvers
} from './auth.graph';

import {
  userModel,
  userCrud,
  userDefs,
  userResolvers
} from './user.graph';

const { ObjectId } = mongoose.Types;

export const graphControl = (app) => {
  // eslint-disable-next-line func-names
  ObjectId.prototype.valueOf = function () {
    return this.toString();
  };

  const Query = gql`
    type Query {
      _empty: String
    }

    schema {
      query: Query
      mutation: Mutation
    }
  `;

  const server = new ApolloServer({
    typeDefs: [
      Query,
      accountDefs,
      userDefs
    ],
    resolvers: merge(
      accountResolvers,
      userResolvers
    ),
    context: ({ ctx }) => ctx
  });
  server.applyMiddleware({ app });
};

export {
  // authorModel,
  // authorCrud,
  // bookModel,
  // bookCrud
  accountModel,
  accountCrud,
  userModel,
  userCrud
};
