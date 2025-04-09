const CustomError = require('./custom-error');

class UnauthorizedError extends CustomError {
  constructor(message = "Authorization Error!") {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;