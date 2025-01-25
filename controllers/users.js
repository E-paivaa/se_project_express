const User = require('../models/user');
const { SUCCESS, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');


const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(SUCCESS).send(users))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

User.create({ name, avatar })
.then((user) => res.status(SUCCESS).send(user))
.catch((err) => {
  if (err.name === 'ValidationError') {
    return res.status(BAD_REQUEST).send({ message: err.message });
  }
  return res.status(SERVER_ERROR).send({ message: err.message });
});
};

const getUser = (req, res) => {
  const { _id: userId } = req.user;
  User.findById(userId)
    .orFail()
    .then((user) => res.status(SUCCESS).send({_id: user, name: user.name, avatar: user.avatar}))
    .catch((err) => {
      if (err.name === 'DocumentNotFoundError') {
        return res.status(NOT_FOUND).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

module.exports = { getUsers, createUser, getUser };
