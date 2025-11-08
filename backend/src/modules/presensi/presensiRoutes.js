const protectedRoute = require("../../middlewares/protectedRoute");
const {
  getAllPresensi,
  getPresensiById,
  getPresensiByDate,
  upsertPresensi,
  deletePresensi,
} = require("./presensiController");

// Membuat router yang terproteksi
const route = protectedRoute();

// Route yang membutuhkan autentikasi
route.get("/", getAllPresensi);
route.get("/:id", getPresensiById);
// route.get("/:date", getPresensiByDate);
route.put("/:id", upsertPresensi);
route.delete("/:id", deletePresensi);

module.exports = route;
