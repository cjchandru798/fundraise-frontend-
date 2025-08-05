// src/components/InternLogin.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputField from '../components/InputField';
import api from '../api';

export function LoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await api.post(`/api/auth/login`, { email, password });
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid credentials or server error');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-14">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Login</h2>
      <InputField label="Email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <InputField label="Password" name="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button type="submit" className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Login</button>
    </form>
  );
}
