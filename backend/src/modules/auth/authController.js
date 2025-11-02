const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const findByNIP = require("./authRepository");
const { sendSuccess, sendError } = require("../../utils/response");

const JWT_SECRET = process.env.JWT_SECRET_KEY;
const NODE_ENV = process.env.NODE_ENV || "development";

const login = async (req, res) => {
  const { NIP, password } = req.body;

  try {
    const user = await findByNIP(NIP);

    // jika user NIP tidak ditemukan atau password salah/tidak cocok
    if (!user || !(await bcrypt.compare(password, user.password)))
      return sendError(res, "NIP atau password salah", 401);

    // jika status nonaktif
    if (!user.isActive) return sendError(res, "Anda tidak memiliki akses", 403);

    // buat token
    const payload = {
      id: user.id,
      NIP: user.NIP,
      role: user.role,
    };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // kirim token sebagai cookie
    res.cookie("access_token", token, {
      httpOnly: true,
      secure: NODE_ENV === "production", // true jika mode production
      sameSite: "lax",
      maxAge: 60 * 60 * 1000, // 1 jam dalam milisecond
    });

    // jangan kirim password ke klien
    const { password: _pwd, ...data } = user;

    return sendSuccess(res, "Berhasil Login", 200, data);
  } catch (error) {
    return sendError(res, "Kesalahan server", 500, error.message);
  }
};

module.exports = login;
