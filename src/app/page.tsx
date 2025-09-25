import Chats from "@/components/Chats";
import Folder from "@/components/Folder";
import Info from "@/components/Info";
import Message from "@/components/message";

function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <div className="w-20 bg-gray-900">
        <Folder />
      </div>

      {/* Chats Panel */}
      <div className="w-[300px] bg-gray-800 border-l border-gray-700">
        <Chats />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 bg-gray-900">
        <Message />
      </div>

      {/* User Info Sidebar */}
      <div className="w-[350px] bg-gray-800 border-l border-gray-700">
        <Info />
      </div>
    </div>
  );
}

export default Page;
