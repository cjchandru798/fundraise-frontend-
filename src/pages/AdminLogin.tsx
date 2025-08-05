// src/pages/AdminLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import api from '../api';

interface AdminLoginProps {
  onSwitch: () => void; // ✅ Accept the onSwitch prop
}

export default function AdminLogin({ onSwitch }: AdminLoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await api.post('/api/admin/login', {
        email,
        password,
      });

      const token = res.data; // raw JWT string
      if (!token || typeof token !== 'string') {
        setError('No token received from server.');
        return;
      }

      const payloadBase64 = token.split('.')[1];
      if (!payloadBase64) {
        console.error("JWT token missing payload.");
        return;
      }

      const payloadJson = JSON.parse(
        atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/'))
      );
      const isSuperAdmin = payloadJson?.isSuperAdmin || payloadJson?.super_admin || false;

      localStorage.setItem('adminToken', token);
      localStorage.setItem('isSuperAdmin', String(isSuperAdmin));

      navigate('/admin/admin-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid credentials or server error');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-14">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Admin Login</h2>

      <InputField
        label="Email"
        name="email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <InputField
        label="Password"
        name="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
      >
        Login
      </button>

      {/* ✅ Add a switch button for AuthPage */}
      <button
        type="button"
        onClick={onSwitch}
        className="w-full py-2 mt-2 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition"
      >
        Back to Intern Login
      </button>
    </form>
  );
}
