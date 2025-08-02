// src/App.tsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import InternDashboard from './pages/InternDashboard';
import './index.css';
import TransactionTable from './pages/TransactionTable';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/dashboard" element={<InternDashboard />} />
        <Route path="/transactions" element={<TransactionTable />} />
      </Routes>
    </Router>
  );
}
