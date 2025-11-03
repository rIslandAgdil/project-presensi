// app.js
const express = require("express");
const cors = require("cors");
const cookieParse = require("cookie-parser");
const morgan = require("morgan");
const userRoutes = require("./modules/user/userRoutes.js");
const authRoutes = require("./modules/auth/authRoutes.js");
// const presensiRoutes = require("./module/presensi/presensiRoutes.js");
// const laporanRoutes = require("./modules/laporan/laporanRoutes.js");

const whitelist = process.env.CORS_ORIGIN_ALLOW.split(",");

const app = express();

// Konfigurasi opsi CORS
const corsOptions = {
  origin: function (origin, callback) {
    // Jika request tidak punya origin (misalnya curl/postman) atau origin ada dalam whitelist → izinkan
    if (!origin || whitelist.includes(origin)) {
      callback(null, true);
    } else {
      // Jika origin tidak ada dalam daftar → tolak dengan error
      callback(new Error("Not allowed by CORS"));
    }
  },
  optionsSuccessStatus: 200, // Untuk memastikan response preflight OPTIONS sukses di browser lama
};

// Middleware
app.use(express.json());
app.use(cookieParse());
app.use(cors(corsOptions));
app.use(morgan("dev"));

// Routing
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
// app.use("/api/presensi", presensiRoutes);
// app.use("/api/laporan", laporanRoutes);

// Error handling
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res
//     .status(500)
//     .json({ message: "Internal Server Error", error: err.message });
// });

module.exports = app;
