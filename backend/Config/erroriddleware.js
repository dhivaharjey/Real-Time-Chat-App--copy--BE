import dotenv from "dotenv";
dotenv.config();

export const notFound = async (req, res, next) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  next(error);
};

// export const errorHandler = (err, req, res, next) => {
//   const statusCode =
//     res.statusCode === 200 ? 500 : requestAnimationFrame.statusCode;
//   res.status(statusCode);
//   res.json({
//     message: err.message,
//     stack: process.env.NODE_ENV === "production" ? null : err.stack,
//   });
// };
export const errorHandler = (err, req, res, next) => {
  // Set the status code to 500 if it isn't already set to a successful status code (200)
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Use res.statusCode instead of requestAnimationFrame.statusCode
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack, // Provide stack trace only in development
  });
};
