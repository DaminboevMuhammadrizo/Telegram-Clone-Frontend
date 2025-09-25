'use client'

import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import React, { useState } from 'react';

interface MessageData {
  id: number;
  type: 'text' | 'file' | 'link';
  text?: string;
  fileName?: string;
  editTime?: string;
  time: string;
  isEdited?: boolean;
  isOwn: boolean;
  sender?: string;
  url?: string;
  title?: string;
  description?: string;
  reactions?: string[];
  isReplied?: boolean;
}

const Message: React.FC = () => {
  const [messageText, setMessageText] = useState<string>('');

  // Dummy messages data
  const messages: MessageData[] = [
    {
      id: 1,
      type: 'file',
      fileName: 'tuzimzz.!?',
      editTime: '10:17 PM',
      time: '10:17 PM',
      isEdited: true,
      isOwn: true
    },
    {
      id: 2,
      type: 'link',
      url: 'https://github.com/DaminboevMuhammadrizoNestJs-mini-crud',
      title: 'GitHub',
      description: 'GitHub - DaminboevMuhammadrizoNestJs-mini-crud\nContribute to DaminboevMuhammadrizoNestJs-mini-crud development by creating an account on GitHub',
      time: '10:17 PM',
      reactions: ['👍', '❓'],
      isOwn: true
    },
    {
      id: 3,
      type: 'text',
      text: 'mana shunda sizga kk backend yozilgan',
      time: '10:17 PM',
      isOwn: false,
      sender: 'D.M'
    },
    {
      id: 4,
      type: 'text',
      text: 'mana shunda sizga kk backend yozilgan\nMuhammadyabyoga aytsez serverga qoyib bersa kk i?',
      time: '10:18 PM',
      isOwn: false,
      sender: 'D.M'
    },
    {
      id: 5,
      type: 'text',
      text: 'man qoymaganmanda bolmasa qoyib berar edim !?',
      time: '10:19 PM',
      isOwn: true
    },
    {
      id: 6,
      type: 'text',
      text: 'tushunarli',
      time: '10:41 PM',
      isOwn: false,
      sender: 'tushunarli'
    },
    {
      id: 7,
      type: 'text',
      text: 'shu joygacha qilb berganizgayam katta raxmat',
      time: '10:42 PM',
      isOwn: false
    },
    {
      id: 8,
      type: 'text',
      text: 'Muhammadyabyoga aytsez serverga ...',
      time: '10:42 PM',
      isOwn: false,
      sender: 'D.M',
      isReplied: true
    },
    {
      id: 9,
      type: 'text',
      text: 'men aytib qoydirb olaman okk',
      time: '10:42 PM',
      isOwn: false
    },
    {
      id: 10,
      type: 'text',
      text: 'ha agar mobodo muamo chiqsa yoki qadrydlr funksiya qoshosh kk bola aytoras',
      time: '10:42 PM',
      isOwn: true
    },
    {
      id: 11,
      type: 'text',
      text: 'hop',
      time: '10:42 PM',
      isOwn: true
    },
    {
      id: 12,
      type: 'text',
      text: 'boldi gap yo',
      time: '10:42 PM',
      isOwn: false
    }
  ];

  const getAvatarInitials = (name: string): string => {
    if (!name) return '';
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  const getAvatarColor = (name: string): string => {
    if (!name) return 'bg-gray-500';
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[name.length % colors.length];
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold mr-3">
            DM
          </div>
          <div>
            <h2 className="font-semibold text-white">+998 91 111 56 47</h2>
            <p className="text-xs text-gray-400">last seen recently</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SearchIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
          <PhoneIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
          <VideocamIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
          <MoreVertIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
            {!message.isOwn && (
              <div className={`w-8 h-8 rounded-full ${getAvatarColor(message.sender || '')} flex items-center justify-center text-xs font-semibold mr-2 mt-2`}>
                {message.sender ? getAvatarInitials(message.sender) : ''}
              </div>
            )}

            <div className={`max-w-md px-4 py-2 rounded-2xl ${message.isOwn
              ? 'bg-blue-600 text-white rounded-br-sm'
              : 'bg-gray-700 text-white rounded-bl-sm'
              }`}>

              {message.type === 'file' && (
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                    <AttachFileIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-medium">{message.fileName}</p>
                    <div className="flex items-center space-x-2 text-xs text-gray-300">
                      <span>edited {message.editTime}</span>
                      {message.isEdited && <span>✓✓</span>}
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'link' && (
                <div className="space-y-2">
                  <div className="bg-gray-600 rounded-lg p-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-12 h-12 bg-black rounded-lg flex items-center justify-center">
                        <div className="w-8 h-8 bg-orange-500 rounded-full"></div>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{message.title}</h4>
                        <p className="text-xs text-gray-300 mt-1">{message.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {message.reactions?.map((reaction, idx) => (
                        <span key={idx} className="text-sm">{reaction}</span>
                      ))}
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-gray-300">
                      <span>{message.time}</span>
                      <span>✓✓</span>
                    </div>
                  </div>
                </div>
              )}

              {message.type === 'text' && (
                <div>
                  {message.isReplied && (
                    <div className="border-l-2 border-blue-400 pl-2 mb-2 text-xs text-gray-300">
                      <p className="text-blue-400">{message.sender}</p>
                      <p>mana shunda sizga kk backend yozilgan...</p>
                    </div>
                  )}
                  <p className="text-sm whitespace-pre-line">{message.text}</p>
                  <div className="flex items-center justify-end mt-1 space-x-1">
                    <span className="text-xs text-gray-300">{message.time}</span>
                    {message.isOwn && <span className="text-xs text-blue-300">✓✓</span>}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <AttachFileIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
          <div className="flex-1 bg-gray-700 rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder="Write a message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm"
            />
            <EmojiEmotionsIcon className="w-5 h-5 text-gray-400 cursor-pointer ml-2" />
          </div>
          {messageText.trim() ? (
            <SendIcon className="w-5 h-5 text-blue-400 cursor-pointer" />
          ) : (
            <div className="flex space-x-2">
              <CameraAltIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
              <MicIcon className="w-5 h-5 text-gray-400 cursor-pointer" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
