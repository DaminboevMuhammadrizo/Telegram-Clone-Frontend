import Chats from "@/components/Chats";
import Folder from "@/components/Folder";

function Page() {
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Folder - Sidebar */}
      <div className="w-20 bg-gray-900">
        <Folder />
      </div>

      {/* Chats - middle panel */}
      <div className="w-[300px] bg-gray-800 border-l border-gray-700">
        <Chats />
      </div>

      {/* Main - chat area */}
      <main className="flex-1 bg-gray-800 p-6 text-white overflow-y-auto">
        <h1 className="text-2xl font-bold">Main Chat Area</h1>
      </main>
    </div>
  );
}

export default Page;
