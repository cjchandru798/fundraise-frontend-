// src/pages/TransactionTable.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronsUpDown } from "lucide-react";
import clsx from "clsx";
import api from "../api";

interface Transaction {
  donorName: string;
  amount: number;
  date: string;
}

const PAGE_SIZE = 5;

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filtered, setFiltered] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState("");
  const [minAmount, setMinAmount] = useState(0);
  const [maxAmount, setMaxAmount] = useState(Infinity);
  const [sortField, setSortField] = useState<"name" | "amount" | "date">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/auth");

      try {
        const res = await api.get(`/api/intern/transactions`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTransactions(res.data);
      } catch (err) {
        console.error("Failed to fetch transactions");
        setError("Unable to load transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, []);

  useEffect(() => {
    let filteredTxns = transactions.filter((txn) => {
      const inRange = txn.amount >= minAmount && txn.amount <= maxAmount;
      const matchesSearch = txn.donorName?.toLowerCase().includes(search.toLowerCase());
      return inRange && matchesSearch;
    });

    filteredTxns.sort((a, b) => {
      if (sortField === "amount") return sortOrder === "asc" ? a.amount - b.amount : b.amount - a.amount;
      if (sortField === "name") return sortOrder === "asc" ? a.donorName.localeCompare(b.donorName) : b.donorName.localeCompare(a.donorName);
      return sortOrder === "asc"
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    setFiltered(filteredTxns);
    setPage(1);
  }, [transactions, search, minAmount, maxAmount, sortField, sortOrder]);

  const toggleSort = (field: "name" | "amount" | "date") => {
    if (sortField === field) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pageCount = Math.ceil(filtered.length / PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-6xl space-y-6">
        <h2 className="text-3xl font-bold text-blue-700">Your Donation History</h2>

        <div className="flex flex-wrap gap-4 items-center">
          <input
            type="number"
            placeholder="Min Amount"
            value={minAmount || ""}
            onChange={(e) => setMinAmount(Number(e.target.value))}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="number"
            placeholder="Max Amount"
            value={maxAmount === Infinity ? "" : maxAmount}
            onChange={(e) => setMaxAmount(Number(e.target.value) || Infinity)}
            className="border rounded px-3 py-2 text-sm"
          />
          <input
            type="text"
            placeholder="Search name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-2 text-sm"
          />

          <button
            onClick={() => toggleSort("name")}
            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Name <ChevronsUpDown className="w-4 h-4" />
          </button>
          <button
            onClick={() => toggleSort("amount")}
            className="flex items-center gap-1 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-sm"
          >
            Amount <ChevronsUpDown className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-500 py-6">Loading transactions...</p>
        ) : error ? (
          <p className="text-red-500 text-center py-6">{error}</p>
        ) : (
          <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-blue-100 text-blue-800">
                <tr>
                  <th className="px-4 py-2 text-left">#</th>
                  <th className="px-4 py-2 text-left">Name</th>
                  <th className="px-4 py-2 text-left">Amount (₹)</th>
                  <th className="px-4 py-2 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {paginated.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-4 py-2">{(page - 1) * PAGE_SIZE + idx + 1}</td>
                    <td className="px-4 py-2">{txn.donorName || "Anonymous"}</td>
                    <td className="px-4 py-2 font-medium text-green-700">₹{txn.amount}</td>
                    <td className="px-4 py-2 text-gray-600">{new Date(txn.date).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        <div className="flex justify-center gap-2 pt-4">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={clsx(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                page === i + 1 ? "bg-blue-600 text-white" : "bg-gray-200 hover:bg-gray-300"
              )}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
