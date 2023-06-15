import { celebrate, Joi } from 'celebrate';

// eslint-disable-next-line no-useless-escape
const linkRegex = /(https?:\/\/)(w{3}\.)?(\w+[-.~:\/?#[\]@!$&'()*+,;=]*#?){3,}/;

// users

export const signupJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
    name: Joi.string().min(2).max(30),
  }),
});

export const loginJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(1),
  }),
});

export const updateProfileJoi = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    name: Joi.string().required().min(2).max(30),
  }),

});

export const userIdJoi = celebrate({
  params: Joi.object().keys({
    id: Joi.string().required().hex().length(24),
  }),
});

// cards

export const createMovieJoi = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().pattern(linkRegex),
    trailerLink: Joi.string().required().pattern(linkRegex),
    thumbnail: Joi.string().required().pattern(linkRegex),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
});

export const movieJoi = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().required().hex().length(24),
  }),
});
