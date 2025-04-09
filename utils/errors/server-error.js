const CustomError = require('./custom-error');

class ServerError extends CustomError {
    constructor(message = "An error has occurred on the server.") {
      super(message, 500);
    }
  }

module.exports = ServerError;