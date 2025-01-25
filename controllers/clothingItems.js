const ClothingItem = require('../models/clothingItem');
const { SUCCESS, BAD_REQUEST, NOT_FOUND, SERVER_ERROR } = require('../utils/errors');

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(SUCCESS).send(items))
    .catch((err) => res.status(SERVER_ERROR).send({ message: err.message }));
};

const createItem = (req, res) => {
  const { name, weather, imageURL, likes} = req.body;
  const owner = req.user._id;

ClothingItem.create({ name, weather, imageURL, owner, likes})
.then((item) => res.status(SUCCESS).send(item))
.catch((err) => {
  if (err.name === 'ValidationError') {
    return res.status( BAD_REQUEST).send({ message: err.message });
  }
  return res.status(SERVER_ERROR).send({ message: err.message });
});
};

const updateItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  ClothingItem.findByIdAndUpdate(itemId, { $set: {imageURL}})
    .orFail()
    .then((item) => res.status(SUCCESS).send({data:item}))
    .catch((err) => {
      if (err.name === 'ItemNotUpdatedError') {
        return res.status(NOT_FOUND).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;
  const { imageURL } = req.body;
  ClothingItem.findByIdAndDelete(itemId, { $set: {imageURL}})
    .orFail()
    .then((item) => res.status(SUCCESS).send({data:item}))
    .catch((err) => {
      if (err.name === 'ItemNotDeletedError') {
        return res.status(NOT_FOUND).send({ message: err.message });
      } if (err.name === 'CastError') {
        return res.status(BAD_REQUEST).send({ message: err.message });
      }
      return res.status(SERVER_ERROR).send({ message: err.message });
    });
  };

    const likeItem = (req, res) => {
      const { itemId } = req.params;
      ClothingItem.findByIdAndUpdate(
        itemId,
        { $addToSet: {likes: req.user._id} },
        { new: true }
      )
        .orFail()
        .then((item) => res.status(SUCCESS).send(item))
        .catch((e) => {
          if (e.name === "CastError") {
            return res
              .status(BAD_REQUEST)
              .send({ message: "Error form like items, Bad request." });
          }
          if (e.name === "DocumentNotFoundError") {
            return res
              .status(NOT_FOUND)
              .send({ message: "Error form like items, Page Not Found!." });
          }
          return res
            .status(SERVER_ERROR)
            .send({ message: "Error from like Items" });
        });
    };
    
    const unlikeItem = (req, res) => {
      const { itemId } = req.params;
    
      ClothingItem.findByIdAndUpdate(
        itemId,
        { $pull: { likes: req.user._id } },
        { new: true }
      )
        .orFail()
        .then((item) => res.status(SUCCESS).send(item))
        .catch((e) => {
          if (e.name === "CastError") {
            return res
              .status(BAD_REQUEST)
              .send({ message: "Error form unlike items, Bad request." });
          }
          if (e.name === "DocumentNotFoundError") {
            return res
              .status(NOT_FOUND)
              .send({ message: "Error form unlike items, Page Not Found!." });
          }
          return res
            .status(SERVER_ERROR)
            .send({ message: "Error from unlike Items" });
        });
};

module.exports = { getItems, createItem, updateItem, deleteItem, unlikeItem, likeItem };
