'use client';

import ChatIcon from '@mui/icons-material/Chat';
import GroupsIcon from '@mui/icons-material/Groups';
import MenuIcon from '@mui/icons-material/Menu';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import React, { useState } from 'react';

type NavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

const navItems: NavItem[] = [
  { id: 'main', label: '', icon: <MenuIcon fontSize="large" /> },
  { id: 'all', label: 'All Chats', icon: <ChatIcon fontSize="large" /> },
  { id: 'personal', label: 'Personal', icon: <PersonIcon fontSize="large" /> },
  { id: 'groups', label: 'Groups', icon: <GroupsIcon fontSize="large" /> },
  { id: 'settings', label: 'Settings', icon: <SettingsIcon fontSize="large" /> },
];

const Folder: React.FC = () => {
  const [activeId, setActiveId] = useState<string>('all');

  return (
    <div className="h-screen w-20 bg-gray-900 text-white flex flex-col items-center py-6 gap-4 fixed left-0 top-0">
      {navItems.map((item) => (
        <div
          key={item.id}
          onClick={() => setActiveId(item.id)}
          className={`flex flex-col items-center gap-1 p-2 rounded-md cursor-pointer transition-all
            ${activeId === item.id
              ? 'bg-white/40 text-white'
              : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
        >
          <div className="w-6 h-6 flex items-center justify-center">{item.icon}</div>
          {item.id && (
            <span className="text-[10px] text-center">{item.label}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default Folder;
