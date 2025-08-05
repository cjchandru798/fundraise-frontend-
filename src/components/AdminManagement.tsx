import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserPlus, Trash2, RefreshCcw } from "lucide-react";
import api from '../api';

interface Admin {
  id: number;
  name: string;
  email: string;
}

export default function AdminManagement() {
  const [admins, setAdmins] = useState<Admin[]>([]);
  const [newAdmin, setNewAdmin] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");
  const token = localStorage.getItem("adminToken");

  const fetchAdmins = async () => {
    try {
      const res = await api.get(`/api/superadmin/all-admins`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });

      if (Array.isArray(res.data)) {
        setAdmins(res.data);
        setErrorMsg("");
      } else {
        setAdmins([]);
        setErrorMsg("Datas are protected by the host ");
      }
    } catch (err) {
      setAdmins([]);
      setErrorMsg("Failed to fetch admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdd = async () => {
    try {
      await axios.post(`/api/superadmin/add-admin`, newAdmin, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      toast.success("✅ Admin added");
      setNewAdmin({ name: "", email: "", password: "" });
      fetchAdmins();
    } catch (err) {
      toast.error("❌ Failed to add admin.");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/api/superadmin/delete-admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      toast.success("🗑️ Admin deleted");
      setAdmins((prev) => prev.filter((a) => a.id !== id));
    } catch (err) {
      toast.error("❌ Delete failed");
    }
  };

  const handleReset = async () => {
    try {
      await api.post(`/api/superadmin/reset-leaderboard`, {}, {
        headers: { Authorization: `Bearer ${token}` },
        validateStatus: () => true,
      });
      toast.success("🔄 Leaderboard reset");
    } catch (err) {
      toast.error("❌ Reset failed");
    }
  };

  return (
    <div className="min-h-screen px-4 py-8 bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-blue-700">👤 Admin Management</h1>
          <button
            onClick={handleReset}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition"
          >
            <RefreshCcw className="w-5 h-5" /> Reset Leaderboard
          </button>
        </div>

        {/* Add Admin Form */}
        <div className="bg-white p-6 rounded-xl shadow-md space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <UserPlus className="w-6 h-6 text-blue-600" /> Add New Admin
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Name"
              className="border px-4 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={newAdmin.name}
              onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="border px-4 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={newAdmin.email}
              onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="border px-4 py-2 rounded shadow-sm focus:ring-2 focus:ring-blue-400 outline-none transition"
              value={newAdmin.password}
              onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
            />
          </div>

          <div className="text-right">
            <button
              onClick={handleAdd}
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Add Admin
            </button>
          </div>
        </div>

        {/* Admin List */}
        <div className="bg-white p-6 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">📋 All Admins</h2>

          {loading ? (
            <p className="text-gray-500">Loading admins...</p>
          ) : errorMsg ? (
            <p className="text-red-600">{errorMsg}</p>
          ) : admins.length === 0 ? (
            <p className="text-gray-500">No admins found.</p>
          ) : (
            <ul className="divide-y divide-gray-200">
              {admins.map((admin) => (
                <li
                  key={admin.id}
                  className="flex justify-between items-center py-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm">
                      {admin.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-gray-800 font-medium">{admin.name}</p>
                      <p className="text-sm text-gray-500">{admin.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(admin.id)}
                    className="text-red-600 hover:text-red-800 inline-flex items-center gap-1 text-sm font-medium transition"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
