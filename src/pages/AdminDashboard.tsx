import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LogOut,
  User,
  BarChart3,
  FileDown,
  RefreshCw,
  Shield,
  Target,
} from "lucide-react";
import { motion } from "framer-motion";
import api from "../api";

interface CardItem {
  title: string;
  desc: string;
  icon: JSX.Element;
  onClick: () => void;
  superOnly?: boolean;
}

const AdminDashboard: React.FC = () => {
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const superFlag = localStorage.getItem("isSuperAdmin");

    if (!token) return navigate("/auth");
    setIsSuperAdmin(superFlag === "true");

    try {
      const payload = JSON.parse(
        atob(token.split(".")[1].replace(/-/g, "+").replace(/_/g, "/"))
      );
      setAdminEmail(payload.sub || payload.email || "Admin");
    } catch {
      setAdminEmail("Admin");
    }
  }, [navigate]);

  const cardList: CardItem[] = [
    {
      title: "Manage Interns",
      desc: "View, edit, or remove intern details.",
      icon: <User className="w-6 h-6 text-blue-500" />,
      onClick: () => navigate("/admin/interns"),
    },
    {
      title: "Analytics",
      desc: "Track donations & top-performing interns.",
      icon: <BarChart3 className="w-6 h-6 text-green-500" />,
      onClick: () => navigate("/admin/analytics"),
    },
    {
      title: "Export Data",
      desc: "Download CSV of donors or interns.",
      icon: <FileDown className="w-6 h-6 text-yellow-500" />,
      onClick: () => navigate("/admin/export"),
    },
    {
      title: "Reset Leaderboard",
      desc: "Clear and restart rankings.",
      icon: <RefreshCw className="w-6 h-6 text-red-500" />,
      onClick: () => navigate("/admin/reset-leaderboard"),
      superOnly: true,
    },
    {
      title: "Admin Management",
      desc: "Add or remove admin accounts.",
      icon: <Shield className="w-6 h-6 text-purple-500" />,
      onClick: () => navigate("/admin/manage-admins"),
      superOnly: true,
    },
    {
      title: "Milestone Manager",
      desc: "Manage donation badges and levels.",
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      onClick: () => navigate("/admin/milestones"),
      superOnly: true,
    },
  ];

  const Card = ({ title, desc, icon, onClick }: CardItem) => (
    <motion.div
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-xl p-6 shadow-md border hover:shadow-xl transition duration-300 flex flex-col gap-2"
    >
      <div className="flex items-center gap-2">
        {icon}
        <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      </div>
      <p className="text-sm text-gray-500">{desc}</p>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-blue-50 px-6 py-10 flex justify-center">
      <div className="w-full max-w-6xl space-y-10">
        {/* Top Bar */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome, {adminEmail}</h1>
            <p className="text-gray-500">
              {isSuperAdmin ? "Superadmin Access" : "Admin Access"}
            </p>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem("adminToken");
              localStorage.removeItem("isSuperAdmin");
              navigate("/auth");
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {cardList
            .filter((card) => !card.superOnly || isSuperAdmin)
            .map((card, idx) => (
              <Card key={idx} {...card} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
