import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

const Layout = ({ children, currentPage, onNavigate }) => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleLogout = () => {
    if (window.confirm("Apakah Anda yakin ingin logout?")) {
      logout();
      onNavigate("login");
    }
  };

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "presensi", label: "Presensi", icon: "📝" },
    { id: "user", label: "Data User", icon: "👥" },
    { id: "laporan", label: "Laporan", icon: "📋" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside
        className={`bg-linear-to-b from-indigo-600 to-purple-600 text-white flex flex-col transition-all duration-300 shadow-lg ${
          sidebarOpen ? "w-64" : "w-20"
        } fixed md:relative h-dvh z-50`}
      >
        <div className="p-4 flex justify-between items-center border-b border-white/20">
          {sidebarOpen && (
            <h2 className="text-xl font-bold">Sistem Presensi</h2>
          )}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-colors text-lg"
          >
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 transition-colors ${
                currentPage === item.id
                  ? "bg-white/20 border-l-4 border-white"
                  : "hover:bg-white/10"
              }`}
            >
              <span className="text-2xl">{item.icon}</span>
              {sidebarOpen && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/20 space-y-4">
          {sidebarOpen && (
            <div className="space-y-1">
              <div className="font-semibold text-sm">
                {user?.fullName || "User"}
              </div>
              <div className="text-xs opacity-80 uppercase">
                {user?.role || "USER"}
              </div>
            </div>
          )}
          <button
            onClick={handleLogout}
            className="w-full bg-white/20 hover:bg-white/30 py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            {sidebarOpen ? "Logout" : "🚪"}
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden ml-0 md:ml-0">
        <header className="bg-white shadow-sm px-6 py-4 border-b">
          <h1 className="text-2xl font-bold text-gray-800">
            {menuItems.find((item) => item.id === currentPage)?.label ||
              "Dashboard"}
          </h1>
        </header>
        <div className="flex-1 overflow-y-auto p-6">{children}</div>
      </main>
    </div>
  );
};

export default Layout;
