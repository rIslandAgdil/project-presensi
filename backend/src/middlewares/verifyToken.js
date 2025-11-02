const jwt = require("jsonwebtoken");
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const { sendError } = require("../utils/response");

const verifyToken = async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return sendError(res, "Token tidak ditemukan", 400);
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error.message);
    return sendError(res, "Sesi berakhir. Silahkan login ulang", 401, error);
  }
};

module.exports = verifyToken;
