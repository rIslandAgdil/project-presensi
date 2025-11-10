import { useState, useEffect } from "react";
import { presensiAPI } from "../services/api";

const PresensiForm = ({ presensi, onClose }) => {
  const [formData, setFormData] = useState({
    date: "",
    checkInAt: "",
    checkOutAt: "",
    status: "HADIR",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (presensi) {
      setFormData({
        date: presensi.date
          ? new Date(presensi.date).toISOString().split("T")[0]
          : "",
        checkInAt: presensi.checkInAt
          ? new Date(presensi.checkInAt).toISOString().slice(0, 16)
          : "",
        checkOutAt: presensi.checkOutAt
          ? new Date(presensi.checkOutAt).toISOString().slice(0, 16)
          : "",
        status: presensi.status || "HADIR",
      });
    } else {
      const today = new Date().toISOString().split("T")[0];
      setFormData((prev) => ({ ...prev, date: today }));
    }
  }, [presensi]);

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
      const payload = {
        date: formData.date,
        status: formData.status,
      };

      if (formData.checkInAt) {
        payload.checkInAt = new Date(formData.checkInAt).toISOString();
      }
      if (formData.checkOutAt) {
        payload.checkOutAt = new Date(formData.checkOutAt).toISOString();
      }

      if (presensi) {
        await presensiAPI.update(presensi.id, payload);
        alert("Presensi berhasil diupdate!");
      } else {
        await presensiAPI.create(payload);
        alert("Presensi berhasil dibuat!");
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
            {presensi ? "Edit Presensi" : "Tambah Presensi Baru"}
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
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Tanggal <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="checkInAt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Check In
            </label>
            <input
              type="datetime-local"
              id="checkInAt"
              name="checkInAt"
              value={formData.checkInAt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="checkOutAt"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Check Out
            </label>
            <input
              type="datetime-local"
              id="checkOutAt"
              name="checkOutAt"
              value={formData.checkOutAt}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="HADIR">HADIR</option>
              <option value="TELAT">TELAT</option>
              <option value="IZIN">IZIN</option>
              <option value="SAKIT">SAKIT</option>
              <option value="ALPHA">ALPHA</option>
            </select>
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
              {loading ? "Menyimpan..." : presensi ? "Update" : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PresensiForm;

