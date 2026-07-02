import React from 'react';
import { Send } from 'lucide-react';

export default function ChatView({
  activeSpace,
  chatMessages,
  typedMessage,
  setTypedMessage,
  handleSendChatMessage,
  chatScrollerRef
}) {
  return (
    <div className="flex flex-col flex-1 h-full min-h-[500px] bg-white border border-gray-200 rounded-xl overflow-hidden shadow-2xs">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center justify-between">
        <span className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
          Discussion - {activeSpace.name}
        </span>
        <span className="text-[10px] text-gray-400">2 members online</span>
      </div>

      <div ref={chatScrollerRef} className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map(msg => {
          const isSelf = msg.sender === 'Hoang Bang Giang';
          return (
            <div key={msg.id} className={`flex items-start gap-2.5 max-w-[80%] ${isSelf ? 'ml-auto flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-3xs flex-shrink-0 ${
                isSelf ? 'bg-purple-600' : 'bg-blue-600'
              }`}>
                {msg.avatar}
              </div>
              <div>
                <div className={`flex items-baseline gap-1.5 ${isSelf ? 'justify-end' : ''}`}>
                  <span className="text-xs font-bold text-gray-800">{msg.sender}</span>
                  <span className="text-[9px] text-gray-400">{msg.time}</span>
                </div>
                <div className={`mt-1 p-3 rounded-2xl text-xs leading-relaxed shadow-3xs border ${
                  isSelf 
                    ? 'bg-purple-600 text-white border-purple-600 rounded-tr-none' 
                    : 'bg-gray-100 text-gray-700 border-gray-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <form onSubmit={handleSendChatMessage} className="p-3 border-t border-gray-150 flex items-center gap-2 bg-gray-50">
        <input
          type="text"
          placeholder={`Message #discussion in ${activeSpace.name}...`}
          className="flex-1 text-xs px-3.5 py-2.5 bg-white border border-gray-200 rounded-xl outline-none focus:border-purple-500"
          value={typedMessage}
          onChange={(e) => setTypedMessage(e.target.value)}
        />
        <button
          type="submit"
          className="w-9 h-9 bg-purple-600 hover:bg-purple-700 text-white rounded-xl flex items-center justify-center shadow-sm cursor-pointer transition-colors"
        >
          <Send size={14} />
        </button>
      </form>
    </div>
  );
}
