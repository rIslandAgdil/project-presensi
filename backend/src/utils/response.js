const sendSuccess = (res, message, statusCode = 200, data) => {
  return res.status(statusCode).json({ success: true, message, ...data });
};

const sendError = (res, message, statusCode = 500, error) => {
  return res.status(statusCode).json({ success: false, message, error });
};

module.exports = { sendError, sendSuccess };
