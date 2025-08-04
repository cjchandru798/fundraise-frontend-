// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import './index.css';

// Intern Pages
import AuthPage from "./pages/AuthPage";
import InternDashboard from "./pages/InternDashboard";
import TransactionTable from "./pages/TransactionTable";
import Leaderboard from "./pages/Leaderboard";
import BadgeHistory from "./pages/BadgeHistory";
import PublicDonationPage from "./pages/PublicDonationPage";
import Announcements from "./pages/Announcements";
import LandingPage from "./pages/LandingPage";
import IntroPage from "./pages/IntroPage";


// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import AdminInterns from "./pages/AdminInterns";
import AdminAnalytics from "./pages/AdminAnalytics";
import AdminManagement from "./components/AdminManagement";
import MilestoneManager from "./pages/MilestoneManager";
import ExportPanel from "./components/ExportPanel";
import ResetLeaderboardPanel from "./components/ResetLeaderboardPanel";

// Auth & Route Guard
import ProtectedRoute from "./components/ProtectedRoute";

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* 🔐 Entry & Auth */}
        <Route path="/" element={<Navigate to="/intro-page" />} />
        <Route path="/intro-page" element={<PageWrapper><IntroPage /></PageWrapper>} />

        <Route path="/landing" element={<PageWrapper><LandingPage /></PageWrapper>} />
        <Route path="/auth" element={<PageWrapper><AuthPage /></PageWrapper>} />

        {/* 👤 Intern Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><InternDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <PageWrapper><TransactionTable /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges"
          element={
            <ProtectedRoute>
              <PageWrapper><BadgeHistory /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <PageWrapper><Leaderboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <PageWrapper><Announcements /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* 🛠️ Admin Routes */}
        <Route
          path="/admin/admin-dashboard"
          element={
            <ProtectedRoute>
              <PageWrapper><AdminDashboard /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/interns"
          element={
            <ProtectedRoute>
              <PageWrapper><AdminInterns /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <PageWrapper><AdminAnalytics /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-admins"
          element={
            <ProtectedRoute>
              <PageWrapper><AdminManagement /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/milestones"
          element={
            <ProtectedRoute>
              <PageWrapper><MilestoneManager /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/export"
          element={
            <ProtectedRoute>
              <PageWrapper><ExportPanel /></PageWrapper>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reset-leaderboard"
          element={
            <ProtectedRoute>
              <PageWrapper><ResetLeaderboardPanel /></PageWrapper>
            </ProtectedRoute>
          }
        />

        {/* 🌐 Public Donation Route */}
        <Route
          path="/donate/:referralCode"
          element={<PageWrapper><PublicDonationPage /></PageWrapper>}
        />
      </Routes>
    </AnimatePresence>
  );
}

// Wrapper for animated page transitions
function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      className="w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      transition={{ duration: 0.4 }}
    >
      {children}
    </motion.div>
  );
}

export default function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  );
}
