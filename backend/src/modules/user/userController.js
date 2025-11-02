const {
  findAll,
  findById,
  addData,
  updateData,
  deleteData,
} = require("./userRepository");
const { sendError, sendSuccess } = require("../../utils/response");
const bcrypt = require("bcrypt");

exports.getAllUsers = async (req, res) => {
  try {
    const users = await findAll();
    return sendSuccess(res, "Data berhasil dimuat", 200, users);
  } catch (error) {
    return sendError(res, error.message, 500, error);
  }
};

exports.getUserById = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const user = await findById(id);

    // jika id tidak ditemukan
    if (!user) return sendError(res, "Data tidak ditemukan", 400);

    return sendSuccess(res, "Data berhasil dimuat", 200, user);
  } catch (error) {
    return sendError(res, error.message, 500, error);
  }
};

exports.createUser = async (req, res) => {
  const { password } = req.body;
  try {
    // hasing password sebelum di kirim ke DB
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await addData({ ...req.body, password: hashPassword });
    return sendSuccess(res, "User berhasil dibuat", 201, newUser);
  } catch (error) {
    return sendError(res, error.message, 500, error);
  }
};

exports.updateUser = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const updatedUser = await updateData(id, req.body);
    if (!updatedUser) return sendError(res, "Data gagal di update", 400);
    return sendSuccess(res, "User berhasil diupdate", 200, updatedUser);
  } catch (error) {
    return sendError(res, error.message, 500, error);
  }
};

exports.deleteUser = async (req, res) => {
  const id = Number(req.params.id);
  try {
    const deleted = await deleteData(id);
    if (!deleted) return sendError(res, "User gagal dihapus", 400);
    return sendSuccess(res, "User berhasil dihapus", 200, deleted);
  } catch (error) {
    return sendError(res, error.message, 500, error);
  }
};
