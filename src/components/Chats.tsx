'use client';

import SearchIcon from '@mui/icons-material/Search';
import React from 'react';

const dummyChats = [
  {
    avatar: null, // yoki URL bo'lishi mumkin
    name: "Najot Ta'lim guruhi",
    message: 'Elbek Zokirjanov: ...',
    time: '2:57PM',
    unread: 4,
  },
  {
    avatar: 'https://invalid-url.com/avatar.jpg', // noto'g'ri URL test uchun
    name: 'FullStack FN3',
    message: 'Nasriddinov: Nima gap?',
    time: '2:45PM',
    unread: 1,
  },
  {
    avatar: null,
    name: 'Haad TC Chat',
    message: "Men 2 o'rin deb yozgan...",
    time: '2:38PM',
    unread: 410,
  },
  {
    avatar: null,
    name: 'FullStack Senior Devs',
    message: 'Abrobek: tiiiiiiiiiiiiiii...',
    time: 'Wed',
  },
  {
    avatar: null,
    name: 'Supper Jamoa',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Supper Jamoa',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Supsasaper Jamoa',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Supper Jamoa haha',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Supper Jamoawertyui',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'D.M',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Supper Jamoa',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Shirina',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Abror',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Alisher',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'nma gap',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'anqa',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Bla',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'nmadir',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  },
  {
    avatar: null,
    name: 'Aqili guruh',
    message: 'Akhiddin: Ok',
    time: '8/31/25',
  }
];

// Ismning birinchi harflarini olish funksiyasi
const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

// Rangli background uchun
const getAvatarColor = (name: string) => {
  const colors = [
    'bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500',
    'bg-purple-500', 'bg-pink-500', 'bg-indigo-500', 'bg-teal-500'
  ];
  const index = name.length % colors.length;
  return colors[index];
};

const Chats: React.FC = () => {
  // Stories uchun uniq userlar ro'yxatini yaratish (masalan, chatlarning name dan)
  const users = dummyChats.map(chat => ({
    name: chat.name,
    avatar: chat.avatar,
  }));

  return (
    <div className="w-full h-screen bg-gray-900 text-white flex flex-col">
      {/* 🔍 Search bar */}
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

      {/* 👤 Stories (Users avatars horizontally scrollable) */}
      <div className="flex gap-3 px-4 pb-3 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {users.map((user, idx) => (
          <div key={idx} className="flex flex-col items-center min-w-[60px]">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden ${user.avatar ? 'bg-gray-600' : getAvatarColor(user.name)}`}
            >
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const parent = target.parentElement;
                    if (parent) {
                      parent.className = `w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden ${getAvatarColor(user.name)}`;
                      parent.innerHTML = `<span>${getInitials(user.name)}</span>`;
                    }
                  }}
                />
              ) : (
                <span>{getInitials(user.name)}</span>
              )}
            </div>
            <span className="mt-1 text-xs truncate w-full text-center">{user.name}</span>
          </div>
        ))}
      </div>

      {/* 📄 Chats List */}
      <div className="flex-1 overflow-y-auto">
        {dummyChats.map((chat, index) => (
          <div
            key={index}
            className="flex items-center px-4 py-3 hover:bg-gray-700 transition cursor-pointer"
          >
            {/* Avatar va unread container */}
            <div className="relative">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden ${chat.avatar ? 'bg-gray-600' : getAvatarColor(chat.name)}`}>
                {chat.avatar ? (
                  <img
                    src={chat.avatar}
                    alt={chat.name}
                    className="w-full h-full object-cover rounded-full"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      const parent = target.parentElement;
                      if (parent) {
                        parent.className = `w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm overflow-hidden ${getAvatarColor(chat.name)}`;
                        parent.innerHTML = `<span>${getInitials(chat.name)}</span>`;
                      }
                    }}
                  />
                ) : (
                  <span>{getInitials(chat.name)}</span>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 ml-3 border-b border-gray-700 pb-2">
              <div className="flex justify-between items-start">
                <p className="font-semibold text-white text-sm truncate">{chat.name}</p>

                <span className="text-xs text-gray-400 whitespace-nowrap">{chat.time}</span>
              </div>

              {/* Message va unread */}
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
        ))}
      </div>
    </div>
  );
};

export default Chats;
