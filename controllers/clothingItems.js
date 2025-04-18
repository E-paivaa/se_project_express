const ClothingItem = require("../models/clothingItem");
const NotFoundError = require("../utils/errors/not-found-error");
const BadRequestError = require("../utils/errors/bad-request-error");
const ForbiddenError = require("../utils/errors/forbidden-error");
const ServerError = require("../utils/errors/server-error");
const handleError = require("../middlewares/errorHandler").default;
const { ERROR_MESSAGES } = require("../utils/errors");

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user?._id;
  if (!owner) {
    console.error("Missing owner in request");
    return next(new BadRequestError());
  }
  if (!name || !weather || !imageUrl) {
    return next(new BadRequestError());
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
      const error = new Error("DocumentNotFoundError");
      error.name = "DocumentNotFoundError";
      throw error;
    });

    if (item.owner.toString() !== userId) {
      return next(new ForbiddenError(ERROR_MESSAGES.CARD_REMOVAL));
    }

    await item.deleteOne();
    return res.status(200).send({ message: "Item deleted successfully." });
  } catch (err) {
    if (err.name === "CastError") {
      return next(new BadRequestError);
    }

    if (err.name === "DocumentNotFoundError") {
      return next(new NotFoundError());
    }

    return next(new ServerError());
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
        return next(new NotFoundError());
      }

      if (err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ID));
      }

      return next(new ServerError());
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
        return next(new NotFoundError());
      }

      if (err.name === "CastError") {
        return next(new BadRequestError(ERROR_MESSAGES.INVALID_ID));
      }

      return next(new ServerError());
    });
};

module.exports = {
  createItem,
  getItems,
  deleteItem,
  likeItem,
  unlikeItem,
};
