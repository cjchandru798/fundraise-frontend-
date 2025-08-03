// src/pages/AuthPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "../pages/InternLogin";
import { SignupForm } from "../pages/InternSignup";
import { AdminLoginForm } from "../pages/AdminLogin";

type Mode = "login" | "signup" | "admin";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="relative w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden flex">
        {/* Left Form Container */}
        <div className="w-1/2 p-10">
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
          className={`w-1/2 text-white flex flex-col items-center justify-center p-10 transition-all duration-700 ease-in-out ${
            mode === "signup"
              ? "bg-blue-500 rounded-r-[150px]"
              : mode === "admin"
              ? "bg-green-600 rounded-l-[150px]"
              : "bg-blue-500 rounded-l-[150px]"
          }`}
        >
          <h2 className="text-3xl font-bold mb-4">
            {mode === "signup"
              ? "Welcome!"
              : mode === "admin"
              ? "Intern or Donor?"
              : "New Here?"}
          </h2>
          <p className="text-md mb-6 text-center">
            {mode === "signup"
              ? "Already part of our mission? Log in to continue your fundraising journey."
              : mode === "admin"
              ? "Admin managing the platform? Log in securely."
              : "Join our platform and start making a difference by helping others through your donations."}
          </p>

          {/* Toggle Buttons */}
          {mode === "signup" && (
            <button
              onClick={() => setMode("login")}
              className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition"
            >
              Login
            </button>
          )}
          {mode === "login" && (
            <div className="space-x-4">
              <button
                onClick={() => setMode("signup")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition"
              >
                Sign Up
              </button>
              <button
                onClick={() => setMode("admin")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition"
              >
                Admin Login
              </button>
            </div>
          )}
          {mode === "admin" && (
            <div className="space-x-4">
              <button
                onClick={() => setMode("login")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition"
              >
                Intern Login
              </button>
              <button
                onClick={() => setMode("signup")}
                className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-green-600 transition"
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
