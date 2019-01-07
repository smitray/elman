import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import timestamp from 'mongoose-timestamp';
import { Crud } from '@utl';
import { gql } from 'apollo-server-koa';

import { authorCrud } from './author.graph';

const { ObjectId } = mongoose.Types;
/**
 * Mongoose schema, model and service
 */

const bookSchema = new mongoose.Schema({
  name: String,
  genre: String,
  authorId: ObjectId
});

bookSchema.plugin(uniqueValidator);
bookSchema.plugin(timestamp);

const bookModel = mongoose.model('Book', bookSchema);
const bookCrud = new Crud(bookModel);

/**
 * GraphQL type definitions, mutations, resolvers
 */

const bookDefs = gql`

  type Book {
    _id: String,
    name: String,
    genre: String,
    authorId: String,
    author: Author
  }

  extend type Query {
    books: [Book],
    book(_id: String): Book
  }

  extend type Mutation {
    createBook(name: String, genre: String, authorId: String): Book
  }

`;

const bookResolvers = {
  Query: {
    books: async () => {
      try {
        const books = await bookCrud.get();
        return books;
      } catch (err) {
        throw new Error(err);
      }
    },
    book: async (root, { _id }) => {
      try {
        const book = await bookCrud.single({
          qr: {
            _id
          }
        });
        return book;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Book: {
    author: async ({ authorId }) => {
      try {
        const author = await authorCrud.single({
          qr: {
            _id: authorId
          }
        });
        return author;
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    createBook: async (root, { name, genre, authorId }) => {
      try {
        const newBook = await bookCrud.create({
          name,
          genre,
          authorId
        });
        return newBook;
      } catch (err) {
        throw new Error(err);
      }
    }
  }
};

export {
  bookDefs,
  bookResolvers,
  bookModel,
  bookCrud
};
