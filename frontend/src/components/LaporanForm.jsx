import { useState, useEffect } from "react";
import { laporanAPI } from "../services/api";

const LaporanForm = ({ laporan, onClose }) => {
  const [formData, setFormData] = useState({
    action: "",
    meta: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (laporan) {
      setFormData({
        action: laporan.action || "",
        meta: laporan.meta ? JSON.stringify(laporan.meta, null, 2) : "",
      });
    }
  }, [laporan]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let metaData = null;
      if (formData.meta.trim()) {
        try {
          metaData = JSON.parse(formData.meta);
        } catch (err) {
          throw new Error("Format JSON pada field Meta tidak valid");
        }
      }

      const payload = {
        action: formData.action,
        meta: metaData,
      };

      if (laporan) {
        await laporanAPI.update(laporan.id, payload);
        alert("Laporan berhasil diupdate!");
      } else {
        await laporanAPI.create(payload);
        alert("Laporan berhasil dibuat!");
      }

      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl font-bold text-gray-800">
            {laporan ? "Edit Laporan" : "Tambah Laporan Baru"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label
              htmlFor="action"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Action <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="action"
              name="action"
              value={formData.action}
              onChange={handleChange}
              required
              placeholder="Contoh: LOGIN, LOGOUT, CREATE_PRESENSI, dll"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="meta"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Meta (JSON)
            </label>
            <textarea
              id="meta"
              name="meta"
              value={formData.meta}
              onChange={handleChange}
              rows="6"
              placeholder='Contoh: {"ip": "192.168.1.1", "device": "mobile"}'
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono text-sm"
            />
            <small className="text-xs text-gray-500 mt-1 block">
              Format JSON opsional untuk menyimpan metadata tambahan
            </small>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-300 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50"
            >
              {loading ? "Menyimpan..." : laporan ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LaporanForm;

