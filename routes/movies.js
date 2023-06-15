import express from 'express';

import {
  deleteMovieId,
  getMovies,
  createMovie,
} from '../controllers/movies.js';
import { movieJoi, createMovieJoi } from '../middlewares/celebrate.js';

const MovieRouter = express.Router();

MovieRouter.get('/', getMovies);
MovieRouter.delete('/:_id', movieJoi, deleteMovieId);
MovieRouter.post('/', createMovieJoi, createMovie);

export default MovieRouter;
