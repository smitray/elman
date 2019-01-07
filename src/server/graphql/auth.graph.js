import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import timestamp from 'mongoose-timestamp';
import { genSaltSync, hashSync } from 'bcryptjs';
import { Crud } from '@utl';
import { gql } from 'apollo-server-koa';
import { userCrud } from './user.graph';

/**
 * Mongoose schema and model
 */

const accountSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    default: null
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    default: 'unverified'
  },
  accType: {
    type: String,
    default: 'user'
  },
  jwt: {
    type: String,
    default: null
  },
  socialId: {
    type: String,
    default: null
  },
  socialToken: {
    type: String,
    default: null
  }
});

accountSchema.pre('save', function hashPass(next) {
  const account = this;
  let hash;
  if (this.isModified('password') || this.isNew) {
    if (account.password) {
      try {
        const salt = genSaltSync();
        hash = hashSync(account.password, salt);
      } catch (e) {
        return next(e);
      } finally {
        account.password = hash;
      }
    }
  }
  return next();
});

accountSchema.plugin(uniqueValidator);
accountSchema.plugin(timestamp);

const accountModel = mongoose.model('accountModel', accountSchema);

/**
 * Service for the model
 */

class AccountService extends Crud {
  // constructor(model) {
  //   super(model);
  // }
}

const accountCrud = new AccountService(accountModel);

/**
 * GraphQL type definitions, mutations, resolvers
 */

const accountDefs = gql`

  type Account {
    _id: String,
    username: String,
    email: String,
    accType: String,
    token: String,
    user: User
  }

  extend type Query {
    accounts(accType: String): [Account],
    account(_id: String!): Account
  }

  type Mutation {
    createAccount(
      username: String!,
      email: String!,
      password: String!,
      accType: String
    ): Account
    updatePassword(
      password: String!
    ): Account
    deleteAccount(
      _id: String!
    ): Account
    login(
      username: String!,
      password: String!
    ): Account
    socialLogin(
      username: String!,
      email: String!,
      socialId: String!,
      socialToken: String!
    ): Account
  }

`;

const accountResolvers = {
  Query: {
    accounts: async (root, { accType = 'user' }) => {
      try {
        const accounts = await accountCrud.get({
          qr: {
            accType
          }
        });
        return accounts;
      } catch (err) {
        throw new Error(err);
      }
    },
    account: async (root, { _id }) => {
      try {
        const account = await accountCrud.single({
          qr: {
            _id
          }
        });
        return account;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Account: {
    user: async ({ _id }) => {
      try {
        const user = await userCrud.single({
          accountId: _id
        });
        return user;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};


export {
  accountModel,
  accountCrud,
  accountDefs,
  accountResolvers
};
