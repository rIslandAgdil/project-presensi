const {
  findById,
  findAll,
  addOrUpdatePresensi,
  deleteById,
} = require("./presensiRepository");
const { sendError, sendSuccess } = require("../../utils/response");

exports.getAllPresensi = async (req, res) => {
  try {
    const data = await findAll();

    // jika data kosong
    if (!data) return sendError(res, "Data tidak ditemukan", 404);

    return sendSuccess(res, "Data berhasil dimuat", 200, data);
  } catch (error) {
    return sendError(res, "Kesalaha server", 500, error.message);
  }
};

exports.getPresensiById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await findById(id);

    // jika data kosong
    if (!data) return sendError(res, "Data tidak ditemukan", 404);
    return sendSuccess(res, "Data berhasil dimuat", 200, data);
  } catch (error) {
    return sendError(res, "Kesalaha server", 500, error.message);
  }
};

exports.upsertPresensi = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const data = await addOrUpdatePresensi(userId, req.body);
    if (!data) return sendError(res, "Data tidak ditemukan", 404);
    return sendSuccess(res, "Data berhasil diubah", 200, data);
  } catch (error) {
    return sendError(res, "Kesalaha server", 500, error.message);
  }
};

exports.deletePresensi = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await deleteById(id);
    if (!data) return sendError(res, "Data tidak ditemukan", 404);
    return sendSuccess(res, "Data berhasil dihapus", 200, data);
  } catch (error) {
    return sendError(res, "Kesalaha server", 500, error.message);
  }
};
