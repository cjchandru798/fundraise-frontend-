// src/components/InternSignup.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import InputField from "../components/InputField";
import api from "../api";

interface SignupFormProps {
  onSwitch: () => void;        // Switch to Login
  onAdminSwitch: () => void;   // Switch to Admin Login
}

export default function InternSignup({ onSwitch, onAdminSwitch }: SignupFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    college: ""
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await api.post(`/api/auth/signup`, formData);
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

      <button
        type="submit"
        className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors duration-300 ease-in-out"
      >
        Sign Up
      </button>

      <div className="flex items-center justify-between pt-4 text-sm text-gray-600">
        <button
          type="button"
          onClick={onSwitch}
          className="hover:underline hover:text-blue-600 transition"
        >
          Already have an account? Login
        </button>

        <button
          type="button"
          onClick={onAdminSwitch}
          className="hover:underline hover:text-purple-600 transition"
        >
          Admin Login
        </button>
      </div>
    </form>
  );
}
