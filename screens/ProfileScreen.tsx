import React, { useState, useRef, useEffect } from 'react';
import { 
  Settings, Grid, Bookmark, Heart, Share2, 
  LogOut, ChevronRight, Shield, HelpCircle, 
  Bell, Home, Compass, MessageCircle, User as UserIcon,
  CheckCircle, Plus, Flame, Star, ChevronLeft, Moon, Sun, Briefcase, MapPin, Link as LinkIcon, MoreHorizontal, Search
} from 'lucide-react';
import { ScreenName, MatchProfile } from '../types';

interface ProfileScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onLogout: () => void;
  isDarkMode?: boolean;
  toggleTheme?: () => void;
  profile?: MatchProfile;
  onConnect: (id: number) => void;
  connectedIds: Set<number>;
}

const DEFAULT_USER = {
  name: 'Alex Johnson',
  age: 24,
  location: 'Austin, TX',
  job: 'Visual Designer',
  website: 'alexdesigns.co',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  cover: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1000&q=80',
  bio: 'Visual designer based in TX. Coffee addict ☕ | Art & Design 🎨\nCapturing moments 📸',
  stats: { friends: '342', following: '120', likes: '4.5k' },
  interests: ['Design', 'Coffee', 'Hiking'],
  photos: [
    'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&h=500&fit=crop',
    'https://images.unsplash.com/photo-1544367563-12123d8965cd?w=500&h=500&fit=crop',
  ],
  highlights: [
    { id: 1, title: 'Travel', img: 'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=150&h=150&fit=crop' },
    { id: 2, title: 'Art', img: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=150&h=150&fit=crop' }
  ]
};

const ProfileScreen: React.FC<ProfileScreenProps> = ({ 
  onNavigate, onLogout, isDarkMode, toggleTheme, profile, onConnect, connectedIds 
}) => {
  const [activeTab, setActiveTab] = useState<'photos' | 'saved'>('photos');
  const [showSettings, setShowSettings] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  
  const isOwn = !profile;
  const user = isOwn ? DEFAULT_USER : { ...DEFAULT_USER, ...profile };
  const isConnected = !isOwn && connectedIds.has(profile!.id);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setScrollY(e.currentTarget.scrollTop);
  };

  const headerOpacity = Math.min(1, Math.max(0, (scrollY - 80) / 100));

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950 font-sans relative overflow-hidden transition-colors duration-300">
      <div className="absolute top-0 left-0 right-0 z-40">
         <div className="absolute inset-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 shadow-sm" style={{ opacity: headerOpacity }}></div>
         <div className="relative flex justify-between items-center px-4 pt-4 pb-2">
             <button onClick={() => onNavigate('home')} className={`p-2 rounded-full transition-colors ${headerOpacity > 0.5 ? 'text-gray-900 dark:text-white' : 'bg-black/20 text-white backdrop-blur-md'}`}><ChevronLeft size={24} /></button>
             <span className="font-black text-gray-900 dark:text-white transition-all duration-300 tracking-tight" style={{ opacity: headerOpacity }}>{user.name}</span>
             <button onClick={() => isOwn ? setShowSettings(true) : onNavigate('home')} className={`p-2 rounded-full transition-colors ${headerOpacity > 0.5 ? 'text-gray-900 dark:text-white' : 'bg-black/20 text-white backdrop-blur-md'}`}><MoreHorizontal size={24} /></button>
         </div>
      </div>

      <div className="absolute inset-0 overflow-y-auto scrollbar-hide z-10" onScroll={handleScroll}>
        <div className="h-[35vh] w-full relative overflow-hidden">
            <img src={user.cover} className="w-full h-full object-cover" style={{ transform: `scale(1.1) translateY(${scrollY * 0.3}px)` }} alt="Cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/60"></div>
        </div>

        <div className="bg-white dark:bg-gray-950 rounded-t-[48px] min-h-[80vh] relative -mt-16 pb-40 transition-colors shadow-[0_-20px_50px_rgba(0,0,0,0.1)]">
            <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto my-6"></div>
            <div className="px-8 relative">
               <div className="flex justify-between items-end -mt-20 mb-6">
                   <div className="relative">
                       <div className="w-32 h-32 rounded-[40px] border-8 border-white dark:border-gray-950 shadow-2xl overflow-hidden bg-white">
                           <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
                       </div>
                   </div>
                   <div className="flex gap-2 mb-2">
                       {isOwn ? <button className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-black rounded-[20px] shadow-xl active:scale-95 transition-all uppercase tracking-widest">Edit Profile</button> : <button onClick={() => onConnect(profile!.id)} className={`px-8 py-3 rounded-[20px] font-black text-xs uppercase tracking-widest shadow-xl transition-all active:scale-95 ${isConnected ? 'bg-emerald-500 text-white shadow-emerald-200' : 'bg-primary text-white shadow-primary/30'}`}>{isConnected ? 'Connected ✓' : 'Connect'}</button>}
                   </div>
               </div>
               <div className="mb-6">
                   <div className="flex items-center gap-2 mb-2"><h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">{user.name}, {user.age}</h1><CheckCircle size={22} className="text-blue-500 fill-blue-500 text-white" /></div>
                   <div className="text-sm text-gray-500 dark:text-gray-400 font-bold flex flex-col gap-2"><span><Briefcase size={16} className="inline mr-2" /> {user.job}</span><span><MapPin size={16} className="inline mr-2" /> {user.location}</span></div>
               </div>
               <p className="text-gray-700 dark:text-gray-300 text-[15px] leading-relaxed mb-8 italic font-medium">"{user.bio}"</p>
               <div className="flex items-center gap-10 py-6 border-y border-gray-50 dark:border-gray-800 mb-8">
                    <div className="flex flex-col"><span className="font-black text-xl text-gray-900 dark:text-white">{user.stats.friends}</span><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Friends</span></div>
                    <div className="flex flex-col"><span className="font-black text-xl text-gray-900 dark:text-white">{user.stats.following}</span><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Following</span></div>
                    <div className="flex flex-col"><span className="font-black text-xl text-gray-900 dark:text-white">{user.stats.likes}</span><span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Likes</span></div>
               </div>
            </div>
            <div className="sticky top-0 bg-white/95 dark:bg-gray-950/95 backdrop-blur-md z-20 border-b border-gray-50 dark:border-gray-800">
                <div className="flex px-4 relative">
                    <div className="absolute bottom-0 h-1 bg-primary rounded-t-full transition-all duration-300 ease-out" style={{ width: 'calc(50% - 32px)', left: activeTab === 'photos' ? '16px' : 'calc(50% + 16px)' }} />
                    <button onClick={() => setActiveTab('photos')} className={`flex-1 py-5 flex items-center justify-center gap-3 text-sm font-black transition-all ${activeTab === 'photos' ? 'text-primary' : 'text-gray-400'}`}><Grid size={20} /> Photos</button>
                    <button onClick={() => setActiveTab('saved')} className={`flex-1 py-5 flex items-center justify-center gap-3 text-sm font-black transition-all ${activeTab === 'saved' ? 'text-primary' : 'text-gray-400'}`}><Bookmark size={20} /> Saved</button>
                </div>
            </div>
            <div className="bg-white dark:bg-gray-950 min-h-[400px]">
                {activeTab === 'photos' ? <div className="grid grid-cols-3 gap-0.5 animate-fade-in">{user.photos.map((photo, i) => <div key={i} className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-900"><img src={photo} className="w-full h-full object-cover" alt="" /></div>)}</div> : <div className="flex flex-col items-center justify-center py-32 text-gray-400 gap-4 animate-fade-in"><Bookmark size={48} className="opacity-20" /><p className="text-sm font-black uppercase tracking-widest">Empty Collection</p></div>}
            </div>
        </div>
      </div>

      {showSettings && (
          <div className="fixed inset-0 z-50 flex items-end animate-fade-in">
              <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowSettings(false)}></div>
              <div className="bg-white dark:bg-gray-900 w-full p-10 rounded-t-[56px] z-10 animate-fade-in-up">
                  <div className="w-16 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto mb-10"></div>
                  <h3 className="text-3xl font-black mb-10 dark:text-white tracking-tight">Account Settings</h3>
                  <div className="space-y-4">
                    <button onClick={toggleTheme} className="flex items-center justify-between w-full p-5 bg-gray-50 dark:bg-gray-800 rounded-[28px]">
                        <div className="flex items-center gap-4"><div className={`p-3 rounded-[18px] ${isDarkMode ? 'bg-yellow-500/10 text-yellow-500' : 'bg-gray-200 text-gray-600'}`}>{isDarkMode ? <Sun size={24} /> : <Moon size={24} />}</div><span className="font-black text-gray-800 dark:text-white">{isDarkMode ? 'Light Mode' : 'Dark Mode'}</span></div>
                        <div className={`w-12 h-7 rounded-full p-1 transition-all ${isDarkMode ? 'bg-primary flex justify-end' : 'bg-gray-300 flex justify-start'}`}><div className="w-5 h-5 rounded-full bg-white shadow-lg"></div></div>
                    </button>
                    <button onClick={onLogout} className="flex items-center gap-4 w-full p-5 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-[28px] text-red-500 transition-all font-black"><LogOut size={24} /> Sign Out</button>
                  </div>
              </div>
          </div>
      )}

      {/* Standard Bottom Nav Bar (Matches ChatScreen Style) */}
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
          
          <button onClick={() => onNavigate('chat')} className="flex flex-col items-center gap-1.5 group">
            <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">Chat</span>
          </button>
          
          <button className="flex flex-col items-center gap-1.5">
            <UserIcon className="w-6 h-6 text-primary fill-primary" />
            <span className="text-[10px] font-black text-primary">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;