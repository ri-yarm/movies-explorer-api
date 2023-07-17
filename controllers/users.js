/* eslint-disable consistent-return */
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { SALT } from "../utils/constant.js";
import BadReqestError from "../utils/instanceOfErrors/badRequestError.js";
import DuplicateError from "../utils/instanceOfErrors/duplicateError.js";
import NotFoundError from "../utils/instanceOfErrors/notFoundError.js";

/** Получение себя как пользователя */
export const getUserMe = (req, res, next) => {
  const { _id } = req.user;

  User.getId(_id, res).catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError("Пользователь с указанным id не найден."));
    }
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadReqestError("Не валидные данные для поиска."));
    }
    return next(err);
  });
};

/** Регистрация новго пользователя */
export const createUser = (req, res, next) => {
  const { name, email, password } = req.body;

  bcrypt.hash(password, SALT).then((hash) => {
    User.create({
      name,
      email,
      password: hash,
    })
      .then((user) =>
        res.send({
          name: user.name,
          email: user.email,
        })
      )
      .catch((err) => {
        // Вот этот хардкод ошибки 11000 меня злит, не нашёл инстанс ошибки
        if (err.code === 11000) {
          return next(
            new DuplicateError(
              "Пользователь с таким email уже был зарегистрирован."
            )
          );
        }
        if (err instanceof mongoose.Error.ValidationError) {
          return next(
            new BadReqestError(
              "Переданы некорректные данные при создании карточки."
            )
          );
        }
        return next(err);
      });
  });
};

export const login = (req, res, next) => {
  const { email, password } = req.body;

  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user.id },
        process.env.NODE_ENV === "production"
          ? process.env.JWT_SECRET
          : "dev-secret",
        {
          expiresIn: "7d",
        }
      );

      return res
        .cookie("jwt", token, {
          maxAge: 3600000,
          httpOnly: true,
          sameSite: "None",
          secure: false,
        })
        .send({ message: "Вы успешно получили куки." });
      // .send({ token });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        return next(
          new BadReqestError(
            "Переданы некорректные данные при обновлении аватара пользователя."
          )
        );
      }
      return next(err);
    });
};

export const logout = (req, res) => {
  res.clearCookie("jwt").send({ message: "Успешно удалили куки." });
};

/** Обновление данных о пользователе */
export const updateProfile = (req, res, next) => {
  const { name, email } = req.body;

  User.changeUserProfile(req.user._id, { name, email }, res).catch((err) => {
    if (err instanceof mongoose.Error.DocumentNotFoundError) {
      return next(new NotFoundError("Пользователь с указанным id не найден."));
    }
    if (err instanceof mongoose.Error.CastError) {
      return next(new BadReqestError("Не валидные данные для поиска."));
    }
    if (err instanceof mongoose.Error.ValidationError) {
      return next(
        new BadReqestError(
          "Переданы некорректные данные при обновлении профиля пользователя."
        )
      );
    }
    return next(err);
  });
};
