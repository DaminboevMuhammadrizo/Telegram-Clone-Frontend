export interface MessageData {
  id: number;
  type: MessageType;
  text?: string;
  fileUrl?: string;     // audioUrl, videoUrl, imageUrl yoki documentUrl dan biri
  fileName?: string;    // fayl nomi (document yoki image uchun)
  fileSize?: number;    // fayl hajmi (optional)
  time: string;
  isOwn: boolean;
  sender: string;       // user.firstName + " " + user.lastName ko‘rinishi
  senderId: number;
}



export interface ChatData {
  id: string;
  name: string;
  avatar?: string;
}

export interface MessageProps {
  chatId: string | null;
  chatData: ChatData;
}

export interface Chat {
  id: string;
  name: string;
  avatar?: string;
  message: string;
  time: string;
  unread?: number;
}



export interface ChatsProps {
  onChatSelect: (chatId: string, chatData: Chat) => void;
  selectedChatId: string | null;
}


export enum MessageType {
  text = 'text',
  audio = 'audio',
  video = 'video',
  img = 'img',
  document = 'document'
}
