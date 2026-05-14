import React, { useEffect, useRef, useState } from 'react';
import { 
  Bell, Sparkles, Edit2, 
  MessageCircle,
  MapPin, Home, User,
  Plus, ArrowRight, ChevronRight, Clock, Search
} from 'lucide-react';
import { ScreenName, MatchProfile } from '../types';

const CATEGORIES = [
  { id: 1, name: 'Coffee', icon: '☕', bg: 'bg-[#FFF4E6]' }, // Light orange
  { id: 2, name: 'Hiking', icon: '🥾', bg: 'bg-[#E6F9F0]' }, // Light green
  { id: 3, name: 'Study', icon: '📚', bg: 'bg-[#E6F0FF]' }, // Light blue
  { id: 4, name: 'Chat', icon: '💬', bg: 'bg-[#F3E6FF]' }, // Light purple
];

const RECOMMENDATIONS: MatchProfile[] = [
  { 
    id: 101, 
    name: 'Sarah', 
    age: 24, 
    matchPercentage: 95, 
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=600&fit=crop', 
    location: 'Austin, TX',
    job: 'Illustrator',
    isVerified: true,
    tags: ['Books', 'Art', 'Coffee'],
    whyAlike: 'You both love spending sunday mornings at cozy cafes reading fiction.',
    interests: 'Books, Art, Coffee' 
  },
  { 
    id: 102, 
    name: 'Marcus', 
    age: 26, 
    matchPercentage: 92, 
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&h=600&fit=crop', 
    location: 'Austin, TX',
    job: 'Photographer',
    isVerified: true,
    tags: ['Hiking', 'Photography'],
    whyAlike: 'Shared passion for outdoor adventures.',
    interests: 'Hiking, Photography' 
  },
];

const PLANS = [
  {
    id: 1, title: 'Morning Brew', location: 'The Daily Grind', time: 'Sun, 10 AM', 
    image: 'https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=500&h=300&fit=crop'
  },
  {
    id: 2, title: 'Trivia Night', location: 'Hops & Puzzles', time: 'Tue, 7 PM', 
    image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=500&h=300&fit=crop'
  }
];

const COMMUNITIES = [
  { id: 1, name: 'Dog Lovers', members: '1.2k Members', icon: '🐾', bg: 'bg-emerald-50 text-emerald-600' },
  { id: 2, name: 'Tech Startups', members: '850 Members', icon: '🚀', bg: 'bg-purple-50 text-purple-600' },
];

const FadeInSection = ({ children, className = "", delay = 0 }: { children?: React.ReactNode; className?: string; delay?: number }) => {
  const [isVisible, setVisible] = useState(false);
  const domRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) setVisible(true); });
    }, { threshold: 0.1 });
    const currentRef = domRef.current;
    if (currentRef) observer.observe(currentRef);
    return () => { if (currentRef) observer.unobserve(currentRef); };
  }, []);
  return (
    <div ref={domRef} className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'} ${className}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

interface HomeScreenProps {
  onLogout: () => void;
  onNavigate: (screen: ScreenName) => void;
  onMatchSelect: (profile: MatchProfile) => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onLogout, onNavigate, onMatchSelect }) => {
  const [searchInput, setSearchInput] = useState('');

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 pb-32 font-sans relative overflow-x-hidden transition-colors">
      {/* Header */}
      <div className="pt-6 px-6 pb-4 flex justify-between items-start bg-white dark:bg-gray-950 sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="relative group cursor-pointer" onClick={() => onNavigate('profile')}>
            <div className="w-11 h-11 rounded-full bg-gray-200 overflow-hidden border-2 border-white dark:border-gray-800 shadow-sm">
              <img src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop" alt="Profile" className="w-full h-full object-cover" />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white flex items-center gap-2">
              Hi Alex <span className="text-xl">👋</span>
            </h1>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium tracking-wide">Ready to find your vibe today?</p>
          </div>
        </div>
        <button className="p-2.5 bg-gray-50 dark:bg-gray-800 rounded-full hover:bg-gray-100 transition-colors">
          <Bell size={20} className="text-gray-900 dark:text-white fill-gray-900 dark:fill-white" />
        </button>
      </div>

      <div className="space-y-8 pt-2 pb-6">
        
        {/* Hero / Search Section */}
        <FadeInSection className="px-6">
          <div className="relative overflow-hidden rounded-[36px] bg-[#1F1B2C] p-6 text-white shadow-xl">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-pink-500/20 rounded-full blur-[60px] pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase mb-5 text-gray-200 border border-white/10">
                <Sparkles size={10} className="text-green-400 fill-green-400" /> AI Matchmaker
              </div>
              
              <h2 className="text-2xl font-black mb-6 leading-tight">What are you hoping for<br />today?</h2>
              
              <div className="relative mb-6">
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="e.g. coffee date, hiking buddy..." 
                  className="w-full bg-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm text-white placeholder-gray-400 outline-none border border-white/5 focus:border-white/20 transition-all"
                />
                <Edit2 size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>
              
              <button className="w-full bg-white text-gray-900 py-3.5 rounded-[20px] font-black text-sm shadow-lg active:scale-95 transition-transform flex items-center justify-center gap-2">
                Get suggestions <Sparkles size={16} className="text-pink-500 fill-pink-500" />
              </button>
            </div>
          </div>
        </FadeInSection>

        {/* Categories */}
        <FadeInSection delay={100}>
          <div className="flex justify-between px-8">
            {CATEGORIES.map(cat => (
              <div key={cat.id} className="flex flex-col items-center gap-2 cursor-pointer group">
                <div className={`w-14 h-14 rounded-full ${cat.bg} flex items-center justify-center text-xl shadow-sm group-active:scale-90 transition-transform`}>
                  {cat.icon}
                </div>
                <span className="text-[11px] font-bold text-gray-600 dark:text-gray-300">{cat.name}</span>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Recommendations */}
        <FadeInSection delay={200}>
          <div className="flex justify-between items-end mb-4 px-6">
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white">Recommended</h3>
            <button onClick={() => onNavigate('matches')} className="text-[11px] font-black text-pink-500 tracking-wider uppercase hover:opacity-70">SEE ALL</button>
          </div>
          
          <div className="grid grid-cols-2 gap-4 px-6">
            {RECOMMENDATIONS.map((profile, idx) => (
              <div 
                key={profile.id} 
                onClick={() => onMatchSelect(profile)} 
                className="relative rounded-[28px] overflow-hidden aspect-[4/5] shadow-md cursor-pointer active:scale-95 transition-transform group"
              >
                <img src={profile.image} alt={profile.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                
                <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg text-[10px] font-black text-pink-500 shadow-sm">
                   {profile.matchPercentage}%
                </div>
                
                <div className="absolute bottom-4 left-4 text-white">
                  <h4 className="font-black text-lg leading-none mb-1 shadow-black/10 drop-shadow-md">{profile.name}, {profile.age}</h4>
                  <p className="text-[10px] opacity-90 font-medium truncate">{profile.interests}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Plans Near You */}
        <FadeInSection delay={300}>
           <div className="flex justify-between items-end mb-4 px-6">
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white">Plans near you</h3>
            <button onClick={() => onNavigate('explore')} className="text-[11px] font-black text-pink-500 tracking-wider uppercase hover:opacity-70">VIEW MAP</button>
          </div>

          <div className="flex gap-4 overflow-x-auto px-6 pb-4 scrollbar-hide">
            {PLANS.map(plan => (
              <div key={plan.id} className="flex-shrink-0 w-64 bg-white dark:bg-gray-900 rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.05)] border border-gray-100 dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow" onClick={() => onNavigate('explore')}>
                 <div className="h-32 w-full relative">
                    <img src={plan.image} className="w-full h-full object-cover" alt={plan.title} />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-[10px] font-bold text-gray-800">
                       {plan.time}
                    </div>
                 </div>
                 <div className="p-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-1">{plan.title}</h4>
                    <div className="flex items-center gap-1 text-gray-400 text-xs">
                       <MapPin size={12} />
                       <span className="truncate">{plan.location}</span>
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </FadeInSection>

        {/* Communities */}
        <FadeInSection delay={400}>
           <div className="flex justify-between items-end mb-4 px-6">
            <h3 className="text-[17px] font-black text-gray-900 dark:text-white">Communities</h3>
          </div>
          
          <div className="px-6 space-y-3">
             {COMMUNITIES.map(comm => (
               <div key={comm.id} className="flex items-center gap-4 p-4 bg-[#F9FAFB] dark:bg-gray-900 rounded-[24px] cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                  <div className={`w-12 h-12 rounded-2xl ${comm.bg} flex items-center justify-center text-xl`}>
                     {comm.icon}
                  </div>
                  <div className="flex-1">
                     <h4 className="font-bold text-gray-900 dark:text-white text-sm">{comm.name}</h4>
                     <p className="text-[11px] text-gray-400 font-bold">{comm.members}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300" />
               </div>
             ))}
          </div>
        </FadeInSection>
      </div>

      {/* Standard Bottom Nav Bar (Matches ChatScreen Style) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 z-50 px-8 py-5 transition-colors">
        <div className="flex justify-between items-center max-w-md mx-auto">
          <button className="flex flex-col items-center gap-1.5">
            <Home className="w-6 h-6 text-primary fill-primary" />
            <span className="text-[10px] font-black text-primary">Home</span>
          </button>
          
          <button onClick={() => onNavigate('explore')} className="flex flex-col items-center gap-1.5 group">
            <Search className="w-6 h-6 text-gray-400 group-hover:text-primary transition-colors" />
            <span className="text-[10px] font-black text-gray-400 group-hover:text-primary transition-colors">Search</span>
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

export default HomeScreen;