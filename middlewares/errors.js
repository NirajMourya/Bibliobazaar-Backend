const errorHandler = (err, req, res, next) => {
  // Log error for debugging
  console.error('Error:', err)

  if (typeof err === "string") {
    // custom application error
    return res.status(400).json({ message: err });
  }

  if (err.name === "ValidationError") {
    // mongoose validation error
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res.status(401).json({ message: "Token not valid" });
  }

  if (err.name === "CastError") {
    // mongoose cast error (invalid ID)
    return res.status(400).json({ message: "Invalid ID format" });
  }

  if (err.name === "MongoServerError" && err.code === 11000) {
    // mongoose duplicate key error
    const field = Object.keys(err.keyPattern)[0];
    return res.status(409).json({ message: `${field} already exists` });
  }

  if (err.statusCode) {
    // error with custom status code
    return res.status(err.statusCode).json({ message: err.message });
  }

  // default to 500 server error
  return res.status(500).json({ 
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error' 
  });
}

export { errorHandler }
