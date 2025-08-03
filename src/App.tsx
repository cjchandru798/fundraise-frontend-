// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import InternDashboard from './pages/InternDashboard';
import './index.css';
import TransactionTable from './pages/TransactionTable';
import Leaderboard from './pages/Leaderboard';
import BadgeHistory from './pages/BadgeHistory';
import PublicDonationPage from './pages/PublicDonationPage';
import ProtectedRoute from "./components/ProtectedRoute";
import Announcements from "./pages/Announcements";
import AdminDashboard from "./pages/AdminDashboard";
import AdminInterns from "./pages/AdminInterns";
import AdminManagement from "./components/AdminManagement";
import AdminAnalytics from "./pages/AdminAnalytics";
export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />

        {/* ✅ Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <InternDashboard />
            </ProtectedRoute>
          }
        />
        <Route
                  path="/admin/admin-dashboard"
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
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
                  path="/admin/interns"
                  element={
                      <ProtectedRoute>
                        <AdminInterns />
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
        <Route path="/announcements" element={<ProtectedRoute><Announcements /></ProtectedRoute>} />
        <Route path="/admin/manage-admins" element={<ProtectedRoute><AdminManagement /></ProtectedRoute>} />



        {/* 🌐 Public Route */}
        <Route path="/donate/:referralCode" element={<PublicDonationPage />} />
      </Routes>
    </Router>
  );
}
