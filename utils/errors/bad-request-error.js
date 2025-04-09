const CustomError = require('./custom-error');

class BadRequestError extends CustomError {
  constructor(message = "Bad request in data or syntax.") {
    super(message, 400);
  }
}

module.exports = BadRequestError;