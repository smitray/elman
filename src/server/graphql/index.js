import {
  ApolloServer,
  gql
} from 'apollo-server-koa';
import { merge } from 'lodash';
import mongoose from 'mongoose';
import { verify } from 'jsonwebtoken';
import config from 'config';

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

const { 0: secret } = config.get('secret');

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
    context: async ({
      ctx: {
        request
      }
    }) => {
      if (request.headers.authorization) {
        const token = request.headers.authorization;
        if (token && token.split(' ')[0] !== 'Bearer') {
          throw new Error('Invalid Authorization Header');
        }
        const {
          authId,
          userId,
          accType
        } = verify(token.split(' ')[1], secret);
        return {
          authId,
          userId,
          accType
        };
      }
      return null;
    }
  });
  server.applyMiddleware({ app });
};

export {
  accountModel,
  accountCrud,
  userModel,
  userCrud
};
