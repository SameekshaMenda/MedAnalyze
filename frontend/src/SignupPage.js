import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/signup', form);
      alert('Signup successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FFFCFB] px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border-t-4 border-[#093FB4]">
        <h2 className="text-3xl font-bold text-[#093FB4] mb-2 text-center">Create Your Account</h2>
        <p className="text-sm text-gray-600 text-center mb-6">
          Join us and explore your reports in a smarter way.
        </p>

        {error && <div className="text-red-500 text-sm mb-4 text-center">{error}</div>}

        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
              placeholder="Your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
              placeholder="example@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#093FB4]"
              placeholder="Create a strong password"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#093FB4] hover:bg-blue-800 text-white py-3 rounded-lg font-semibold transition"
          >
            Sign Up
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="text-[#ED3500] font-semibold hover:underline">
            Login here
          </Link>
        </div>

        <div className="mt-6 bg-[#FFD8D8] p-3 rounded-lg text-center text-sm text-[#093FB4] shadow-inner">
          Your privacy is our priority. We ensure your data is secure and confidential.
        </div>
      </div>
    </div>
  );
}

export default SignupPage;
