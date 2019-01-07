import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import timestamp from 'mongoose-timestamp';
import { Crud } from '@utl';
import { gql } from 'apollo-server-koa';
import { accountCrud } from './auth.graph';

const { ObjectId } = mongoose.Types;

const userSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  avatar: String,
  accountId: ObjectId
});

userSchema.plugin(uniqueValidator);
userSchema.plugin(timestamp);

const userModel = mongoose.model('userModel', userSchema);

class UserService extends Crud {
  // constructor(model) {
  //   super(model);

  // }
}

const userCrud = new UserService(userModel);

const userDefs = gql`

  type User {
    _id: String,
    firstName: String,
    lastName: String,
    avatar: File,
    accountId: String,
    account: Account
  }

  extend type Query {
    user(
      _id: String!
    ): User
  }

`;

const userResolvers = {
  Query: {
    user: async (root, { _id }) => {
      try {
        const user = await userCrud.single({
          qr: {
            _id
          }
        });
        return user;
      } catch (error) {
        throw new Error(error);
      }
    }
  },
  User: {
    account: async ({ accountId }) => {
      try {
        const account = await accountCrud.single({
          qr: {
            _id: accountId
          }
        });
        return account;
      } catch (error) {
        throw new Error(error);
      }
    }
  }
};

export {
  userModel,
  userCrud,
  userDefs,
  userResolvers
};
