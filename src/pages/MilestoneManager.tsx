import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

interface Milestone {
  id: number;
  amount: number;
  label: string;
  icon: string;
}

export default function MilestoneManager() {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [newMilestone, setNewMilestone] = useState({ amount: 0, label: "", icon: "" });
  const [loading, setLoading] = useState(true);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);

  const token = localStorage.getItem("adminToken");

  const fetchMilestones = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/superadmin/milestones", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMilestones(res.data);
    } catch {
      toast.error("Failed to load milestones");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleAddMilestone = async () => {
    if (!newMilestone.label || !newMilestone.icon || newMilestone.amount <= 0) {
      toast.error("Fill all fields correctly");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/api/superadmin/milestones",
        newMilestone,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Milestone added");
      setNewMilestone({ amount: 0, label: "", icon: "" });
      fetchMilestones();
    } catch {
      toast.error("Failed to add milestone");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8080/api/superadmin/milestones/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Milestone deleted");
      setMilestones((prev) => prev.filter((m) => m.id !== id));
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-blue-700">🏅 Milestone Manager</h1>

        {/* Add Milestone */}
        <div className="bg-white p-6 shadow rounded-xl space-y-4 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">➕ Add Milestone</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <input
              type="number"
              placeholder="Amount"
              value={newMilestone.amount}
              onChange={(e) =>
                setNewMilestone({ ...newMilestone, amount: parseInt(e.target.value) })
              }
              className="border border-gray-300 px-3 py-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Label (e.g., Gold)"
              value={newMilestone.label}
              onChange={(e) => setNewMilestone({ ...newMilestone, label: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded-lg"
            />
            <input
              type="text"
              placeholder="Icon (e.g., 🥇)"
              value={newMilestone.icon}
              onChange={(e) => setNewMilestone({ ...newMilestone, icon: e.target.value })}
              className="border border-gray-300 px-3 py-2 rounded-lg"
            />
          </div>
          <button
            onClick={handleAddMilestone}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add Milestone
          </button>
        </div>

        {/* Milestone List */}
        <div className="bg-white p-6 shadow rounded-xl border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">📋 All Milestones</h2>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <ul className="space-y-3">
              <AnimatePresence>
                {milestones.map((milestone) => (
                  <motion.li
                    key={milestone.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ duration: 0.3 }}
                    className="flex justify-between items-center bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 hover:shadow-sm cursor-pointer"
                    onClick={() => setSelectedMilestone(milestone)}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{milestone.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{milestone.label}</div>
                        <div className="text-gray-600 text-sm">₹{milestone.amount}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(milestone.id);
                      }}
                      className="text-red-500 hover:underline text-sm"
                    >
                      Delete
                    </button>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>
      </div>

      {/* Modal (Custom without Headless UI) */}
      <AnimatePresence>
        {selectedMilestone && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
            onClick={() => setSelectedMilestone(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="bg-white rounded-xl shadow-xl max-w-sm w-full p-6 relative z-50"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-bold text-blue-700 flex items-center gap-2 mb-2">
                {selectedMilestone.icon} {selectedMilestone.label}
              </h3>
              <p className="text-gray-600 mb-4">
                Amount needed to unlock: ₹{selectedMilestone.amount}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setSelectedMilestone(null)}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
