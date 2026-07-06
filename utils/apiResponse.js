const success = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data,
  });
};

const error = (res, message, statusCode = 500, details) => {
  const body = {
    success: false,
    error: {
      message,
    },
  };

  if (details) {
    body.error.details = details;
  }

  return res.status(statusCode).json(body);
};

module.exports = {
  success,
  error,
};
