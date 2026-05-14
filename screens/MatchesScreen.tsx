import React, { useState, useMemo } from 'react';
import { 
  Sparkles, CheckCircle,
  Heart, RefreshCcw, MapPin,
  Home, MessageCircle, User, Compass,
  Hand, X, Star
} from 'lucide-react';
import { ScreenName, MatchProfile } from '../types';
import Logo from '../components/Logo';

const INITIAL_MATCHES: MatchProfile[] = [
  {
    id: 1,
    name: 'Alex',
    age: 32,
    location: 'Austin, TX',
    job: 'Graphic Designer',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&h=1000&fit=crop',
    matchPercentage: 95,
    isVerified: true,
    tags: ['Photography', 'Indie Rock', 'Dogs'],
    whyAlike: 'You both love golden retrievers and spend weekends looking for the perfect espresso.',
  },
  {
    id: 2,
    name: 'Maya',
    age: 28,
    location: 'Austin, TX',
    job: 'UX Researcher',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1000&fit=crop',
    matchPercentage: 92,
    isVerified: true,
    tags: ['Yoga', 'Travel', 'Sushi'],
    whyAlike: 'Both enjoy morning yoga sessions and have a passion for sustainable living.',
  }
];

interface MatchesScreenProps {
  onNavigate: (screen: ScreenName) => void;
  onConnect: (id: number) => void;
  connectedIds: Set<number>;
}

const MatchesScreen: React.FC<MatchesScreenProps> = ({ onNavigate, onConnect, connectedIds }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);

  const availableMatches = useMemo(() => INITIAL_MATCHES.filter(m => !connectedIds.has(m.id)), [connectedIds]);
  const currentProfile = availableMatches[currentIndex];

  const handleSwipe = (direction: 'left' | 'right' | 'up') => {
    if (!currentProfile || isAnimating) return;
    setIsAnimating(true);
    
    if (direction === 'right') {
      onConnect(currentProfile.id);
    }

    const throwX = direction === 'up' ? 0 : (direction === 'right' ? 800 : -800);
    const throwY = direction === 'up' ? -800 : 200;

    setDragOffset({ x: throwX, y: throwY });
    
    setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setDragOffset({ x: 0, y: 0 });
        setIsAnimating(false);
    }, 400); 
  };

  return (
    <div className="flex flex-col h-screen bg-white dark:bg-gray-950 font-sans overflow-hidden transition-colors">
      <div className="pt-6 px-6 pb-2 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md z-30 flex justify-center">
        <Logo size="sm" orientation="horizontal" />
      </div>

      <div className="flex-1 flex flex-col relative w-full max-w-md mx-auto px-4 pb-28">
           <div className="mb-6 mt-4 text-center">
             <h1 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Discover</h1>
             <p className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">Find your tribe</p>
           </div>
           
           <div className="relative flex-1">
                {!currentProfile ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 rounded-[40px] p-8 text-center animate-fade-in shadow-inner border border-gray-100 dark:border-gray-800">
                        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 animate-pulse">
                            <Sparkles size={48} />
                        </div>
                        <h2 className="text-2xl font-black mb-3 dark:text-white">You're caught up!</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-[200px] leading-relaxed">Check back later for fresh connections matching your vibe.</p>
                        <button 
                          onClick={() => onNavigate('home')} 
                          className="bg-primary text-white px-10 py-4 rounded-full font-black shadow-xl shadow-primary/30 active:scale-95 transition-all"
                        >
                          Go Home
                        </button>
                    </div>
                ) : (
                    <div 
                        className="absolute inset-0 z-20 transition-all cursor-grab active:cursor-grabbing"
                        style={{ 
                            transform: `translate3d(${dragOffset.x}px, ${dragOffset.y}px, 0) rotate(${dragOffset.x * 0.05}deg)`,
                            transition: isAnimating ? 'transform 0.4s cubic-bezier(0.165, 0.84, 0.44, 1)' : 'none',
                        }}
                    >
                        <div className="w-full h-full bg-white dark:bg-gray-800 rounded-[32px] shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden flex flex-col p-4">
                            <div className="relative flex-1 rounded-[24px] overflow-hidden mb-5 bg-gray-100 dark:bg-gray-900 group">
                                <img src={currentProfile.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={currentProfile.name} />
                                
                                <div className="absolute top-4 right-4 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md px-4 py-2 rounded-2xl text-[10px] font-black text-primary shadow-xl border border-primary/20">
                                    {currentProfile.matchPercentage}% MATCH
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <h2 className="text-3xl font-black tracking-tight">{currentProfile.name}, {currentProfile.age}</h2>
                                        {currentProfile.isVerified && <CheckCircle size={20} className="text-blue-400 fill-blue-400 text-white" />}
                                    </div>
                                    <p className="text-sm font-bold opacity-90 flex items-center gap-2">
                                      <MapPin size={14} /> {currentProfile.location}
                                    </p>
                                </div>
                            </div>
                            
                            <div className="mb-8 px-2">
                                <p className="text-[15px] text-gray-600 dark:text-gray-300 italic leading-relaxed font-medium">"{currentProfile.whyAlike}"</p>
                            </div>

                            <div className="flex gap-4 items-center mb-2">
                                <button onClick={() => handleSwipe('left')} className="w-16 h-16 rounded-full border-2 border-gray-100 dark:border-gray-700 flex items-center justify-center text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950 transition-all active:scale-90"><X size={28} /></button>
                                <button onClick={() => handleSwipe('up')} className="w-16 h-16 rounded-full border-2 border-sky-100 dark:border-sky-900 flex items-center justify-center text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-950 transition-all active:scale-90"><Star size={28} fill="currentColor" /></button>
                                <button 
                                  onClick={() => handleSwipe('right')} 
                                  className="flex-1 h-16 bg-primary rounded-full text-white font-black text-lg shadow-2xl shadow-primary/30 hover:brightness-110 transition-all active:scale-95 flex items-center justify-center gap-3"
                                >
                                    <Heart size={24} fill="currentColor" /> Connect
                                </button>
                            </div>
                        </div>
                    </div>
                )}
           </div>
      </div>
    </div>
  );
};

export default MatchesScreen;