import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import timestamp from 'mongoose-timestamp';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { Crud, generateJwt } from '@utl';
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
  constructor(model) {
    super(model);
    this.userCrud = userCrud;
  }

  async createAccount({
    firstName,
    lastName,
    username,
    email,
    password,
    accType
  }) {
    try {
      const account = await this.create({
        username,
        email,
        password,
        accType
      });
      const user = await this.userCrud.create({
        firstName,
        lastName,
        accountId: account._id
      });
      account.token = await generateJwt({
        authId: account._id,
        userId: user._id,
        accType
      });
      return account;
    } catch (err) {
      throw new Error(err);
    }
  }

  async login({
    username,
    password
  }) {
    try {
      const account = await this.single({
        qr: {
          $or: [{
            username
          }, {
            email: username
          }]
        }
      });
      if (!account) {
        throw new Error('No user found');
      } else if (account && !compareSync(password, account.password)) {
        throw new Error('Wrong credentials');
      }
      const user = await userCrud.single({
        qr: {
          accountId: account._id
        }
      });
      account.token = await generateJwt({
        authId: account._id,
        userId: user._id,
        accType: account.accType
      });
      return account;
    } catch (err) {
      throw new Error(err);
    }
  }
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
      firstName: String!,
      lastName: String!,
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
  },
  Mutation: {
    createAccount: (root, {
      firstName,
      lastName,
      username,
      email,
      password,
      accType = 'user'
    }) => {
      const account = accountCrud.createAccount({
        firstName,
        lastName,
        username,
        email,
        password,
        accType
      });
      return account;
    },
    login: (root, {
      username,
      password
    }) => {
      const account = accountCrud.login({
        username,
        password
      });
      return account;
    }
  }
};


export {
  accountModel,
  accountCrud,
  accountDefs,
  accountResolvers
};
