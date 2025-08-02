// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import InternDashboard from './pages/InternDashboard';
import './index.css';
import TransactionTable from './pages/TransactionTable';
import Leaderboard from './pages/Leaderboard';
import BadgeHistory from './pages/BadgeHistory';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<InternDashboard />} />
        <Route path="/transactions" element={<TransactionTable />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/badges" element={<BadgeHistory />} />
      </Routes>
    </Router>
  );
}
