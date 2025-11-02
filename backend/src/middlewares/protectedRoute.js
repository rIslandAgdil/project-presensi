const { Router } = require("express");
const verifyToken = require("./verifyToken");

/**
 * Membuat router yang dilindungi dengan authentication
 * Semua route yang menggunakan router ini akan otomatis terproteksi dengan verifyToken
 * @returns {Router} Express router yang sudah terproteksi
 */

const protectedRoute = () => {
  const route = Router();
  route.use(verifyToken);
  return route;
};

module.exports = protectedRoute;
