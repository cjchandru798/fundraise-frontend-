// src/pages/LeaderboardPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trophy } from "lucide-react";
import clsx from "clsx";

interface Intern {
  name: string;
  amount: number;
  rank: number;
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<"daily" | "weekly" | "all">("all");
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Intern[]>(
        `http://localhost:8080/api/leaderboard?filter=${filter}`
      );
      setInterns(res.data);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load leaderboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [filter]);

  const getMedal = (rank: number) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-blue-700 flex items-center gap-2">
            <Trophy className="w-8 h-8 text-yellow-500" />
            Leaderboard
          </h2>
          <div className="space-x-2">
            {["all", "weekly", "daily"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f as "daily" | "weekly" | "all")}
                className={clsx(
                  "px-3 py-1 rounded-full text-sm font-medium transition",
                  filter === f
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                )}
              >
                {f === "all" ? "All-Time" : f[0].toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="text-center text-gray-500">Loading leaderboard...</p>
        ) : error ? (
          <p className="text-center text-red-500">{error}</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="bg-blue-100 text-blue-800">
                  <th className="text-left px-4 py-2">Rank</th>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Amount</th>
                </tr>
              </thead>
              <tbody>
                {interns.map((intern, idx) => (
                  <tr
                    key={idx}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-2 font-semibold">
                      {getMedal(intern.rank)}
                    </td>
                    <td className="px-4 py-2">{intern.name}</td>
                    <td className="px-4 py-2">₹{intern.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
