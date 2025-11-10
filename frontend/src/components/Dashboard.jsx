import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { presensiAPI, userAPI, laporanAPI } from "../services/api";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPresensi: 0,
    totalLaporan: 0,
    presensiHariIni: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const today = new Date().toISOString().split("T")[0];

      const [usersRes, presensiRes, laporanRes, presensiTodayRes] =
        await Promise.all([
          userAPI.getAll().catch(() => ({ data: [] })),
          presensiAPI.getAll().catch(() => ({ data: [] })),
          laporanAPI.getAll().catch(() => ({ data: [] })),
          presensiAPI.getAll({ date: today }).catch(() => ({ data: [] })),
        ]);

      setStats({
        totalUsers: usersRes.data?.length || 0,
        totalPresensi: presensiRes.data?.length || 0,
        totalLaporan: laporanRes.data?.length || 0,
        presensiHariIni: presensiTodayRes.data?.length || 0,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Total User",
      value: stats.totalUsers,
      icon: "👥",
      bgColor: "bg-indigo-100",
      iconColor: "text-indigo-600",
      valueColor: "text-indigo-700",
    },
    {
      title: "Total Presensi",
      value: stats.totalPresensi,
      icon: "📝",
      bgColor: "bg-green-100",
      iconColor: "text-green-600",
      valueColor: "text-green-700",
    },
    {
      title: "Presensi Hari Ini",
      value: stats.presensiHariIni,
      icon: "📅",
      bgColor: "bg-orange-100",
      iconColor: "text-orange-600",
      valueColor: "text-orange-700",
    },
    {
      title: "Total Laporan",
      value: stats.totalLaporan,
      icon: "📋",
      bgColor: "bg-red-100",
      iconColor: "text-red-600",
      valueColor: "text-red-700",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-8 rounded-xl shadow-lg mb-6">
        <h2 className="text-3xl font-bold mb-2">
          Selamat Datang, {user?.fullName || "User"}!
        </h2>
        <p className="text-white/90">
          Berikut adalah ringkasan data sistem presensi
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Memuat data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {statCards.map((card, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4 hover:shadow-lg transition-shadow"
            >
              <div className={`${card.bgColor} p-4 rounded-xl`}>
                <span className={`text-4xl ${card.iconColor}`}>{card.icon}</span>
              </div>
              <div className="flex-1">
                <div className={`text-3xl font-bold ${card.valueColor} mb-1`}>
                  {card.value}
                </div>
                <div className="text-sm text-gray-600 uppercase tracking-wide">
                  {card.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-6">Aksi Cepat</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">📝</div>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              Input Presensi
            </div>
            <div className="text-sm text-gray-600">Catat kehadiran hari ini</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">👤</div>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              Kelola User
            </div>
            <div className="text-sm text-gray-600">Tambah atau edit user</div>
          </div>
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 text-center cursor-pointer hover:shadow-lg transition-shadow">
            <div className="text-5xl mb-4">📊</div>
            <div className="text-lg font-semibold text-gray-800 mb-2">
              Lihat Laporan
            </div>
            <div className="text-sm text-gray-600">Analisis data presensi</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

