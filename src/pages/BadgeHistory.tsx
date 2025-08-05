// src/pages/BadgeHistory.tsx
import { useEffect, useState } from "react";
import { Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import api from '../api';

interface Badge {
  label: string;
  icon: string;
  reached: boolean;
  amount: number;
}

export default function BadgeHistory() {
  const [badges, setBadges] = useState<Badge[]>([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth");

      try {
        const res = await api.get(`/api/intern/dashboard`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const milestones: Badge[] = [
          { label: "Bronze", icon: "🥉", amount: 500, reached: res.data.totalAmountRaised >= 500 },
          { label: "Silver", icon: "🥈", amount: 1000, reached: res.data.totalAmountRaised >= 1000 },
          { label: "Gold", icon: "🥇", amount: 2000, reached: res.data.totalAmountRaised >= 2000 },
          { label: "Platinum", icon: "🏆", amount: 5000, reached: res.data.totalAmountRaised >= 5000 },
        ];

        setBadges(milestones);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch badge history.");
      }
    };

    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 flex justify-center items-start">
      <div className="w-full max-w-5xl bg-white p-8 rounded-3xl shadow-xl">
        <h2 className="text-4xl font-bold mb-8 text-blue-700 flex items-center gap-2">
          <Award className="w-8 h-8 text-yellow-500" /> Your Badge History
        </h2>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {badges.map((badge, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.4, delay: idx * 0.1 }}
              className={`p-6 border rounded-2xl shadow-md text-center transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                badge.reached
                  ? "bg-gradient-to-br from-green-100 to-green-200 border-green-500 text-green-800"
                  : "bg-gray-100 border-gray-300 text-gray-500"
              }`}
            >
              <div className="text-5xl mb-3">{badge.icon}</div>
              <h3 className="text-xl font-semibold">{badge.label}</h3>
              <p className="text-sm text-gray-700">Target: ₹{badge.amount}</p>
              <p className="text-sm mt-1">
                Status:{" "}
                {badge.reached ? (
                  <span className="font-semibold text-green-600">Achieved</span>
                ) : (
                  <span className="text-gray-400">Pending</span>
                )}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
