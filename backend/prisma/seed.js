const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  // 1. Membersihkan data lama (opsional, untuk memastikan idempotency)
  await prisma.user.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.auditLog.deleteMany();

  // 2. Membuat data users
  await prisma.user.createMany({
    data: [
      {
        NIP: "00001",
        password: await bcrypt.hash("admin", 10),
        fullName: "Jhon Doe",
        role: "ADMIN",
      },
      {
        NIP: "00002",
        password: await bcrypt.hash("clara123", 10),
        fullName: "Clara",
        isActive: false,
      },
      {
        NIP: "00003",
        password: await bcrypt.hash("bryan123", 10),
        fullName: "Bryan",
      },
    ],
  });

  console.log(`Seeding complete.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
