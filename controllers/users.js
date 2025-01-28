const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { JWT_SECRET } = require("../utils/config");
const { ERROR_CODES, ERROR_MESSAGES } = require("../utils/errors");

const createUser = async (req, res) => {
  const { name, avatar, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(ERROR_CODES.DUPLICATE_ERROR)
        .json({ message: "User with this email already exists." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
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
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .json({ message: ERROR_MESSAGES.BAD_REQUEST });
  }
  return res
    .status(ERROR_CODES.SERVER_ERROR)
    .json({ message: ERROR_MESSAGES.SERVER_ERROR });
}
};

const login = (req, res) => {

  const { email, password } = req.body;
  if (!email || !password) { 
    return res.status(ERROR_CODES.BAD_REQUEST).send({message:ERROR_MESSAGES.BAD_REQUEST});
   }

  return User.findUserByCredentials(email, password)
  .then((u) => {
    const token = jwt.sign({ _id: u._id }, JWT_SECRET, { expiresIn: "7d" });
    res.send({ token });
  })
  .catch((err) => {
    if (err.message === "Incorrect email or password") {
      return res.status(ERROR_CODES.UNAUTHORIZED).send({ message: err.message });
    }
    return res
      .status(ERROR_CODES.SERVER_ERROR)
      .json({ message: ERROR_MESSAGES.SERVER_ERROR });
  });
};

// Current User
const getCurrentUser = (req, res) => {
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
        return res
          .status(ERROR_CODES.NOT_FOUND)
          .send({ message: ERROR_MESSAGES.NOT_FOUND });
      }

      if (err.name === "CastError") {
        return res
          .status(ERROR_CODES.BAD_REQUEST)
          .send({ message: ERROR_MESSAGES.INVALID_ID});
      }

      return res
        .status(ERROR_CODES.SERVER_ERROR)
        .send({ message: ERROR_MESSAGES.SERVER_ERROR });
    });
  };

    const updateCurrentUser = (req, res) => {
      const userId = req.user._id;
      const { avatar, name } = req.body;
    
      User.findByIdAndUpdate(
        { _id: userId },
        { avatar, name },
        { new: true, useFindAndModify: false, runValidators: true },
      )
        .then((updatedUser) => {
          if (!updatedUser) {
            return res.status(ERROR_CODES.NOT_FOUND).send({ message: "User not found" });
          }
          return res.status(200).send({ data: updatedUser });
        })
        .catch((error) => {
          if (error.name === "ValidationError") {
            return res.status(ERROR_CODES.BAD_REQUEST).send({ message: "Validation error" });
          }
          return res
            .status(ERROR_CODES.SERVER_ERROR)
            .send({ message: "Error updating user, action not complete" });
        });
    };
    
    module.exports = {
      createUser,
      login,
      getCurrentUser,
      updateCurrentUser,
    };