import  { useState } from "react";
import toast from "react-hot-toast";
import { Trash2, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import api from '../api';

export default function ResetLeaderboardPanel() {
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("adminToken");

  const handleReset = async () => {
    const confirm = window.confirm(
      "⚠️ Are you sure you want to reset the leaderboard? This action cannot be undone."
    );
    if (!confirm) return;

    setLoading(true);
    try {
      await api.post(
        '/api/superadmin/reset-leaderboard',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Leaderboard reset successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Reset failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-red-200"
      >
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-extrabold text-red-600 flex items-center justify-center gap-2">
            <Trash2 className="w-7 h-7" />
            Reset Leaderboard
          </h2>

          <p className="text-gray-700">
            ⚠️ This will <strong>permanently delete</strong> all intern donation data and
            reset leaderboard rankings. Proceed with caution.
          </p>

          <button
            onClick={handleReset}
            disabled={loading}
            className={`w-full py-3 px-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
              loading
                ? "bg-red-400 cursor-not-allowed"
                : "bg-red-600 hover:bg-red-700 active:scale-95"
            }`}
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5" />
                Resetting...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5" />
                Reset Leaderboard
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
