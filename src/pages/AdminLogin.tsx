import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import axios from 'axios';
import api from '../api';
export function AdminLoginForm({ onSwitch }: { onSwitch: () => void }) {
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

      const token = res.data; // raw string
      if (!token || typeof token !== 'string') {
        setError('No token received from server.');
        return;
      }

      // Decode JWT to get isSuperAdmin (assuming it's in payload)
      const payloadBase64 = token.split('.')[1];
      const payloadJson = JSON.parse(atob(payloadBase64.replace(/-/g, '+').replace(/_/g, '/')));
      const isSuperAdmin = payloadJson?.isSuperAdmin || payloadJson?.super_admin || false;

      // Save to localStorage
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
    </form>
  );
}
