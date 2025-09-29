'use client';

import { MessageData, MessageProps, MessageType } from '@/utils/types/types';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import MicIcon from '@mui/icons-material/Mic';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import PhoneIcon from '@mui/icons-material/Phone';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import VideocamIcon from '@mui/icons-material/Videocam';
import axios from 'axios';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const Message: React.FC<MessageProps> = ({ chatId, chatData }) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [messageText, setMessageText] = useState<string>('');
  const [messagesList, setMessagesList] = useState<MessageData[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [currentUserName, setCurrentUserName] = useState<string>('');
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<number[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const socketRef = useRef<Socket | null>(null);

  const baseURL = process.env.NEXT_PUBLIC_BASE_URL;
  const wsURL = process.env.NEXT_PUBLIC_WS_URL || 'http://localhost:4000';

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messagesList]);

  // Get current user info
  useEffect(() => {
    const getUserInfo = async () => {
      try {
        const token = localStorage.getItem('AccessToken');
        const res = await axios.get(`${baseURL}/users/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          setCurrentUserId(res.data.data.id);
          setCurrentUserName(`${res.data.data.firstName} ${res.data.data.lastName}`);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
      }
    };

    getUserInfo();
  }, [baseURL]);

  // Fetch initial messages
  useEffect(() => {
    const getMessages = async () => {
      if (!chatId || !currentUserId) return;

      try {
        const token = localStorage.getItem('AccessToken');
        const res = await axios.get(`${baseURL}/message/all/${chatId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.data.success) {
          const formattedMessages = res.data.data.map((msg: any) => ({
            id: msg.id,
            type: msg.messageType,
            text: msg.messageType === 'text' ? msg.message : undefined,
            fileUrl: msg.audioUrl || msg.videoUrl || msg.imageUrl || msg.documentUrl || undefined,
            fileName: msg.fileName || undefined,
            fileSize: msg.fileSize || undefined,
            time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            sender: `${msg.sender.firstName} ${msg.sender.lastName}`,
            senderId: msg.senderId,
            isOwn: msg.senderId === currentUserId,
          }));

          setMessagesList(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    setMessagesList([]);
    getMessages();
  }, [chatId, currentUserId, baseURL]);

  // WebSocket connection
  useEffect(() => {
    if (!currentUserId || !chatId) return;

    const token = localStorage.getItem('AccessToken');
    if (!token) {
      console.error('No token found');
      return;
    }

    console.log('Connecting to WebSocket...', { wsURL, chatId, currentUserId });

    // Initialize socket
    const socket = io(wsURL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = socket;

    // Connection events
    socket.on('connect', () => {
      console.log('✅ Socket connected:', socket.id);
      socket.emit('join_chat', { chatId: parseInt(chatId) });
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error);
    });

    socket.on('disconnect', (reason) => {
      console.log('⚠️ Socket disconnected:', reason);
    });

    // Chat events
    socket.on('joined_chat', (data) => {
      console.log('✅ Joined chat:', data);
    });

    socket.on('error', (error) => {
      console.error('❌ Socket error:', error);
    });

    // NEW MESSAGE - eng muhim event
    socket.on('new_message', (response: any) => {
      console.log('📩 New message received:', response);

      if (response.success && response.data) {
        const msg = response.data;
        const formattedMessage: MessageData = {
          id: msg.id,
          type: msg.messageType,
          text: msg.messageType === 'text' ? msg.message : undefined,
          fileUrl: msg.audioUrl || msg.videoUrl || msg.imageUrl || msg.documentUrl || undefined,
          fileName: msg.fileName || undefined,
          fileSize: msg.fileSize || undefined,
          time: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          sender: `${msg.sender.firstName} ${msg.sender.lastName}`,
          senderId: msg.senderId,
          isOwn: msg.senderId === currentUserId,
        };

        setMessagesList(prev => {
          const exists = prev.find(m => m.id === formattedMessage.id);
          if (exists) return prev;
          return [...prev, formattedMessage];
        });
      }
    });

    // Typing events
    socket.on('user_typing', ({ userId, username, typing }) => {
      console.log('⌨️ User typing:', { userId, username, typing });

      if (userId === currentUserId) return;

      setTypingUsers(prev => {
        if (typing) {
          return prev.includes(username) ? prev : [...prev, username];
        } else {
          return prev.filter(name => name !== username);
        }
      });
    });

    // Online users
    socket.on('online_users', ({ userIds }) => {
      console.log('👥 Online users:', userIds);
      setOnlineUsers(userIds);
    });

    socket.on('user_joined', ({ userId }) => {
      console.log('👤 User joined:', userId);
      setOnlineUsers(prev => prev.includes(userId) ? prev : [...prev, userId]);
    });

    socket.on('user_left', ({ userId }) => {
      console.log('👋 User left:', userId);
      setOnlineUsers(prev => prev.filter(id => id !== userId));
    });

    // Message sent confirmation
    socket.on('message_sent', (response) => {
      console.log('✅ Message sent confirmation:', response);
    });

    // Cleanup
    return () => {
      console.log('🔌 Disconnecting socket...');
      socket.emit('leave_chat', { chatId: parseInt(chatId) });
      socket.disconnect();
      socketRef.current = null;
    };
  }, [currentUserId, chatId, wsURL]);

  // Handle typing indicator
  const handleTyping = useCallback(() => {
    if (!socketRef.current) return;
    // @ts-ignore

    socketRef.current.emit('typing_start', { chatId: parseInt(chatId) });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        // @ts-ignore

        socketRef.current.emit('typing_stop', { chatId: parseInt(chatId) });
      }
    }, 1000);
  }, [chatId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessageText(e.target.value);
    handleTyping();
  };

  // Send text message
  const handleSendText = async () => {
    if (!messageText.trim() || isSending || !socketRef.current) return;

    setIsSending(true);
    const messageToSend = messageText;
    setMessageText('');

    // Stop typing
    // @ts-ignore

    socketRef.current.emit('typing_stop', { chatId: parseInt(chatId) });

    try {
      console.log('📤 Sending message via WebSocket...');

      socketRef.current.emit('send_message', {
        messageType: 'text',
        message: messageToSend,
        // @ts-ignore

        chatId: parseInt(chatId),
      });

    } catch (error) {
      console.error("Error sending message:", error);
      setMessageText(messageToSend);
    } finally {
      setIsSending(false);
    }
  };

  // Handle file upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !socketRef.current) return;

    setIsSending(true);

    try {
      const token = localStorage.getItem('AccessToken');
      const formData = new FormData();
      formData.append('file', file);
      // @ts-ignore
      formData.append('chatId', chatId);

      let messageType: MessageType = MessageType.document;
      if (file.type.startsWith('image/')) messageType = MessageType.img;
      else if (file.type.startsWith('audio/')) messageType = MessageType.audio;
      else if (file.type.startsWith('video/')) messageType = MessageType.video;

      formData.append('messageType', messageType);

      console.log('📤 Uploading file...');

      const response = await axios.post(
        `${baseURL}/message/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      if (response.data.success) {
        console.log('✅ File uploaded, sending via WebSocket...');

        const fileName = response.data.data.audioUrl ||
          response.data.data.videoUrl ||
          response.data.data.imageUrl ||
          response.data.data.documentUrl;

        socketRef.current.emit('send_message', {
          messageType: messageType,
          message: response.data.data.message || '',
          // @ts-ignore
          chatId: parseInt(chatId),
          fileName: fileName,
        });
      }
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setIsSending(false);
      e.target.value = '';
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendText();
    }
  };

  // Cleanup
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const isUserOnline = (userId: number) => {
    return onlineUsers.includes(userId);
  };

  const getAvatarInitials = (name: string | undefined): string => {
    if (!name) return '';
    return name.split(' ').map(word => word.charAt(0).toUpperCase()).slice(0, 2).join('');
  };

  const getAvatarColor = (name: string | undefined): string => {
    if (!name) return 'bg-gray-500';
    const colors = ['bg-red-500', 'bg-blue-500', 'bg-green-500', 'bg-yellow-500', 'bg-purple-500', 'bg-pink-500'];
    return colors[name.length % colors.length];
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center">
          <div className="relative">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold mr-3 ${chatData?.avatar ? 'bg-gray-600' : getAvatarColor(chatData?.name || '')}`}>
              {chatData?.avatar ? (
                <img
                  src={chatData.avatar}
                  alt={chatData.name}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                getAvatarInitials(chatData?.name || '')
              )}
            </div>
            {chatData && isUserOnline(parseInt(chatData.id)) && (
              <div className="absolute bottom-0 right-3 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
            )}
          </div>
          <div>
            <h2 className="font-semibold text-white">{chatData?.name}</h2>
            <p className="text-xs text-gray-400">
              {typingUsers.length > 0
                ? `${typingUsers.join(', ')} yozmoqda...`
                : chatData && isUserOnline(parseInt(chatData.id))
                  ? 'online'
                  : 'last seen recently'
              }
            </p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <SearchIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <PhoneIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <VideocamIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
          <MoreVertIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messagesList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            <p>Bu chat uchun xabarlar yo'q</p>
          </div>
        ) : (
          messagesList.map((message) => (
            <div key={message.id} className={`flex ${message.isOwn ? 'justify-end' : 'justify-start'}`}>
              {!message.isOwn && (
                <div className={`w-8 h-8 rounded-full ${getAvatarColor(message.sender)} flex items-center justify-center text-xs font-semibold mr-2 mt-2 flex-shrink-0`}>
                  {getAvatarInitials(message.sender)}
                </div>
              )}

              <div className={`max-w-md px-4 py-2 rounded-2xl ${message.isOwn ? 'bg-[#182533]' : 'bg-gray-700'} text-white shadow-lg`}>
                {message.type === 'text' && (
                  <div>
                    <p className="text-sm whitespace-pre-line break-words">{message.text}</p>
                    <div className="flex items-center justify-end mt-1 text-xs text-gray-300">
                      <span>{message.time}</span>
                      {message.isOwn && <span className="ml-1">✓✓</span>}
                    </div>
                  </div>
                )}

                {message.type === 'img' && message.fileUrl && (
                  <div>
                    <img
                      src={message.fileUrl}
                      alt="Image"
                      className="max-w-[200px] rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setSelectedImage(message.fileUrl || null)}
                    />
                    <div className="flex items-center justify-end mt-1 text-xs text-gray-300">
                      <span>{message.time}</span>
                      {message.isOwn && <span className="ml-1">✓✓</span>}
                    </div>
                  </div>
                )}

                {message.type === 'audio' && message.fileUrl && (
                  <div>
                    <audio controls className="max-w-[200px]">
                      <source src={message.fileUrl} />
                    </audio>
                    <div className="flex items-center justify-end mt-1 text-xs text-gray-300">
                      <span>{message.time}</span>
                      {message.isOwn && <span className="ml-1">✓✓</span>}
                    </div>
                  </div>
                )}

                {message.type === 'video' && message.fileUrl && (
                  <div>
                    <video controls className="max-w-[200px] rounded-lg">
                      <source src={message.fileUrl} />
                    </video>
                    <div className="flex items-center justify-end mt-1 text-xs text-gray-300">
                      <span>{message.time}</span>
                      {message.isOwn && <span className="ml-1">✓✓</span>}
                    </div>
                  </div>
                )}

                {message.type === 'document' && message.fileUrl && (
                  <div>
                    <div className="flex items-center space-x-2 p-2 bg-gray-600 rounded-lg">
                      <div className="w-8 h-8 bg-blue-500 rounded flex items-center justify-center">
                        <span className="text-xs font-bold">📄</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{message.fileName}</p>
                        {message.fileSize && (
                          <p className="text-xs text-gray-300">
                            {(message.fileSize / 1024 / 1024).toFixed(2)} MB
                          </p>
                        )}
                      </div>
                      <a
                        href={message.fileUrl}
                        download={message.fileName}
                        className="text-blue-400 hover:text-blue-300 text-sm"
                      >
                        Download
                      </a>
                    </div>
                    <div className="flex items-center justify-end mt-1 text-xs text-gray-300">
                      <span>{message.time}</span>
                      {message.isOwn && <span className="ml-1">✓✓</span>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Image preview */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img src={selectedImage} alt="Preview" className="max-h-full max-w-full object-contain" />
        </div>
      )}

      {/* File input */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt"
        onChange={handleFileChange}
      />

      {/* Input area */}
      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <AttachFileIcon
            className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors"
            onClick={() => fileInputRef.current?.click()}
          />
          <div className="flex-1 bg-gray-700 rounded-full px-4 py-2 flex items-center">
            <input
              type="text"
              placeholder={`${chatData?.name}ga xabar yozing...`}
              value={messageText}
              onChange={handleInputChange}
              onKeyDown={handleKeyPress}
              disabled={isSending}
              className="flex-1 bg-transparent text-white placeholder-gray-400 outline-none text-sm disabled:opacity-50"
            />
            <EmojiEmotionsIcon className="w-5 h-5 text-gray-400 cursor-pointer ml-2 hover:text-white transition-colors" />
          </div>
          {messageText.trim() ? (
            <SendIcon
              className={`w-5 h-5 cursor-pointer transition-colors ${isSending ? 'text-gray-400' : 'text-blue-400 hover:text-blue-300'
                }`}
              onClick={handleSendText}
            />
          ) : (
            <div className="flex space-x-2">
              <CameraAltIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
              <MicIcon className="w-5 h-5 text-gray-400 cursor-pointer hover:text-white transition-colors" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Message;
