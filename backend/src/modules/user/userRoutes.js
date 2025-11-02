const protectedRoute = require("../../middlewares/protectedRoute");
const {
  createUser,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUser,
} = require("./userController");

// Membuat router yang terproteksi
const route = protectedRoute();

// Route yang membutuhkan autentikasi
route.get("/", getAllUsers);
route.get("/:id", getUserById);
route.post("/", createUser);
route.put("/:id", updateUser);
route.delete("/:id", deleteUser);

module.exports = route;
