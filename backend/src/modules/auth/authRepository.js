const prisma = require("../../config/prisma");

const findByNIP = async (NIP) => {
  try {
    const data = await prisma.user.findUnique({
      where: { NIP },
    });

    return data;
  } catch (error) {
    throw error;
  }
};

module.exports = findByNIP;
