import { BrowserRouter as Router, Routes, Route ,Navigate } from 'react-router-dom';
import InternLogin from './pages/InternLogin';
import InternDashboard from './pages/InternDashboard';
import InternSignup from './pages/InternSignup';
import './index.css';

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<InternLogin />} />
        <Route path="/dashboard" element={<InternDashboard />} />
        <Route path="/signup" element={<InternSignup />} />

      </Routes>
    </Router>
  );
}

