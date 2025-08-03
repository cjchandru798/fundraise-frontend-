import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './index.css';

// Intern Pages
import AuthPage from './pages/AuthPage';
import InternDashboard from './pages/InternDashboard';
import TransactionTable from './pages/TransactionTable';
import Leaderboard from './pages/Leaderboard';
import BadgeHistory from './pages/BadgeHistory';
import PublicDonationPage from './pages/PublicDonationPage';
import Announcements from './pages/Announcements';

// Admin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminInterns from './pages/AdminInterns';
import AdminAnalytics from './pages/AdminAnalytics';
import AdminManagement from './components/AdminManagement';
import MilestoneManager from './pages/MilestoneManager';
import ExportPanel from './components/ExportPanel';
import ResetLeaderboardPanel from './components/ResetLeaderboardPanel';

// Auth & Route Guard
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <Routes>

        {/* 🔐 Auth Route */}
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* 👤 Intern Routes (Protected) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InternDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/transactions"
          element={
            <ProtectedRoute>
              <TransactionTable />
            </ProtectedRoute>
          }
        />
        <Route
          path="/badges"
          element={
            <ProtectedRoute>
              <BadgeHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/leaderboard"
          element={
            <ProtectedRoute>
              <Leaderboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/announcements"
          element={
            <ProtectedRoute>
              <Announcements />
            </ProtectedRoute>
          }
        />

        {/* 🛠️ Admin Routes (Protected) */}
        <Route
          path="/admin/admin-dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/interns"
          element={
            <ProtectedRoute>
              <AdminInterns />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/analytics"
          element={
            <ProtectedRoute>
              <AdminAnalytics />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage-admins"
          element={
            <ProtectedRoute>
              <AdminManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/milestones"
          element={
            <ProtectedRoute>
              <MilestoneManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/export"
          element={
            <ProtectedRoute>
              <ExportPanel />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/reset-leaderboard"
          element={
            <ProtectedRoute>
              <ResetLeaderboardPanel />
            </ProtectedRoute>
          }
        />

        {/* 🌐 Public Donation Route */}
        <Route path="/donate/:referralCode" element={<PublicDonationPage />} />

      </Routes>
    </Router>
  );
}
