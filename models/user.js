/* eslint-disable func-names */
import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import UnAuthorizedError from '../utils/instanceOfErrors/unAuthorizedError.js';

/** Схема пользователя. в массиве, второе значение для ответа пользователю */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, 'Минимальная длина поля - 2'],
      maxlength: [30, 'Максимальная длина поля - 2'],
      required: true,
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return validator.isEmail(v);
        },
        message: 'Некорректный Email',
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
  {
    versionKey: false,
    statics: {
      /** Статический метод авторизации (банальный перебор по пользователям) */
      findUserByCredentials(email, password) {
        return this.findOne({ email })
          .select('+password')
          .then((user) => {
            if (!user) {
              return Promise.reject(
                new UnAuthorizedError('Неправильные почта или пароль'),
              );
            }

            return bcrypt.compare(password, user.password).then((matched) => {
              if (!matched) {
                return Promise.reject(
                  new UnAuthorizedError('Неправильные почта или пароль'),
                );
              }

              return user;
            });
          });
      },
      /** Статический метод обновления данных о профиле */
      changeUserProfile(id, data, res) {
        return this.findByIdAndUpdate(id, data, {
          new: true,
          runValidators: true,
        })
          .orFail()
          .then((user) => res.send(user));
      },
      /** Статический метод поиска пользователя
       * ! Внимание, используется для поиска пользователя как параметр,
       * ! и для обозначение себя как пользователя в запросе
       */
      getId(id, res) {
        return this.findById(id)
          .orFail()
          .then((user) => res.send(user));
      },
    },
  },
);

export default mongoose.model('user', userSchema);
