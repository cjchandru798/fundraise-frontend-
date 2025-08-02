// src/pages/TransactionTable.tsx
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface Transaction {
  donorName: string;
  amount: number;
  date: string;
}

export default function TransactionTable() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/auth');

      try {
        const res = await axios.get("http://localhost:8080/api/intern/transactions", {
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

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex justify-center">
      <div className="w-full max-w-5xl">
        <h2 className="text-3xl font-bold mb-6 text-blue-700">Your Donation History</h2>

        {loading && <p className="text-gray-500 text-center">Loading transactions...</p>}
        {error && <p className="text-red-500 text-center">{error}</p>}

        {!loading && transactions.length === 0 && (
          <p className="text-center text-gray-600">No donations made yet.</p>
        )}

        {!loading && transactions.length > 0 && (
          <div className="overflow-x-auto shadow rounded-lg border border-gray-200 bg-white">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 text-left text-gray-600 font-semibold">
                <tr>
                  <th className="px-6 py-3">Donor Name</th>
                  <th className="px-6 py-3">Amount (₹)</th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {transactions.map((txn, idx) => (
                  <tr key={idx} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{txn.donorName || "Anonymous"}</td>
                    <td className="px-6 py-4 font-medium text-green-700">₹{txn.amount}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(txn.date).toLocaleString()}
                    </td>
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
