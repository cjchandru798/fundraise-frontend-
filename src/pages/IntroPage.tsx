// src/pages/IntroPage.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

export default function IntroPage() {
  const [showReferralModal, setShowReferralModal] = useState(false);
  const [referralCode, setReferralCode] = useState("");
  const navigate = useNavigate();

  const handleDonateClick = () => {
    const code = referralCode.trim() || "INT0BD0FA";
    navigate(`/donate/${code}`);
    setShowReferralModal(false);
  };

  return (
    <div className="relative h-screen w-screen">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="/save1.avif"
          alt="Background"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-60" />
      </div>

      {/* Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 absolute top-0 left-0 right-0 z-50">
        <img src="/src/logo.png" alt="Logo" className="h-10" />
        <div className="space-x-6 font-medium text-sm text-white">
          <button onClick={() => navigate("/auth")} className="hover:text-green-400">Login / Sign Up</button>
          <button onClick={() => setShowReferralModal(true)} className="hover:text-green-400">Donate</button>
        </div>
      </nav>

      {/* Content */}
      <motion.div
        className="relative z-10 flex flex-col justify-center items-center h-full text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <motion.h1
          className="text-5xl md:text-7xl font-bold text-white mb-6"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          She Can Foundation
        </motion.h1>

        <motion.p
          className="text-xl md:text-2xl text-gray-200 max-w-3xl mb-8"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          “The best way to find yourself is to lose yourself in the service of others.”<br />
          — Mahatma Gandhi
        </motion.p>

        <motion.button
          onClick={() => navigate("/landing")}
          className="bg-green-600 text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-green-700 shadow-md"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          Explore →
        </motion.button>
      </motion.div>

      {/* Referral Code Modal */}
      <AnimatePresence>
        {showReferralModal && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowReferralModal(false)}
          >
            <motion.div
              className="bg-white rounded-xl shadow-xl p-6 w-full max-w-sm mx-auto"
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-green-700 mb-4">Enter Referral Code</h2>
              <input
                type="text"
                placeholder="Referral Code (optional)"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                className="border w-full px-4 py-2 mb-4 rounded-md"
              />
              <div className="flex justify-between">
                <button
                  onClick={() => setShowReferralModal(false)}
                  className="bg-gray-500 text-white px-4 py-2 rounded-md"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDonateClick}
                  className="bg-green-600 text-white px-4 py-2 rounded-md"
                >
                  Donate
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
