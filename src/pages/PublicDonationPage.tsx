import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function PublicDonationPage() {
  const { referralCode } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ donorName: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  if (!referralCode) return <Navigate to="/" replace />;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const publicAxios = axios.create({
        baseURL: "http://localhost:8080",
        headers: {
          "Content-Type": "application/json",
        },
      });

      await publicAxios.post(`/api/donate/${referralCode}`, {
        donorName: formData.donorName || undefined,
        amount: parseInt(formData.amount),
      });

      setSuccess(true);
      setFormData({ donorName: "", amount: "" });

      setTimeout(() => navigate("/auth"), 3000);
    } catch (err) {
      setError("Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        <AnimatePresence mode="wait">
          {success ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <CheckCircle className="text-green-500 mx-auto w-16 h-16 mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Thank you for donating!
              </h2>
              <p className="text-gray-600 text-sm">
                You’re making a difference 🎉. Redirecting you in 3 seconds...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-blue-700 mb-4">Support the Cause</h2>
              <p className="text-sm text-gray-600 mb-6">
                You’re donating via referral:{" "}
                <span className="font-semibold">{referralCode}</span>
              </p>

              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Donor Name (optional)
                  </label>
                  <input
                    type="text"
                    name="donorName"
                    value={formData.donorName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    name="amount"
                    min="1"
                    required
                    value={formData.amount}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-400"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition"
                >
                  {loading ? "Processing..." : "Donate Now"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
