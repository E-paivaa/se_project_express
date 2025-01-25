const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request in data or syntax.",
  NOT_FOUND: "The request was sent to a non-existent address.",
  SERVER_ERROR: "An error has occurred on the server.",
  INVALID_ID: "Invalid ID.",
  MISSING_OWNER: "Owner ID is missing from the request.",
  MISSING_FIELDS: "Missing required fields: name, weather, imageUrl.",
  CARD_REMOVAL: "You are not allowed to delete this item.",
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };