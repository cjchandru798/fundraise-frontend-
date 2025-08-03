import { useEffect, useState } from "react";
import axios from "axios";
import { School, MapPin, IndianRupee } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Intern {
  id: number;
  name: string;
  email: string;
  city: string;
  college: string;
  totalAmount: number;
}

export default function AdminInterns() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [cityFilter, setCityFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [sortByAmount, setSortByAmount] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);

  const fetchInterns = async (city?: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      const url = city
        ? `http://localhost:8080/api/admin/interns/filter?city=${encodeURIComponent(city)}`
        : `http://localhost:8080/api/admin/interns`;

      const res = await axios.get<Intern[]>(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setInterns(res.data);
    } catch (err) {
      console.error("Error fetching interns", err);
      setError("Failed to load interns.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = cityFilter.trim().toLowerCase();
    fetchInterns(trimmed || undefined);
  };

  const sortedInterns = [...interns].sort((a, b) =>
    sortByAmount ? b.totalAmount - a.totalAmount : a.id - b.id
  );

  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-blue-50 p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-700">👨‍🎓 Intern Management</h1>

        {/* Filter & Sort Controls */}
        <form
          onSubmit={handleSearch}
          className="flex flex-wrap gap-4 items-center bg-white p-4 rounded-lg shadow"
        >
          <input
            type="text"
            placeholder="Filter by city..."
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            className="border px-4 py-2 rounded w-full sm:w-auto flex-1"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={sortByAmount}
              onChange={() => setSortByAmount(!sortByAmount)}
              className="accent-blue-600"
            />
            Sort by amount raised
          </label>
        </form>

        {/* Loading / Error */}
        {loading && <p className="text-gray-500 text-sm">Loading interns...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {/* Intern Cards */}
        {!loading && sortedInterns.length === 0 && (
          <p className="text-center text-gray-500">No interns found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedInterns.map((intern) => (
            <motion.div
              key={intern.id}
              whileHover={{ scale: 1.02 }}
              className="bg-white rounded-xl p-5 shadow hover:shadow-lg transition"
            >
              <h3 className="text-xl font-semibold text-gray-800">{intern.name}</h3>
              <p className="flex items-center text-sm text-gray-600 mt-1">
                <School className="w-4 h-4 mr-2" />
                {intern.college}
              </p>
              <p className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-4 h-4 mr-2" />
                {intern.city}
              </p>
              <p className="flex items-center text-green-600 font-bold mt-2">
                <IndianRupee className="w-4 h-4 mr-1" />
                {intern.totalAmount.toLocaleString()}
              </p>
              <button
                onClick={() => setSelectedIntern(intern)}
                className="mt-4 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition text-sm"
              >
                View Full Details
              </button>
            </motion.div>
          ))}
        </div>

        {/* Modal */}
        <AnimatePresence>
          {selectedIntern && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-md w-full shadow-xl relative"
              >
                <button
                  onClick={() => setSelectedIntern(null)}
                  className="absolute top-3 right-4 text-gray-400 hover:text-black text-2xl"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold text-blue-600 mb-4">
                  {selectedIntern.name}'s Details
                </h2>
                <div className="space-y-2 text-gray-700 text-sm">
                  <p><strong>ID:</strong> {selectedIntern.id}</p>
                  <p><strong>Email:</strong> {selectedIntern.email}</p>
                  <p><strong>City:</strong> {selectedIntern.city}</p>
                  <p><strong>College:</strong> {selectedIntern.college}</p>
                  <p className="text-green-600 font-semibold mt-2">
                    <strong>Total Raised:</strong> ₹ {selectedIntern.totalAmount.toLocaleString()}
                  </p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
