const {
  findById,
  findAll,
  addOrUpdatePresensi,
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
