import React, { useState, useMemo } from 'react';
import { 
  Search, Home, MessageCircle, User, 
  Plus, Star
} from 'lucide-react';
import { ScreenName, ChatUser } from '../types';

const INITIAL_MESSAGE_LIST = [
  { 
    id: 1, 
    name: 'Alex Johnson', 
    message: 'Hey! Are you going to the eve...', 
    time: '2m ago', 
    unread: 1, 
    image: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop', 
    isOnline: true 
  },
  { 
    id: 2, 
    name: 'Jordan Smith', 
    message: 'Sent a photo', 
    time: '15m ago', 
    unread: 2, 
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop', 
    isOnline: false 
  },
  { 
    id: 3, 
    name: 'Casey Williams', 
    message: 'That sounds great, thanks!', 
    time: 'Yesterday', 
    unread: 0, 
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&h=200&fit=crop', 
    isOnline: true 
  },
  { 
    id: 4, 
    name: 'Taylor Kim', 
    message: 'Let me know when you\'re free to c...', 
    time: 'Mon', 
    unread: 0, 
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop', 
    isOnline: false 
  }
];

const STATIC_CONNECTIONS = [
  { id: 101, name: 'Sarah', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop' },
  { id: 102, name: 'Mike', image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop' },
];

interface ChatScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onChatSelect: (user: ChatUser) => void;
  connectedIds: Set<number>;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ onNavigate, onChatSelect, connectedIds }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [messages, setMessages] = useState(INITIAL_MESSAGE_LIST);

  const filteredMessages = useMemo(() => {
    return messages.filter(msg => 
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      msg.message.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, messages]);

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(msg => ({ ...msg, unread: 0 })));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-32 transition-colors duration-300 font-sans select-none">
      {/* Header - Perfect match for the requested logo and text placement */}
      <div className="pt-8 px-6 pb-4 flex justify-between items-center bg-white dark:bg-gray-950 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-[12px] flex items-center justify-center shadow-lg shadow-primary/20">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
               <path d="M12 3C7.029 3 3 6.582 3 11c0 1.554.498 3.003 1.378 4.212L3 21l5.788-1.378C10.003 20.502 11.452 21 13 21c4.971 0 9-3.582 9-8s-4.029-10-9-10z" />
             </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-primary uppercase">ALIKE</h1>
        </div>
        {/* Profile removed as requested */}
        <div className="w-10"></div> 
      </div>

      <div className="px-6 space-y-8 mt-2">
        {/* Functional Search Bar */}
        <div className="relative group animate-fade-in">
           <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
           <input 
             type="text" 
             placeholder="Search friends..." 
             className="w-full bg-gray-50 dark:bg-gray-900 rounded-xl py-4 pl-12 pr-4 text-sm outline-none text-gray-800 dark:text-white border border-gray-100 dark:border-gray-800 focus:border-primary/40 focus:bg-white transition-all shadow-sm"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
        </div>

        {/* New Connections Rail */}
        <div>
          <h2 className="text-[17px] font-black text-gray-900 dark:text-white mb-5 tracking-tight">New Connections</h2>
          <div className="flex gap-6 overflow-x-auto scrollbar-hide pb-2 px-1">
            <div className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer group">
              <div className="w-16 h-16 rounded-full border-2 border-dashed border-primary/30 flex items-center justify-center bg-white dark:bg-gray-900 group-hover:border-primary group-active:scale-95 transition-all">
                 <Plus className="text-primary w-6 h-6" strokeWidth={3} />
              </div>
              <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500">Add New</span>
            </div>

            {STATIC_CONNECTIONS.map((user, idx) => (
              <div key={user.id} className="flex flex-col items-center gap-2 flex-shrink-0 cursor-pointer animate-pop-in" style={{ animationDelay: `${idx * 100}ms` }}>
                <div className="w-16 h-16 rounded-full p-[3px] bg-gradient-to-tr from-primary/30 to-secondary/30 hover:scale-105 active:scale-95 transition-transform">
                   <div className="w-full h-full rounded-full border-2 border-white dark:border-gray-900 overflow-hidden shadow-sm">
                      <img src={user.image} className="w-full h-full object-cover" alt={user.name} />
                   </div>
                </div>
                <span className="text-[11px] font-bold text-gray-700 dark:text-gray-300">{user.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Messages List */}
        <div>
          <div className="flex justify-between items-center mb-6 px-1">
            <h2 className="text-[17px] font-black text-gray-900 dark:text-white tracking-tight">Messages</h2>
            <button onClick={handleMarkAllRead} className="text-[12px] font-black text-primary hover:opacity-70 transition-opacity uppercase tracking-wider active:scale-95">
                Mark all read
            </button>
          </div>

          <div className="space-y-4">
            {filteredMessages.length > 0 ? filteredMessages.map((msg, idx) => (
              <div 
                key={msg.id} 
                onClick={() => onChatSelect(msg as any)} 
                className="flex items-center gap-4 p-4 bg-white dark:bg-gray-900 rounded-[24px] cursor-pointer hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800 animate-fade-in-up"
                style={{ animationDelay: `${200 + idx * 75}ms` }}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 shadow-sm">
                     <img src={msg.image} className="w-full h-full object-cover" alt={msg.name} />
                  </div>
                  {msg.isOnline && (
                    <div className="absolute bottom-0.5 right-0.5 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-900 rounded-full shadow-sm"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-black text-[15px] text-gray-900 dark:text-white truncate tracking-tight">{msg.name}</h4>
                    <span className="text-[10px] text-primary/70 font-black uppercase tracking-widest">{msg.time}</span>
                  </div>
                  <p className="text-[13px] text-gray-500 dark:text-gray-400 truncate leading-snug font-medium">{msg.message}</p>
                </div>
                {msg.unread > 0 && (
                  <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] text-white font-black shadow-lg shadow-primary/30 animate-pop-in">
                    {msg.unread}
                  </div>
                )}
              </div>
            )) : (
              <div className="py-20 text-center text-gray-400 font-bold animate-fade-in">No results found</div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Action Button - REMOVED AS REQUESTED */}

      {/* Bottom Nav Bar - Precise Screenshot Style */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 px-8 py-5 transition-colors">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1.5 group">
            <Home className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">Home</span>
          </button>
          
          <button onClick={() => onNavigate('explore')} className="flex flex-col items-center gap-1.5 group">
            <Search className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">Search</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5">
            <div className="text-primary">
                <MessageCircle className="w-6 h-6 fill-primary" />
            </div>
            <span className="text-[10px] font-black text-primary">Chat</span>
          </button>
          
          <button onClick={() => onNavigate('profile')} className="flex flex-col items-center gap-1.5 group">
            <User className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;