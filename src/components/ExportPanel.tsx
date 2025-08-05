import React from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { FileDown, DownloadCloud } from "lucide-react";
import { motion } from "framer-motion";
import api from '../api';

export default function ExportPanel() {
  const downloadFile = async (type: "interns" | "donations") => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        toast.error("Unauthorized: Admin token missing.");
        return;
      }

      const response = await api.get(`/api/admin/export/${type}`, {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv;charset=utf-8;" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `${type}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success(`${type === "interns" ? "Interns" : "Donations"} exported successfully.`);
    } catch (error: any) {
      console.error("Download error:", error);
      toast.error("Export failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex justify-center items-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-lg bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-8 border border-gray-200"
      >
        <div className="flex items-center gap-3 mb-6">
          <DownloadCloud className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-extrabold text-gray-800">Export Data</h1>
        </div>

        <p className="text-gray-600 mb-6">
          Download your intern and donation data as CSV files. This data can be used for external analytics or offline storage.
        </p>

        <div className="flex flex-col gap-4">
          <button
            title="Export Interns as CSV"
            onClick={() => downloadFile("interns")}
            className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition shadow-sm"
          >
            <FileDown className="w-5 h-5" />
            Export Interns (CSV)
          </button>

          <button
            title="Export Donations as CSV"
            onClick={() => downloadFile("donations")}
            className="flex items-center justify-center gap-3 py-3 px-4 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-sm"
          >
            <FileDown className="w-5 h-5" />
            Export Donations (CSV)
          </button>
        </div>
      </motion.div>
    </div>
  );
}
