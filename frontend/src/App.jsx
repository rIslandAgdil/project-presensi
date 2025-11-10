import { useState, useEffect } from "react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Layout from "./components/Layout";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import PresensiList from "./components/PresensiList";
import UserList from "./components/UserList";
import LaporanList from "./components/LaporanList";

const AppContent = () => {
  const { user, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState("dashboard");

  useEffect(() => {
    if (!user && !loading) {
      setCurrentPage("login");
    } else if (user) {
      setCurrentPage("dashboard");
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-gray-500">Memuat...</div>
      </div>
    );
  }

  if (!user) {
    return <Login onLoginSuccess={() => setCurrentPage("dashboard")} />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <Dashboard />;
      case "presensi":
        return <PresensiList />;
      case "user":
        return <UserList />;
      case "laporan":
        return <LaporanList />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
