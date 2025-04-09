const CustomError = require('./custom-error');

class NotFoundError extends CustomError {
  constructor(message = "The request was sent to a non-existent address.") {
    super(message, 404);
  }
}

module.exports = NotFoundError;