import { config } from 'dotenv';
config();

const notFound = (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  // console.log('This is the error', err);

  if (err.name === 'CastError' && err.kind === 'ObjectID') {
    statusCode = 404;
    message = 'Resource not found';
  }

  if (err.name === 'PayloadTooLargeError') {
    (statusCode = 400), (message = 'The image is too large for this action');
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
};

export { notFound, errorHandler };
