const prisma = require("../../config/prisma");

const findById = async (id) => {
  try {
    return await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        NIP: true,
        fullName: true,
        email: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("findById error:", error);
    throw new Error("Gagal mengambil data user");
  }
};

const findAll = async (page = 1, limit = 10) => {
  try {
    return await prisma.user.findMany({
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        NIP: true,
        fullName: true,
        email: true,
        role: true,
        phone: true,
        isActive: true,
        createdAt: true,
      },
    });
  } catch (error) {
    console.error("findAll error:", error);
    throw new Error("Gagal mengambil data user");
  }
};

const addData = async (form) => {
  try {
    return await prisma.user.create({
      data: form,
      select: {
        id: true,
        NIP: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("addData error:", error);
    if (error.code === "P2002") {
      throw new Error("NIP atau email sudah terdaftar");
    }
    throw new Error("Gagal menambahkan user");
  }
};

const updateData = async (id, form) => {
  try {
    return await prisma.user.update({
      where: { id },
      data: form,
      select: {
        id: true,
        NIP: true,
        fullName: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  } catch (error) {
    console.error("updateData error:", error);
    if (error.code === "P2025") {
      throw new Error("User tidak ditemukan");
    }
    throw new Error("Gagal mengupdate user");
  }
};

const deleteData = async (id) => {
  try {
    return await prisma.user.delete({
      where: { id },
      select: {
        id: true,
        NIP: true,
        fullName: true,
      },
    });
  } catch (error) {
    console.error("deleteData error:", error);
    if (error.code === "P2025") {
      throw new Error("User tidak ditemukan");
    }
    throw new Error("Gagal menghapus user");
  }
};

module.exports = { findById, findAll, addData, updateData, deleteData };
