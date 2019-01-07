import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import timestamp from 'mongoose-timestamp';
import { Crud } from '@utl';

const filesSchema = new mongoose.Schema({
  filename: {
    type: String,
    required: true
  },
  permalink: {
    type: String,
    required: true
  },
  thumbnail: {
    type: String,
    required: true
  }
});

filesSchema.plugin(uniqueValidator);
filesSchema.plugin(timestamp);

const filesModel = mongoose.model('filesModel', filesSchema);
const filesCrud = new Crud(filesModel);

export {
  filesCrud,
  filesModel
};
