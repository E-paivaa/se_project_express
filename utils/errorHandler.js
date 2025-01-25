const { ERROR_CODES, ERROR_MESSAGES } = require("./errors");

const handleError = (err, res) => {
  console.error(err);

  if (err.name === "ValidationError") {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.BAD_REQUEST });
  }

  if (err.name === "CastError") {
    return res
      .status(ERROR_CODES.BAD_REQUEST)
      .send({ message: ERROR_MESSAGES.INVALID_ID });
  }

  if (err.name === "DocumentNotFoundError") {
    return res
      .status(ERROR_CODES.NOT_FOUND)
      .send({ message: ERROR_MESSAGES.NOT_FOUND });
  }

  return res
    .status(ERROR_CODES.SERVER_ERROR)
    .send({ message: ERROR_MESSAGES.SERVER_ERROR });
};

module.exports = handleError;