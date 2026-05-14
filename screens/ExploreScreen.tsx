import React, { useState } from 'react';
import { 
  MapPin, Search, 
  Compass, Calendar, Clock, Home, MessageCircle, User
} from 'lucide-react';
import { ScreenName } from '../types';

interface ExploreScreenProps {
  onNavigate: (screen: ScreenName) => void;
  joinedPlanIds: Set<number>;
  onTogglePlan: (id: number) => void;
}

const PLANS = [
  { 
    id: 1, 
    title: 'Morning Brew', 
    location: 'The Daily Grind', 
    time: 'Sun, 10 AM', 
    color: 'text-[#8B5CF6]', 
    img: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=400&fit=crop' 
  },
  { 
    id: 2, 
    title: 'Trivia Night', 
    location: 'Hops & Puzzles', 
    time: 'Fri, 7 PM', 
    color: 'text-[#10B981]', 
    img: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=400&fit=crop' 
  }
];

const ExploreScreen: React.FC<ExploreScreenProps> = ({ onNavigate, joinedPlanIds, onTogglePlan }) => {
  const [search, setSearch] = useState('');

  return (
    <div className="flex flex-col h-screen bg-[#F5F0FF] dark:bg-gray-950 font-sans overflow-hidden transition-colors">
      {/* Top Map Section */}
      <div className="h-[40%] relative">
        <div className="absolute top-[30%] left-[25%] group animate-bounce">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
            <MapPin size={20} className="text-[#8B5CF6]" fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>
        <div className="absolute top-[55%] left-[65%] group animate-bounce delay-150">
          <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-xl">
            <MapPin size={20} className="text-[#10B981]" fill="currentColor" fillOpacity={0.2} />
          </div>
        </div>

        <div className="absolute top-10 left-6 right-6">
          <div className="bg-white rounded-2xl shadow-lg border border-white/50 flex items-center px-5 py-4">
            <Search size={22} className="text-gray-300 mr-3" />
            <input 
              type="text"
              placeholder="Search events, plans..."
              className="flex-1 bg-transparent outline-none text-[16px] text-gray-700 placeholder-gray-300 font-medium"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="flex-1 bg-white dark:bg-gray-900 rounded-t-[40px] shadow-[0_-15px_50px_rgba(0,0,0,0.05)] relative z-20 overflow-hidden flex flex-col">
        <div className="w-12 h-1 bg-gray-100 dark:bg-gray-800 rounded-full mx-auto mt-4 mb-6"></div>

        <div className="px-8 flex justify-between items-center mb-8">
          <div className="w-14 h-14 bg-[#F5F0FF] dark:bg-gray-800 rounded-[20px] flex items-center justify-center">
            <Calendar size={28} className="text-[#8B5CF6]" />
          </div>
          <button className="text-[13px] font-bold text-[#8B5CF6] tracking-widest uppercase">SEE MAP</button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 pb-32 scrollbar-hide">
          <div className="flex flex-col gap-6">
            {PLANS.filter(p => p.title.toLowerCase().includes(search.toLowerCase())).map(plan => {
              const isJoined = joinedPlanIds.has(plan.id);
              return (
                <div key={plan.id} className="flex gap-4 items-center animate-fade-in-up">
                  <div className="w-24 h-24 rounded-[30px] overflow-hidden shadow-sm flex-shrink-0">
                    <img src={plan.img} className="w-full h-full object-cover" alt={plan.title} />
                  </div>
                  <div className="flex-1">
                    <h4 className={`text-[17px] font-bold ${plan.color} leading-none mb-1.5`}>{plan.title}</h4>
                    <div className="flex items-center gap-1.5 text-gray-400">
                      <Clock size={16} />
                      <span className="text-[13px] font-medium">{plan.time}</span>
                    </div>
                  </div>
                  <button onClick={() => onTogglePlan(plan.id)} className={`px-7 py-2.5 rounded-full text-[14px] font-bold transition-all active:scale-95 border ${isJoined ? 'bg-[#10B981] border-[#10B981] text-white' : 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 text-gray-700 dark:text-gray-300'}`}>
                    {isJoined ? 'Joined' : 'Join'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Standard Bottom Nav Bar (Matches ChatScreen Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 px-8 py-5 transition-colors">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button onClick={() => onNavigate('home')} className="flex flex-col items-center gap-1.5 group">
            <Home className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">Home</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5">
            <Search className="w-6 h-6 text-primary" />
            <span className="text-[10px] font-black text-primary">Search</span>
          </button>
          
          <button onClick={() => onNavigate('chat')} className="flex flex-col items-center gap-1.5 group">
            <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">Chat</span>
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

export default ExploreScreen;