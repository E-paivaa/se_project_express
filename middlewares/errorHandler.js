const handleError = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  const message = statusCode === 500 ? 'An error has occured on the server.' : err.message;
  res.status(statusCode).send({ message });
  next();
  
};

module.exports = handleError;
