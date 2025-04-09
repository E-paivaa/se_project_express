const CustomError = require('./custom-error');

class ConflictError extends CustomError {
  constructor(message =  "User with this email already exists.") {
    super(message, 409);
  }
}

module.exports = ConflictError;