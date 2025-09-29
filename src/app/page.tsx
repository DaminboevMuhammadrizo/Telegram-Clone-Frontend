'use client'

import Chats from "@/components/Chats";
import Folder from "@/components/Folder";
import Info from "@/components/Info";
import Message from "@/components/message";
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

function Page() {
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [chatData, setChatData] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('AccessToken');

    if (!token) {
      router.push('/login');
    }
  }, [router]);

  const handleChatSelect = (chatId: string, chatData: any) => {
    setSelectedChatId(chatId);
    setChatData(chatData);  // Tanlangan chat haqida ma'lumotni saqlash
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <div className="w-20 bg-gray-900">
        <Folder />
      </div>

      <div className="w-[300px] bg-gray-800 border-l border-gray-700">
        <Chats onChatSelect={handleChatSelect} selectedChatId={selectedChatId} />
      </div>

      <div className="flex-1 bg-gray-900">
        <Message chatId={selectedChatId} chatData={chatData} />
      </div>

      <div className="w-[350px] bg-gray-800 border-l border-gray-700 hidden lg:block">
        <Info />
      </div>
    </div>
  );
}

export default Page;
