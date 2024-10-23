const AppError = require("../utils/appError");

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value} `;

  return new AppError(message, 404);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);
  const message = `duplicate field value: ${value}, please use another value`;
  return new AppError(message, 400);
};

const handleVAlidationDB = (err) => {
  const message = `Invalid input data`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  // operational error , error we know
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      // error: err,
      message: err.message,
      // stack: err.stack,
    });
    // programming error or unknown error
  } else {
    console.log("ERROR", err);
    res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  // console.log(process.env.NODE_ENV)
  // process.env.NODE_ENV="production"
  // console.log(process.env.NODE_ENV)
  if ((process.env.NODE_ENV = "development")) {
    sendErrorDev(err, res);
  } else if ((process.env.NODE_ENV = "production")) {
    if (error.name == "CastError") error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);
    if (error.name === "validationError") error = handleVAlidationDB(error);
    let error = { ...err };
    sendErrorProduction(error, res);
  }
};
