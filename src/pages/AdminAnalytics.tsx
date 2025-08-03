import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { BarChart2, Users, DollarSign } from 'lucide-react';

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

interface InternAnalytics {
  name: string;
  email: string;
  phone: string;
  totalRaised: number;
}

interface Summary {
  totalAmount: number;
  totalDonors: number;
  totalInterns: number;
}

interface DailyAnalytics {
  date: string;
  amount: number;
}

export default function AdminAnalytics() {
  const [data, setData] = useState<InternAnalytics[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [daily, setDaily] = useState<DailyAnalytics[]>([]);
  const [sortByAmount, setSortByAmount] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState<InternAnalytics | null>(null);
  const [showChart, setShowChart] = useState(true);

  const token = localStorage.getItem('adminToken');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [topRes, summaryRes, dailyRes] = await Promise.all([
          axios.get('http://localhost:8080/api/admin/analytics/top', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/api/admin/analytics/summary', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:8080/api/admin/analytics/daily', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setData(topRes.data);
        setSummary(summaryRes.data);
        setDaily(dailyRes.data);
      } catch (err) {
        console.error('Error fetching analytics:', err);
      }
    };

    fetchAnalytics();
  }, [token]);

  const sortedData = [...data].sort((a, b) =>
    sortByAmount ? b.totalRaised - a.totalRaised : a.name.localeCompare(b.name)
  );

  const chartData = {
    labels: daily.map(d => d.date),
    datasets: [
      {
        label: 'Donations (₹)',
        data: daily.map(d => d.amount),
        fill: false,
        borderColor: '#3b82f6',
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header + Toggle */}
      <div className="flex justify-between items-center flex-wrap gap-4">
        <h1 className="text-3xl font-bold text-gray-800">📈 Intern Fundraising Analytics</h1>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setShowChart(!showChart)}
            className="bg-blue-600 text-white text-sm px-4 py-2 rounded shadow hover:bg-blue-700 transition"
          >
            {showChart ? 'Hide' : 'Show'} Donation Graph
          </button>

          <label className="flex items-center gap-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={sortByAmount}
              onChange={() => setSortByAmount(!sortByAmount)}
              className="accent-blue-600"
            />
            Sort by Amount Raised
          </label>
        </div>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-blue-100 border border-blue-200 p-5 rounded-xl shadow flex items-center gap-4">
            <DollarSign className="text-blue-600" />
            <div>
              <p className="text-sm text-gray-600">Total Raised</p>
              <h2 className="text-xl font-bold text-blue-700">₹{summary.totalAmount}</h2>
            </div>
          </div>

          <div className="bg-green-100 border border-green-200 p-5 rounded-xl shadow flex items-center gap-4">
            <Users className="text-green-600" />
            <div>
              <p className="text-sm text-gray-600">Total Donors</p>
              <h2 className="text-xl font-bold text-green-700">{summary.totalDonors}</h2>
            </div>
          </div>

          <div className="bg-purple-100 border border-purple-200 p-5 rounded-xl shadow flex items-center gap-4">
            <BarChart2 className="text-purple-600" />
            <div>
              <p className="text-sm text-gray-600">Total Interns</p>
              <h2 className="text-xl font-bold text-purple-700">{summary.totalInterns}</h2>
            </div>
          </div>
        </div>
      )}

      {/* Donation Graph */}
      {showChart && (
        <div className="bg-white border border-gray-200 p-6 rounded-xl shadow">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">📅 Daily Donations</h2>
          <Line data={chartData} />
        </div>
      )}

      {/* Table */}
      <div className="overflow-x-auto bg-white border border-gray-200 rounded-xl shadow">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border">#</th>
              <th className="px-4 py-3 border">Intern Name</th>
              <th className="px-4 py-3 border">Total Raised (₹)</th>
              <th className="px-4 py-3 border text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {sortedData.map((intern, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3 border text-center">{index + 1}</td>
                <td className="px-4 py-3 border">{intern.name}</td>
                <td className="px-4 py-3 border">₹{intern.totalRaised}</td>
                <td className="px-4 py-3 border text-center">
                  <button
                    onClick={() => setSelectedIntern(intern)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedIntern && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 w-full max-w-md rounded-xl shadow-lg relative animate-fade-in">
            <button
              onClick={() => setSelectedIntern(null)}
              className="absolute top-3 right-4 text-gray-400 hover:text-black text-xl"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4 text-blue-700">Intern Details</h2>
            <p><strong>Name:</strong> {selectedIntern.name}</p>
            <p className="mt-2 text-green-600 font-semibold">
              <strong>Total Raised:</strong> ₹{selectedIntern.totalRaised}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
