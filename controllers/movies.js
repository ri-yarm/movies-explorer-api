import mongoose from 'mongoose';
import Movie from '../models/movie.js';
import BadReqestError from '../utils/instanceOfErrors/badRequestError.js';
import NotFoundError from '../utils/instanceOfErrors/notFoundError.js';
import ForbiddenError from '../utils/instanceOfErrors/forbiddenError.js';

/** Получение всех карточек */
export const getMovies = (req, res, next) => {
  const currentUserId = req.user._id;
  Movie.find({ owner: currentUserId })
    .then((movie) => res.send(movie))
    .catch(next);
};

export const deleteMovieId = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail()
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Удалять можно только свои карточки.');
      }
      return movie;
    })
    .then((movie) => Movie.deleteOne(movie))
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return next(new NotFoundError('Карточка с указанным id не найдена.'));
      }
      if (err instanceof mongoose.Error.CastError) {
        return next(new BadReqestError('Не валидные данные для поиска.'));
      }
      return next(err);
    });
};

export const createMovie = (req, res, next) => {
  Movie.create({ ...req.body, owner: req.user._id })
    .then((item) => res.send(item))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadReqestError(
            'Переданы некорректные данные при создании карточки.',
          ),
        );
      }
      return next(err);
    });
};
