const protectedRoute = require("../../middlewares/protectedRoute");
const {
  getAllLaporan,
  getLaporanById,
  createLaporan,
  updateLaporan,
  deleteLaporan,
} = require("./laporanController");

// Membuat router yang terproteksi
const route = protectedRoute();

// Route yang membutuhkan autentikasi
route.get("/", getAllLaporan);
route.get("/:id", getLaporanById);
route.post("/", createLaporan);
route.put("/:id", updateLaporan);
route.delete("/:id", deleteLaporan);

module.exports = route;

