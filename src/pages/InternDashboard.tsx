import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  ClipboardCheck,
  UserCircle,
  Award,
  Bell,
  BarChartBig,
  Globe2,
  Trophy,
  LogOut,
  Megaphone,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import api from '../api';

interface InternDashboardResponse {
  greeting: string;
  totalAmountRaised: number;
  totalDonors: number;
  referralCode: string;
  donationLink: string;
  badge: string;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

const InternDashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<InternDashboardResponse | null>(null);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [copied, setCopied] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasNewNotifications, setHasNewNotifications] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [dashboardRes, notiRes] = await Promise.all([
          api.get(`/api/intern/dashboard`, { headers }),
          api.get(`/api/intern/notifications`, { headers }),
        ]);

        setDashboardData(dashboardRes.data);
        setNotifications(notiRes.data);
        if (notiRes.data.length > 0) {
          setHasNewNotifications(true);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleCopy = async () => {
    if (dashboardData?.donationLink) {
      await navigator.clipboard.writeText(dashboardData.donationLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleToggleNotifications = () => {
    setShowNotifications((prev) => !prev);
    if (hasNewNotifications) setHasNewNotifications(false);
  };

  const goTo = (path: string) => navigate(path);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (!dashboardData) return <p className="text-center mt-10 text-gray-500">No dashboard data found.</p>;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 flex justify-center">
      <div className="w-full max-w-6xl space-y-8">
        {/* Logout */}
        <div className="flex justify-end">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/auth";
            }}
            className="flex items-center gap-2 text-red-600 font-semibold text-sm hover:underline"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Header */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <UserCircle className="w-12 h-12 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">{dashboardData.greeting}</h1>
          </div>
          <div className="relative">
            <button onClick={handleToggleNotifications} className="relative p-2">
              <Bell className="w-6 h-6 text-blue-600" />
              {hasNewNotifications && (
                <>
                  <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" />
                  <span className="absolute top-0 right-0 inline-block w-2.5 h-2.5 bg-red-500 rounded-full" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Notification Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              className="bg-white rounded-xl shadow p-6"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              <div className="flex items-center gap-2 mb-4">
                <Bell className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold text-gray-800">Recent Notifications</h2>
              </div>
              {notifications.length === 0 ? (
                <p className="text-sm text-gray-500">No new notifications.</p>
              ) : (
                <ul className="max-h-44 overflow-y-auto space-y-2">
                  {notifications.map((n) => (
                    <li key={n.id} className="text-sm border-b pb-1">
                      <span className="font-medium text-gray-800">•</span> {n.message}
                      <br />
                      <span className="text-xs text-gray-400">
                        {new Date(n.timestamp).toLocaleString()}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
          <QuickAction icon={<Trophy className="text-purple-600" />} label="Leaderboard" onClick={() => goTo("/leaderboard")} />
          <QuickAction icon={<BarChartBig className="text-indigo-600" />} label="My Transactions" onClick={() => goTo("/transactions")} />
          <QuickAction icon={<Globe2 className="text-green-600" />} label="Donate Public" onClick={() => goTo(`/donate/${dashboardData.referralCode}`)} />
          <QuickAction icon={<Megaphone className="text-red-600" />} label="Announcements" onClick={() => goTo("/announcements")} />
          <QuickAction icon={<Award className="text-yellow-600" />} label="My Badges" onClick={() => goTo("/badges")} />
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition flex items-center gap-4">
            <BarChartBig className="w-6 h-6 text-blue-600" />
            <div>
              <p className="text-sm text-gray-500">Total Raised</p>
              <p className="text-3xl font-bold text-blue-700 mt-1">₹{dashboardData.totalAmountRaised}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl p-6 shadow hover:shadow-md transition flex items-center gap-4">
            <Users className="w-6 h-6 text-green-600" />
            <div>
              <p className="text-sm text-gray-500">Total Donors</p>
              <p className="text-3xl font-bold text-green-700 mt-1">{dashboardData.totalDonors}</p>
            </div>
          </div>
        </div>

        {/* Referral Link */}
        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <div>
            <p className="text-sm text-gray-600">Referral Code</p>
            <p className="text-lg font-mono bg-gray-100 px-3 py-2 inline-block rounded mt-1">
              {dashboardData.referralCode}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={dashboardData.donationLink}
              target="_blank"
              rel="noreferrer"
              className="text-blue-700 underline break-all max-w-full"
            >
              {dashboardData.donationLink}
            </a>
            <button
              title="Copy donation link"
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              <ClipboardCheck size={16} />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>

        {/* Badge */}
        <div className="bg-yellow-50 border-l-4 border-yellow-500 rounded p-4 flex items-center gap-4 hover:scale-[1.02] transition-transform">
          <Award className="text-yellow-600 w-6 h-6" />
          <div>
            <p className="text-sm text-gray-700">Current Badge</p>
            <p className="text-xl font-semibold text-yellow-700">{dashboardData.badge}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({
  icon,
  label,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) => (
  <button
    onClick={onClick}
    className="flex flex-col items-center bg-white p-5 sm:p-6 rounded-xl border shadow hover:shadow-lg transition gap-2"
  >
    <div className="text-xl">{icon}</div>
    <span className="text-sm font-medium text-gray-700 text-center">{label}</span>
  </button>
);

export default InternDashboard;
