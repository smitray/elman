import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import timestamp from 'mongoose-timestamp';
import { Crud } from '@utl';
import { gql } from 'apollo-server-koa';

import { bookCrud } from './book.graph';

/**
 * Mongoose schema, model and service
 */

const authorSchema = new mongoose.Schema({
  name: String,
  age: Number
});

authorSchema.plugin(uniqueValidator);
authorSchema.plugin(timestamp);

const authorModel = mongoose.model('Author', authorSchema);
const authorCrud = new Crud(authorModel);

/**
 * GraphQL type definitions, mutations, resolvers
 */

const authorDefs = gql`
  
  type Author {
    _id: String,
    name: String,
    age: Int,
    books: [Book]
  }

  extend type Query {
    authors: [Author],
    author(_id: String): Author
  }

  type Mutation {
    createAuthor(name: String, age: Int): Author
    updateAuthor(name: String, age: Int): Author
  }

`;

const authorResolvers = {
  Query: {
    authors: async () => {
      try {
        const authors = await authorCrud.get();
        return authors;
      } catch (error) {
        throw new Error(error);
      }
    },
    author: async (root, { _id }) => {
      try {
        const author = await authorCrud.single({
          qr: {
            _id
          }
        });
        return author;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Author: {
    books: async ({ _id }) => {
      try {
        const books = await bookCrud.get({
          qr: {
            authorId: _id
          }
        });
        return books;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    createAuthor: async (root, { name, age }) => {
      try {
        const newAuthor = await authorCrud.create({
          name,
          age
        });
        return newAuthor;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

export {
  authorDefs,
  authorResolvers,
  authorModel,
  authorCrud
};
