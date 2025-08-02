// src/components/InternSignup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "../components/InputField";

export function SignupForm({ onSwitch }: { onSwitch: () => void }) {
  const [formData, setFormData] = useState({ name: "", email: "", password: "", city: "", college: "" });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await axios.post('http://localhost:8080/api/auth/signup', formData);
      setSuccess('Signup successful!');
      setTimeout(() => navigate('/auth'), 1500);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Sign Up</h2>
      <InputField label="Name" name="name" value={formData.name} onChange={handleChange} />
      <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} />
      <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} />
      <InputField label="City" name="city" value={formData.city} onChange={handleChange} />
      <InputField label="College" name="college" value={formData.college} onChange={handleChange} />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {success && <p className="text-green-600 text-sm">{success}</p>}
      <button type="submit" className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition">Sign Up</button>
    </form>
  );
}
