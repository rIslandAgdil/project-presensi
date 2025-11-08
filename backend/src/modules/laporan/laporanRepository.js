const prisma = require("../../config/prisma");

/**
 * Mengambil satu data laporan berdasarkan ID.
 *
 * @async
 * @param {(string|number)} id - ID laporan yang akan diambil.
 * @returns {Promise<Object|null>} Promise yang resolve dengan objek laporan atau null jika tidak ditemukan.
 * @throws {Error} Jika terjadi kesalahan saat mengakses database.
 * @example
 * const laporan = await findById(1);
 */
const findById = async (id) => {
  try {
    return await prisma.auditLog.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            NIP: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("findById error:", error);
    throw new Error("Gagal mengambil data laporan");
  }
};

/**
 * Mengambil daftar laporan dengan dukungan pagination dan filter opsional.
 *
 * @async
 * @param {Object} [options] - Opsi pencarian.
 * @param {number} [options.page=1] - Nomor halaman (1-based).
 * @param {number} [options.limit=10] - Jumlah item per halaman.
 * @param {(string|number)} [options.userId] - Filter berdasarkan userId.
 * @param {string} [options.action] - Filter berdasarkan action.
 * @param {string} [options.startDate] - Filter berdasarkan tanggal mulai.
 * @param {string} [options.endDate] - Filter berdasarkan tanggal akhir.
 * @returns {Promise<Array<Object>>} Promise yang resolve dengan array objek laporan.
 * @throws {Error} Jika terjadi kesalahan saat mengambil data dari database.
 * @example
 * const laporanList = await findAll({ page: 2, limit: 20, userId: 5, action: 'LOGIN' });
 */
const findAll = async ({ page = 1, limit = 10, userId, action, startDate, endDate } = {}) => {
  try {
    const where = {};
    if (userId) where.userId = userId;
    if (action) where.action = { contains: action };
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) where.createdAt.gte = new Date(startDate);
      if (endDate) where.createdAt.lte = new Date(endDate);
    }

    return await prisma.auditLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            NIP: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("findAll error:", error);
    throw new Error("Gagal mengambil data laporan");
  }
};

/**
 * Menambahkan data laporan baru.
 *
 * @async
 * @param {(string|number)} userId - ID user yang membuat laporan.
 * @param {Object} form - Objek data laporan yang akan dibuat.
 * @param {string} form.action - Action yang dilakukan (mis. 'LOGIN', 'LOGOUT', 'CREATE_PRESENSI', dll.).
 * @param {Object} [form.meta] - Metadata tambahan dalam format JSON.
 * @returns {Promise<Object>} Promise yang resolve dengan objek laporan yang baru dibuat.
 * @throws {Error} Jika field `action` tidak diberikan atau jika terjadi kesalahan saat menyimpan ke database.
 * @example
 * await addData(5, { action: 'LOGIN', meta: { ip: '192.168.1.1', device: 'mobile' } });
 */
const addData = async (userId, form) => {
  try {
    if (!form.action) throw new Error("Field action wajib diisi");

    return await prisma.auditLog.create({
      data: {
        userId,
        action: form.action,
        meta: form.meta || null,
      },
      include: {
        user: {
          select: {
            id: true,
            NIP: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("addData error:", error);
    throw new Error("Gagal menyimpan laporan");
  }
};

/**
 * Memperbarui data laporan berdasarkan ID.
 *
 * @async
 * @param {(string|number)} id - ID laporan yang akan diupdate.
 * @param {Object} form - Objek data laporan yang akan diupdate.
 * @param {string} [form.action] - Action yang dilakukan.
 * @param {Object} [form.meta] - Metadata tambahan dalam format JSON.
 * @returns {Promise<Object>} Promise yang resolve dengan objek laporan yang telah diperbarui.
 * @throws {Error} Jika laporan tidak ditemukan atau terjadi kesalahan saat mengupdate database.
 * @example
 * await updateData(1, { action: 'UPDATE_PRESENSI', meta: { attendanceId: 5 } });
 */
const updateData = async (id, form) => {
  try {
    return await prisma.auditLog.update({
      where: { id },
      data: form,
      include: {
        user: {
          select: {
            id: true,
            NIP: true,
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });
  } catch (error) {
    console.error("updateData error:", error);
    if (error.code === "P2025") {
      throw new Error("Laporan tidak ditemukan");
    }
    throw new Error("Gagal mengupdate laporan");
  }
};

/**
 * Menghapus data laporan berdasarkan ID.
 *
 * @async
 * @param {(string|number)} id - ID laporan yang akan dihapus.
 * @returns {Promise<Object>} Promise yang resolve dengan objek laporan yang telah dihapus.
 * @throws {Error} Jika laporan tidak ditemukan atau terjadi kesalahan saat menghapus dari database.
 * @example
 * await deleteById(1);
 */
const deleteById = async (id) => {
  try {
    return await prisma.auditLog.delete({
      where: { id },
      select: {
        id: true,
        userId: true,
        action: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("deleteById error:", error);
    if (error.code === "P2025") {
      throw new Error("Laporan tidak ditemukan");
    }
    throw new Error("Gagal menghapus laporan");
  }
};

module.exports = { findById, findAll, addData, updateData, deleteById };

