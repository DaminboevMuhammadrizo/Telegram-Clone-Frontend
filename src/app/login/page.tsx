'use client';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Login: React.FC = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [alertMsg, setAlertMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // base url: NEXT_PUBLIC_BASE_URL clientda mavjud bo'lsa ishlatamiz, aks holda empty string
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAlertMsg(null);

    if (!username || !password) {
      setAlertMsg('Iltimos, foydalanuvchi nomi va parolni kiriting.');
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post(
        `${baseURL}/auth/login`,
        { username, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const data = res.data;
      if (data?.accessToken && data?.refreshToken) {
        localStorage.setItem('AccessToken', data.accessToken);
        localStorage.setItem('RefreshToken', data.refreshToken);
        router.push('/');
      } else {
        setAlertMsg(data?.message ?? 'Tizimdan noma\'lum javob olindi.');
      }
    } catch (err: any) {
      // axios xatoliklarini to'g'ri tutish
      if (axios.isAxiosError(err)) {
        console.log(err, 'err')
        const serverMsg = err.response?.data?.message || err.response?.data?.error || null;

        if (serverMsg) {
          setAlertMsg(serverMsg);
        } else if (err.response) {
          console.log(err, 'object')
          setAlertMsg(`${err.response.statusText ? 'Server xatosi' : err.response.statusText} : ${err.response.status}`);
        } else {
          setAlertMsg('Tarmoqqa ulanishda xatolik yuz berdi. Iltimos qayta urinib ko\'ring.');
        }
      } else {
        setAlertMsg('Noma\'lum xatolik yuz berdi.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900">
      <div className="w-full max-w-sm bg-gray-800 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold mb-6 text-center">Login</h2>

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

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full mt-2 p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your username"
              autoComplete="username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full mt-2 p-3 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter your password"
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 ${loading ? 'bg-indigo-400 cursor-wait' : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            disabled={loading}
          >
            {loading ? 'Kuting...' : 'Login'}
          </button>

          <p className="mt-4 text-center text-sm text-gray-300">
            Akkauntingiz yo'qmi?{' '}
            <span
              role="button"
              onClick={() => router.push('/register')}
              className="text-indigo-400 hover:underline cursor-pointer"
            >
              Ro'yxatdan o'ting
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
