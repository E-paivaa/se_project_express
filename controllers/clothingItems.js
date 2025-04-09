const ClothingItem = require("../models/clothingItem");
const NotFoundError = require('../utils/errors/not-found-error');
const BadRequestError = require('../utils/errors/bad-request-error');
const ForbiddenError = require('../utils/errors/forbidden-error');
const ServerError = require('../utils/errors/server-error');
const handleError = require("../middlewares/errorHandler");
const { ERROR_MESSAGES } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user?._id;
  if (!owner) {
    console.error("Missing owner in request");
    next(new BadRequestError);
  }
  if (!name || !weather || !imageUrl) {
    next(new BadRequestError);
  }
  return ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => {
      console.info("Item created successfully:", item);
      return res.status(201).send({ data: item });
    })
    .catch((err) => handleError(err, res));
};

const getItems = (req, res) => {
  ClothingItem.find({})
    .then((items) => res.status(200).send({ data: items }))
    .catch((err) => handleError(err, res));
};

const deleteItem = async (req, res, next) => {
  const { itemId } = req.params;
  const userId = req.user._id;

  try {
    const item = await ClothingItem.findById(itemId).orFail(() => {
      const error = new Error(NotFoundError);
      error.name = "DocumentNotFoundError";
      throw error;
    });

    if (item.owner.toString() !== userId) {
      next(new ForbiddenError)
        .send({ message: ERROR_MESSAGES.CARD_REMOVAL });
    }

    await item.deleteOne();
    return res.status(200).send({ message: "Item deleted successfully." });
  } catch (err) {
    if (err.name === "CastError") {
      next(new ForbiddenError);
    }

    if (err.name === "DocumentNotFoundError") {
      next(new NotFoundError);
    }

    next(new ServerError);
  }
};

const likeItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error("Error liking item:", err);

      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError);
      }

      if (err.name === "CastError") {
        next(new BadRequestError)
          .send({ message: ERROR_MESSAGES.INVALID_ID });
      }

      next(new ServerError)
    });
};

const unlikeItem = (req, res, next) => {
  const { itemId } = req.params;
  ClothingItem.findByIdAndUpdate(
    itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail(() => {
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    })
    .then((item) => res.status(200).send({ data: item }))
    .catch((err) => {
      console.error("Error disliking item:", err);
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError);
      }

      if (err.name === "CastError") {
       next(new BadRequestError)
          .send({ message: ERROR_MESSAGES.INVALID_ID });
      }

      next(new ServerError);
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
