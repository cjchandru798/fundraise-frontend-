// src/pages/AuthPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import LoginForm from "../pages/InternLogin";
import SignupForm from "../pages/InternSignup";
import { AdminLoginForm } from "../pages/AdminLogin";

type Mode = "login" | "signup" | "admin";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  const getPanelContent = () => {
    switch (mode) {
      case "signup":
        return {
          title: "Welcome!",
          message:
            "Already part of our mission? Log in to continue your fundraising journey.",
          bg: "bg-green-600",
          rounded: "rounded-r-[150px]",
        };
      case "admin":
        return {
          title: "Intern or Donor?",
          message: "Admin managing the platform? Log in securely.",
          bg: "bg-green-600",
          rounded: "rounded-l-[150px]",
        };
      default:
        return {
          title: "New Here?",
          message:
            "Join our platform and start making a difference by helping others through your donations.",
          bg: "bg-blue-500",
          rounded: "rounded-l-[150px]",
        };
    }
  };

  const panel = getPanelContent();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="relative w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden flex flex-col md:flex-row">
        {/* Left Form Section */}
        <div className="w-full md:w-1/2 p-8 md:p-10">
          <AnimatePresence mode="wait">
            {mode === "login" && (
              <motion.div
                key="login"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <LoginForm
                  onSwitch={() => setMode("signup")}
                  onAdminSwitch={() => setMode("admin")}
                />
              </motion.div>
            )}
            {mode === "signup" && (
              <motion.div
                key="signup"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SignupForm
                  onSwitch={() => setMode("login")}
                  onAdminSwitch={() => setMode("admin")}
                />
              </motion.div>
            )}
            {mode === "admin" && (
              <motion.div
                key="admin"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <AdminLoginForm onSwitch={() => setMode("login")} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Info Panel */}
        <div
          className={`w-full md:w-1/2 text-white flex flex-col items-center justify-center p-10 transition-all duration-700 ease-in-out ${panel.bg} ${panel.rounded}`}
        >
          <h2 className="text-3xl font-bold mb-4">{panel.title}</h2>
          <p className="text-md mb-6 text-center">{panel.message}</p>

          {/* Toggle Buttons */}
          {mode === "signup" && (
            <button
              onClick={() => setMode("login")}
              className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
            >
              Login
            </button>
          )}

          {mode === "login" && (
            <div className="space-x-4">
              <button
                onClick={() => setMode("signup")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                Sign Up
              </button>
              <button
                onClick={() => setMode("admin")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition-colors duration-300"
              >
                Admin Login
              </button>
            </div>
          )}

          {mode === "admin" && (
            <div className="space-x-4">
              <button
                onClick={() => setMode("login")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                Intern Login
              </button>
              <button
                onClick={() => setMode("signup")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}