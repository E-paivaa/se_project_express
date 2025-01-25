const User = require("../models/user");
const { SUCCESS, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

  const getUsers = (req, res) => {
    User.find({})
      .then((users) => res.status(SUCCESS).json(users))
      .catch((err) => res.status(SERVER_ERROR).json({ message: err.message }));
  };
  
  const createUser = (req, res) => {
    const { name, avatar } = req.body;
  
    User.create({ name, avatar })
      .then((user) => res.status(SUCCESS).json(user))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          return res.status(BAD_REQUEST).json({ message: err.message });
        }
        return res.status(SERVER_ERROR).json({ message: err.message });
      });
  };
  
  const getUser = (req, res) => {
    const { userId } = req.params;
    User.findById(userId)
      .orFail()
      .then((user) => res.status(SUCCESS).json(user))
      .catch((err) => {
        if (err.name === 'DocumentNotFoundError') {
          return res.status(NOT_FOUND).json({ message: err.message });
        }
        if (err.name === 'CastError') {
          return res.status(BAD_REQUEST).json({ message: err.message });
        }
        return res.status(SERVER_ERROR).json({ message: err.message });
      });
  };
  
  module.exports = { getUsers, createUser, getUser };