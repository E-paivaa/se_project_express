const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_MESSAGES } = require("../utils/errors");
const NotFoundError = require('../utils/errors/not-found-error');
const BadRequestError = require('../utils/errors/bad-request-error');
const ServerError = require('../utils/errors/server-error');
const ConflictError = require('../utils/errors/conflict-error');
const UnauthorizedError = require("../utils/errors/unauthorized-error");

const createUser = (req, res, next) => {
  const { name, avatar, email, password } = req.body;

  try {
    const existingUser = User.findOne({ email });
    if (existingUser) {
      return next(new ConflictError);
    }

    const hashedPassword = bcrypt.hash(password, 10);

    const user = User.create({
      name,
      avatar,
      email,
      password: hashedPassword,
    });

    const userData = {
      _id: user._id,
      name: user.name,
      avatar: user.avatar,
      email: user.email,
    };

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });

    return res
    .status(200)
    .json({ message: "User created successfully", data: userData, token });
} catch (err) {
  if (err.name === "ValidationError") {
    return next(new BadRequestError);
  } else if (err.code === 11000) {
    return next(new ConflictError);
  } else {
    return next(new ServerError);
  }
};
};

const login = (req, res, next) => {

  const { email, password } = req.body;
  if (!email || !password) { 
    return next(new BadRequestError);
   }

  return User.findUserByCredentials(email, password)
  .then((u) => {
    const token = jwt.sign({ _id: u._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  })
  .catch((err) => {
    if (err.message === "Incorrect email or password") {
      return next(new UnauthorizedError);
    }
    return next(new ServerError);
  });
};

// Current User
const getCurrentUser = (req, res, next) => {
  const userId  = req.user._id;

  User.findById(userId)
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((user) => {
      const { _id, email, name, avatar } = user;
      res.send({
        _id,
        email,
        name,
        avatar,
      });
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError);
      }

      if (err.name === "CastError") {
        return next(new BadRequestError({ message: ERROR_MESSAGES.INVALID_ID }));
      }

      return next(new ServerError);
    });
  };

    const updateCurrentUser = (req, res, next) => {
      const userId = req.user._id;
      const { avatar, name } = req.body;
    
      User.findByIdAndUpdate(
        { _id: userId },
        { avatar, name },
        { new: true, useFindAndModify: false, runValidators: true },
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return next(new NotFoundError);
          }
          return res.status(200).send({ data: updatedUser });
        })
        .catch((error) => {
          if (error.name === "ValidationError") {
            return next(new BadRequestError);
          }
          return next(new ServerError);
        });
    };
    
    module.exports = {
      createUser,
      login,
      getCurrentUser,
      updateCurrentUser,
    };