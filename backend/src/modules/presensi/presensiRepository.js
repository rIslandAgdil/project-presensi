const prisma = require("../../config/prisma");

/**
 * Mengambil satu data presensi berdasarkan ID.
 *
 * @async
 * @param {(string|number)} id - ID presensi yang akan diambil.
 * @returns {Promise<Object|null>} Promise yang resolve dengan objek presensi ({ id, userId, date, status, checkInAt, checkOutAt }) atau null jika tidak ditemukan.
 * @throws {Error} Jika terjadi kesalahan saat mengakses database.
 * @example
 * const presensi = await findById('uuid-1234');
 */

const findById = async (id) => {
  try {
    return await prisma.attendance.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("findById error:", error);
    throw new Error("Gagal mengambil data presensi");
  }
};

/**
 * Mengambil daftar presensi dengan dukungan pagination dan filter opsional.
 *
 * @async
 * @param {Object} [options] - Opsi pencarian.
 * @param {number} [options.page=1] - Nomor halaman (1-based).
 * @param {number} [options.limit=10] - Jumlah item per halaman.
 * @param {(string|number)} [options.userId] - Filter berdasarkan userId.
 * @param {string} [options.date] - Filter berdasarkan tanggal (format harus sesuai dengan yang tersimpan di DB, mis. 'YYYY-MM-DD').
 * @returns {Promise<Array<Object>>} Promise yang resolve dengan array objek presensi. Setiap item berisi { id, userId, date, status, checkInAt, checkOutAt }.
 * @throws {Error} Jika terjadi kesalahan saat mengambil data dari database.
 * @example
 * const presensiList = await findAll({ page: 2, limit: 20, userId: 5, date: '2025-01-01' });
 */

const findAll = async ({ page = 1, limit = 10, userId, date } = {}) => {
  try {
    const where = {};
    if (userId) where.userId = userId;
    if (date) where.date = date;
    return await prisma.attendance.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { date: "desc" },
      select: {
        id: true,
        userId: true,
        date: true,
        status: true,
        checkInAt: true,
        checkOutAt: true,
      },
    });
  } catch (error) {
    console.error("findAll error:", error);
    throw new Error("Gagal mengambil data presensi");
  }
};

/**
 * Menambah atau memperbarui data presensi untuk kombinasi unik userId + date.
 *
 * Jika sudah ada record dengan kombinasi userId dan date (key komposit userId_date), maka akan diupdate dengan isi `form`.
 * Jika belum ada, akan dibuat record baru dengan menggabungkan userId dan field di `form`.
 *
 * @async
 * @param {(string|number)} userId - ID user yang membuat atau memperbarui presensi.
 * @param {Object} form - Objek data presensi yang akan dibuat atau diupdate.
 * @param {string} form.date - Tanggal presensi (wajib, format harus sama persis seperti di DB).
 * @param {string} [form.status] - Status presensi (mis. 'present', 'absent', dsb.).
 * @param {string} [form.checkInAt] - Waktu check-in (ISO string atau format yang digunakan aplikasi).
 * @param {string} [form.checkOutAt] - Waktu check-out (ISO string atau format yang digunakan aplikasi).
 * @returns {Promise<Object>} Promise yang resolve dengan objek presensi yang baru dibuat atau telah diperbarui ({ id, userId, date, checkInAt, checkOutAt, status }).
 * @throws {Error} Jika field `date` tidak diberikan atau jika terjadi kesalahan saat menyimpan ke database.
 * @remarks
 * Implementasi menggunakan Prisma upsert dan mengandalkan constraint unik komposit `userId_date`.
 * @example
 * await addOrUpdatePresensi(5, { date: '2025-11-03', checkInAt: '2025-11-03T08:00:00Z' });
 */

const addOrUpdatePresensi = async (userId, form) => {
  try {
    if (!form.date) throw new Error("Field date wajib diisi");

    // for compound unique, Prisma expects where: { userId_date: { userId, date } }
    return await prisma.attendance.upsert({
      where: {
        userId_date: {
          userId,
          date: form.date, // pastikan format sama persis
        },
      },
      update: form, // mis. update checkOutAt atau checkInAt
      create: { userId, ...form },
      select: {
        id: true,
        userId: true,
        date: true,
        checkInAt: true,
        checkOutAt: true,
        status: true,
      },
    });
  } catch (error) {
    console.error("addOrUpdatePresensi error:", error);
    throw new Error("Gagal menyimpan presensi");
  }
};

module.exports = { findById, findAll, addOrUpdatePresensi };
