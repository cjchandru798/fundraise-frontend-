import { useParams, useNavigate, Navigate } from "react-router-dom";
import { useState } from "react";
import { CheckCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import useWindowSize from "react-use/lib/useWindowSize";
import api from '../api';

export default function PublicDonationPage() {
  const { referralCode } = useParams();
  const navigate = useNavigate();
  const { width, height } = useWindowSize();

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
      const response = await api.post(`/api/donate/${referralCode}`, {
        donorName: formData.donorName,
        amount: parseFloat(formData.amount),
      });

      const msg = response.data?.message || "Thank you for your donation!";
      console.log("Success:", msg);
      setSuccess(true);
      setFormData({ donorName: "", amount: "" });
    } catch (err: any) {
      console.error(err);
      setError("Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-blue-50 relative overflow-hidden">
      {success && <Confetti width={width} height={height} numberOfPieces={200} recycle={false} />}

      {/* Left panel */}
      <div className="hidden md:flex flex-col justify-center items-center w-1/2 bg-blue-600 text-white px-10 py-12 rounded-br-3xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-3xl font-bold mb-4">Support a Dream</h1>
          <p className="text-base text-blue-100 max-w-sm mx-auto">
            Every rupee you donate helps an intern grow. Be part of something meaningful.
          </p>
        </motion.div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 sm:p-8">
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
                  🎉 Thank you for donating! 🎉
                </h2>
                <p className="text-gray-600 text-sm mb-6">
                  Your support helps someone move forward. You’re awesome! 💙
                </p>
                <button
                  onClick={() => navigate("/")}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                >
                  Back Home
                </button>
              </motion.div>
            ) : (
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl font-bold text-blue-700 mb-2">Make a Donation</h2>
                <p className="text-sm text-gray-600 mb-6">
                  You're donating via referral:{" "}
                  <span className="font-semibold text-blue-600">{referralCode}</span>
                </p>

                {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Donor Name (optional)
                    </label>
                    <input
                      type="text"
                      name="donorName"
                      value={formData.donorName}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    />
                  </div>

                  <motion.button
                    type="submit"
                    disabled={loading}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition ${
                      loading
                        ? "bg-blue-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                  >
                    {loading ? "Processing..." : "Donate Now"}
                  </motion.button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
