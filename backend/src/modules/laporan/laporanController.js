const {
  findById,
  findAll,
  addData,
  updateData,
  deleteById,
} = require("./laporanRepository");
const { sendError, sendSuccess } = require("../../utils/response");

exports.getAllLaporan = async (req, res) => {
  try {
    const { page, limit, userId, action, startDate, endDate } = req.query;
    const options = {
      page: page ? Number(page) : 1,
      limit: limit ? Number(limit) : 10,
      userId: userId ? Number(userId) : undefined,
      action,
      startDate,
      endDate,
    };

    const data = await findAll(options);

    // jika data kosong
    if (!data || data.length === 0)
      return sendError(res, "Data tidak ditemukan", 404);

    return sendSuccess(res, "Data berhasil dimuat", 200, data);
  } catch (error) {
    return sendError(res, "Kesalahan server", 500, error.message);
  }
};

exports.getLaporanById = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await findById(id);

    // jika data kosong
    if (!data) return sendError(res, "Data tidak ditemukan", 404);
    return sendSuccess(res, "Data berhasil dimuat", 200, data);
  } catch (error) {
    return sendError(res, "Kesalahan server", 500, error.message);
  }
};

exports.createLaporan = async (req, res) => {
  try {
    const userId = Number(req.user.id);
    const data = await addData(userId, req.body);
    return sendSuccess(res, "Laporan berhasil dibuat", 201, data);
  } catch (error) {
    return sendError(res, "Kesalahan server", 500, error.message);
  }
};

exports.updateLaporan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await updateData(id, req.body);
    if (!data) return sendError(res, "Data tidak ditemukan", 404);
    return sendSuccess(res, "Laporan berhasil diupdate", 200, data);
  } catch (error) {
    return sendError(res, "Kesalahan server", 500, error.message);
  }
};

exports.deleteLaporan = async (req, res) => {
  try {
    const id = Number(req.params.id);
    const data = await deleteById(id);
    if (!data) return sendError(res, "Data tidak ditemukan", 404);
    return sendSuccess(res, "Laporan berhasil dihapus", 200, data);
  } catch (error) {
    return sendError(res, "Kesalahan server", 500, error.message);
  }
};
