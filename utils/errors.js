const ERROR_CODES = {
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  DUPLICATE_ERROR: 409,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403
};

const ERROR_MESSAGES = {
  BAD_REQUEST: "Bad request in data or syntax.",
  NOT_FOUND: "The request was sent to a non-existent address.",
  SERVER_ERROR: "An error has occurred on the server.",
  INVALID_ID: "Invalid ID.",
  MISSING_OWNER: "Owner ID is missing from the request.",
  MISSING_FIELDS: "Missing required fields: name, weather, imageUrl.",
  CARD_REMOVAL: "You are not allowed to delete this item.",
  DUPLICATE_ERROR: "User with this email already exists.",
  UNAUTHORIZED: "Authorization Error!"
};

module.exports = { ERROR_CODES, ERROR_MESSAGES };