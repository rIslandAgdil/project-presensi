const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();
const bcrypt = require("bcrypt");

async function main() {
  // 1. Membersihkan data lama (opsional, untuk memastikan idempotency)
  await prisma.auditLog.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.user.deleteMany();

  // 2. Membuat data users
  const admin = await prisma.user.create({
    data: {
      NIP: "00001",
      password: await bcrypt.hash("admin", 10),
      fullName: "Jhon Doe",
      role: "ADMIN",
    },
  });

  const pegawai1 = await prisma.user.create({
    data: {
      NIP: "00002",
      password: await bcrypt.hash("clara123", 10),
      fullName: "Clara",
      role: "PEGAWAI",
      isActive: false,
    },
  });

  const pegawai2 = await prisma.user.create({
    data: {
      NIP: "00003",
      password: await bcrypt.hash("bryan123", 10),
      fullName: "Bryan",
      role: "PEGAWAI",
    },
  });

  // 🕒 4. Attendance sample data
  await prisma.attendance.createMany({
    data: [
      {
        userId: pegawai1.id,
        date: new Date(),
        checkInAt: new Date(new Date().setHours(8, 0)),
        checkOutAt: new Date(new Date().setHours(17, 0)),
      },
      {
        userId: pegawai2.id,
        date: new Date(),
        checkInAt: new Date(new Date().setHours(9, 0)),
        checkOutAt: new Date(new Date().setHours(17, 0)),
      },
    ],
  });

  // 🧾 5. Audit log sample
  await prisma.auditLog.createMany({
    data: [
      { userId: admin.id, action: "Menambahkan user baru" },
      { userId: pegawai1.id, action: "Melakukan presensi masuk" },
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
