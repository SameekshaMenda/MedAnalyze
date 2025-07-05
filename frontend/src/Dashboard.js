import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [history, setHistory] = useState([]);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) return navigate('/login');

    axios
      .get('http://localhost:5000/history', {
        headers: { Authorization: token },
      })
      .then((res) => {
        setHistory(res.data.history);
      });

    try {
      const base64Payload = token.split('.')[1];
      const decoded = JSON.parse(atob(base64Payload));
      const userEmail = decoded.email;
      setUsername(userEmail);
    } catch (error) {
      console.error('Invalid token');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#FFFCFB] py-10 px-4 sm:px-6 lg:px-8 flex justify-center items-start">
      <div className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl p-6 sm:p-10 space-y-10 relative">
        
        {/* Logout Button */}
        <div className="absolute top-4 right-4">
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-[#093FB4] text-white rounded-lg text-sm font-semibold hover:bg-blue-800 transition"
          >
            Logout
          </button>
        </div>

        {/* Header */}
        <div className="space-y-2 border-b border-[#FFD8D8] pb-6">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#ED3500]">
            Welcome, {username.split('@')[0] || username}
          </h1>
          <p className="text-gray-600 text-base sm:text-lg">
            Access your medical report analysis history and begin a new diagnosis anytime.
          </p>
        </div>

        {/* Motivational Banner */}
        <div className="bg-[#FFD8D8] text-[#093FB4] rounded-lg p-4 sm:p-6 text-center shadow">
          <p className="text-base sm:text-lg font-medium">
            “Good health begins with understanding — analyze reports with clarity and confidence.”
          </p>
        </div>

        {/* History Section */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold text-[#093FB4] text-center sm:text-left">
            Your Analysis History
          </h2>

          {history.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[400px] overflow-y-auto pr-1">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="bg-[#FFF8F6] border border-[#FFD8D8] rounded-xl p-4 hover:shadow-lg transition duration-300"
                >
                  <p className="text-sm mb-2 text-gray-800">
                    <span className="font-semibold text-[#ED3500]">Question:</span> {item.question}
                  </p>
                  <p className="text-sm text-gray-700">
                    <span className="font-semibold text-[#093FB4]">Answer:</span> {item.answer}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center italic">
              No analysis history yet. Start your first one below.
            </p>
          )}
        </div>

        {/* CTA Button */}
        <div className="flex justify-center">
          <button
            onClick={() => navigate('/analyze')}
            className="w-full sm:w-auto px-8 py-3 bg-[#ED3500] text-white text-lg rounded-lg font-semibold shadow-md hover:bg-[#c32d00] transition duration-300"
          >
            Start New Analysis
          </button>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
