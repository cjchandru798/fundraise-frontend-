// src/pages/AuthPage.tsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LoginForm } from "../pages/InternLogin";
import { SignupForm } from "../pages/InternSignup";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const toggleForm = () => setIsLogin((prev) => !prev);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-blue-100">
      <div className="relative w-full max-w-5xl bg-white shadow-xl rounded-3xl overflow-hidden flex">
        {/* Left Form Container */}
        <div className="w-1/2 p-10">
          <AnimatePresence mode="wait">
            {isLogin ? (
              <motion.div
                key="login"
                initial={{ x: 300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <LoginForm onSwitch={toggleForm} />
              </motion.div>
            ) : (
              <motion.div
                key="signup"
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 300, opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                <SignupForm onSwitch={toggleForm} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Info Panel */}
        <div className="w-1/2 bg-blue-500 text-white flex flex-col items-center justify-center p-10 rounded-l-[150px] transition-all duration-700 ease-in-out">
          <h2 className="text-3xl font-bold mb-4">{isLogin ? "New Here?" : "Welcome Back!"}</h2>
          <p className="text-md mb-6 text-center">
            {isLogin
              ? "Join our platform and start making a difference by helping others through your donations."
              : "Already part of our mission? Log in to continue your fundraising journey."}
          </p>
          <button
            onClick={toggleForm}
            className="px-6 py-2 border border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-500 transition"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>
        </div>
      </div>
    </div>
  );
}
