import { useEffect, useState } from "react";
import { Trophy, Search, ChevronsUpDown } from "lucide-react";
import clsx from "clsx";
import api from "../api";

interface Intern {
  name: string;
  amount: number;
  rank: number;
}

const PAGE_SIZE = 10;

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<"daily" | "weekly" | "all">("all");
  const [interns, setInterns] = useState<Intern[]>([]);
  const [filtered, setFiltered] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [sortField, setSortField] = useState<"name" | "amount">("amount");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const [page, setPage] = useState(1);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.get<Intern[]>(`/api/leaderboard?filter=${filter}`);

      // Normalize data to guarantee name, amount, and rank are defined
      const normalized = (res.data || []).map((intern, index) => ({
        name: intern?.name ?? "Unknown",
        amount: intern?.amount ?? 0,
        rank: intern?.rank ?? index + 1,
      }));

      setInterns(normalized);
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

  useEffect(() => {
    const result = interns
      .filter((intern) =>
        intern.name.toLowerCase().includes(search.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === "amount") {
          return sortOrder === "asc"
            ? a.amount - b.amount
            : b.amount - a.amount;
        } else {
          return sortOrder === "asc"
            ? a.name.localeCompare(b.name)
            : b.name.localeCompare(a.name);
        }
      });

    setFiltered(result);
    setPage(1);
  }, [interns, search, sortField, sortOrder]);

  const toggleSort = (field: "name" | "amount") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  const getMedal = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  return (
    <div className="min-h-screen px-4 py-10 bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-5xl mx-auto bg-white p-6 rounded-2xl shadow-lg space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
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

        {/* Search & Sort */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="pl-8 pr-4 py-2 rounded border border-gray-300 text-sm w-64"
            />
          </div>

          <div className="flex gap-2 text-sm">
            <button
              onClick={() => toggleSort("name")}
              className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Name <ChevronsUpDown className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSort("amount")}
              className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Amount <ChevronsUpDown className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">Loading leaderboard...</p>
        ) : error ? (
          <p className="text-center text-red-500 py-10">{error}</p>
        ) : (
          <div className="overflow-x-auto rounded border border-gray-200">
            <table className="w-full table-auto text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="text-left px-4 py-2">#</th>
                  <th className="text-left px-4 py-2">Rank</th>
                  <th className="text-left px-4 py-2">Name</th>
                  <th className="text-left px-4 py-2">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map((intern, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-2">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-2 font-bold">{getMedal(intern.rank)}</td>
                    <td className="px-4 py-2">{intern.name}</td>
                    <td className="px-4 py-2 text-green-700 font-medium">
                      ₹{intern.amount.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pageCount > 1 && (
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={clsx(
                  "w-8 h-8 rounded-full text-sm font-semibold flex items-center justify-center",
                  page === p
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                )}
              >
                {p}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
