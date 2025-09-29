'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Register: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg(null); // alertni tozalash

    // Maydonlar bo'sh bo'lsa, xato xabarini ko'rsatish
    if (!username || !password || !firstName || !lastName || !birthDate) {
      setAlertMsg('Iltimos, barcha maydonlarni to\'ldiring');
      return;
    }

    const registerData = {
      username,
      password,
      firstName,
      lastName,
      birthDate,
    };

    setLoading(true); // Yuklanayotgan holat

    try {
      const res = await axios.post(`${baseURL}/auth/register`, registerData, {
        headers: { 'Content-Type': 'application/json' },
      });

      const data = res.data;

      if (data?.accessToken && data?.refreshToken) {
        localStorage.setItem('AccessToken', data.accessToken);
        localStorage.setItem('RefreshToken', data.refreshToken);
        setAlertMsg('Ro\'yxatdan o\'tdingiz!');
        router.push('/');
      } else {
        setAlertMsg(data?.message ?? 'Tizimdan noma\'lum javob olindi.');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        const msg = err.response?.data?.message || err.response?.data?.error || 'Server xatosi';
        setAlertMsg(msg);
      } else {
        setAlertMsg('Noma\'lum xatolik yuz berdi.');
      }
    } finally {
      setLoading(false); // Yuklash holatini tugatish
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm bg-gray-800 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Register</h2>

        {/* Chiroyli alert */}
        {alertMsg && (
          <div className="mb-4 p-3 rounded-md bg-red-700/90 border border-red-600 flex items-start justify-between">
            <div className="mr-2">
              <strong className="block text-sm">Xato</strong>
              <p className="text-sm text-red-50 mt-1">{alertMsg}</p>
            </div>
            <button
              onClick={() => setAlertMsg(null)}
              className="text-red-100 hover:text-white ml-2 p-1 rounded-md"
              aria-label="Close alert"
            >
              ✕
            </button>
          </div>
        )}

        <form onSubmit={handleRegister}>
          {/* Username Input */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="w-full mt-2 p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
            />
          </div>

          {/* Password Input */}
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full mt-2 p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </div>

          {/* First Name Input */}
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-300">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              className="w-full mt-2 p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="Enter your first name"
            />
          </div>

          {/* Last Name Input */}
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              className="w-full mt-2 p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Enter your last name"
            />
          </div>

          {/* Birth Date Input */}
          <div className="mb-4">
            <label htmlFor="birthDate" className="block text-sm font-medium text-gray-300">
              Birth Date
            </label>
            <input
              type="date"
              id="birthDate"
              className="w-full mt-2 p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
            />
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Kuting...' : 'Register'}
          </button>

          <p className="text-[#cfcfcf] mt-4 text-center">
            Akkauntingiz bormi?{' '}
            <span
              className="cursor-pointer hover:underline"
              onClick={() => router.push('/login')}
            >
              Hisobingizga kiring
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Register;
