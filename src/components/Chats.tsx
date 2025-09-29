'use client';

import { Chat, ChatsProps } from '@/utils/types/types';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import React, { useEffect, useState } from 'react';




const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = name.length % colors.length;
  return colors[index];
};

const Chats: React.FC<ChatsProps> = ({ onChatSelect, selectedChatId }) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [error, setError] = useState<string | null>(null);
  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const token = localStorage.getItem('AccessToken');
        const res = await axios.get(`${baseURL}/chats/all`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const rawChats = res.data?.data || [];

        const enriched = rawChats.map((chat: any) => ({
          ...chat,
          message: 'Salom!',
          time: '2:57PM',
          unread: Math.random() > 0.5 ? Math.floor(Math.random() * 10) : undefined,
        }));

        setChats(enriched);
        setError(null);
      } catch (error: any) {
        if (error.response?.status === 404) {
          setError('Chatlar mavjud emas');
        } else {
          setError('Chatlarni olishda xatolik!');
        }
      }
    };

    fetchChats();
  }, [baseURL]);

  const handleChatClick = (chat: Chat) => {
    onChatSelect(chat.id, chat);
  };

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      <div className="px-4 pt-4 pb-2">
        <div className="relative">
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-gray-800 text-white rounded-md pl-10 pr-3 py-2 text-sm focus:outline-none"
          />
          <SearchIcon className="absolute left-2 top-2.5 text-gray-400" fontSize="small" />
        </div>
      </div>

      {error && (
        <div className="w-full text-center py-4 bg-gray-700">
          <p className="text-lg text-gray-300">{error}</p>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {chats.length === 0 && !error ? (
          <div className="w-full text-center py-4 bg-gray-700">
            <p className="text-lg text-gray-300">Chatlar mavjud emas</p>
          </div>
        ) : (
          chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center px-4 py-3 hover:bg-gray-700 transition cursor-pointer ${selectedChatId === chat.id ? 'bg-gray-700' : ''
                }`}
              onClick={() => handleChatClick(chat)}
            >
              <div className="relative">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden ${chat.avatar ? 'bg-gray-600' : getAvatarColor(chat.name)}`}>
                  {chat.avatar ? (
                    <img
                      src={chat.avatar}
                      alt={chat.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <span>{getInitials(chat.name)}</span>
                  )}
                </div>
              </div>

              <div className="flex-1 ml-3 border-b border-gray-700 pb-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-white text-sm truncate">{chat.name}</p>
                  <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-gray-400 text-xs truncate max-w-[80%]">
                    {chat.message}
                  </p>
                  {chat.unread && (
                    <span className="ml-2 bg-blue-500 text-white text-xs rounded-full px-2 leading-none font-semibold select-none">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Chats;
