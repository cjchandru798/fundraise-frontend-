// src/pages/AdminLogin.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import axios from "axios";

export function AdminLoginForm({ onSwitch }: { onSwitch: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:8080/api/admin/login', {
        email,
        password
      });
      localStorage.setItem('adminToken', res.data.token);
      localStorage.setItem('isSuperAdmin', res.data.isSuperAdmin);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || "Invalid login");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-8">
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
        className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
      >
        Login
      </button>
      <p
        onClick={onSwitch}
        className="text-sm text-green-600 underline cursor-pointer text-center"
      >
        Back to Intern Login
      </p>
    </form>
  );
}
