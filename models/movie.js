import mongoose from 'mongoose';
import validator from 'validator';

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v, { require_protocol: true, require_valid_protocol: true, protocols: ['http', 'https', 'ftp'] }),
      message: 'Некорректная ссылка на изображение',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v, { require_protocol: true, require_valid_protocol: true, protocols: ['http', 'https', 'ftp'] }),
      message: 'Некорректная ссылка на изображение',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (v) => validator.isURL(v, { require_protocol: true, require_valid_protocol: true, protocols: ['http', 'https', 'ftp'] }),
      message: 'Некорректная ссылка на изображение',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameEN: {
    type: String,
    required: true,
  },
}, { versionKey: false });

export default mongoose.model('movie', movieSchema);
