import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, Check, 
  Coffee, Headphones, BookOpen, 
  Camera, Palette, PenTool, 
  Mountain, Activity, Zap, 
  Film, Music, Gamepad2,
  Utensils, Plane, Dumbbell, 
  Code, Globe, Mic, Tent
} from 'lucide-react';
import Logo from '../components/Logo';
import Button from '../components/Button';
import { ScreenName } from '../types';

interface ProfileSetupStep2ScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

// Icon mapping
const CATEGORIES = [
  {
    title: "For Daily Finds",
    items: [
      { id: 'coffee', label: 'Coffee', icon: Coffee },
      { id: 'podcasts', label: 'Podcasts', icon: Mic },
      { id: 'reading', label: 'Reading', icon: BookOpen },
      { id: 'foodie', label: 'Foodie', icon: Utensils },
    ]
  },
  {
    title: "Hobbies & Passions",
    items: [
      { id: 'photography', label: 'Photography', icon: Camera },
      { id: 'painting', label: 'Painting', icon: Palette },
      { id: 'writing', label: 'Writing', icon: PenTool },
      { id: 'coding', label: 'Coding', icon: Code },
    ]
  },
  {
    title: "Let's Get Active",
    items: [
      { id: 'hiking', label: 'Hiking', icon: Mountain },
      { id: 'yoga', label: 'Yoga', icon: Activity },
      { id: 'running', label: 'Running', icon: Zap },
      { id: 'gym', label: 'Fitness', icon: Dumbbell },
    ]
  },
  {
    title: "Entertainment",
    items: [
      { id: 'movies', label: 'Movies', icon: Film },
      { id: 'concerts', label: 'Concerts', icon: Music },
      { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
      { id: 'travel', label: 'Travel', icon: Plane },
      { id: 'camping', label: 'Camping', icon: Tent },
    ]
  }
];

const ProfileSetupStep2Screen: React.FC<ProfileSetupStep2ScreenProps> = ({ onNavigate }) => {
  const [selectedInterests, setSelectedInterests] = useState<Set<string>>(new Set());
  const [isFinishing, setIsFinishing] = useState(false);

  const MIN_INTERESTS = 5;

  const toggleInterest = (id: string) => {
    const newSelected = new Set(selectedInterests);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedInterests(newSelected);
  };

  const handleFinish = () => {
    setIsFinishing(true);
    setTimeout(() => {
      localStorage.setItem('alike_is_logged_in', 'true');
      onNavigate('home');
    }, 1000);
  };

  // Calculate dynamic progress: Starts at 50%, goes up to 100% as they select 5
  const progressPercent = Math.min(100, 50 + (selectedInterests.size * 10));

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans relative">
      {/* Sticky Header Group */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
        {/* Navigation */}
        <div className="pt-6 px-6 pb-2 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('profile-setup-step-1')}
            className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors text-gray-700"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <Logo size="sm" orientation="horizontal" className="mr-8" />
          <div className="w-6"></div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 mt-2 mb-4">
          <div className="flex justify-between items-end mb-2">
             <div className="flex flex-col">
                 <span className="text-xs font-bold text-gray-500 tracking-wide">Step 2 of 2</span>
            </div>
            <span className="text-xs font-bold text-primary tracking-wide transition-all duration-500">{progressPercent}%</span>
          </div>
          <div className="w-full flex items-center bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
                className="h-full bg-primary rounded-full shadow-sm transition-all duration-500 ease-out relative"
                style={{ width: `${progressPercent}%` }}
            >
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 px-6 pt-6 pb-40 overflow-y-auto">
        <div className="flex flex-col animate-fade-in-up delay-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center tracking-tight">Choose Your Interests</h2>
          <p className="text-gray-500 text-center text-sm mb-8 px-4 font-medium">
            Pick at least 5 things you enjoy.
          </p>

          <div className="flex flex-col gap-8">
            {CATEGORIES.map((category, catIndex) => (
              <div key={category.title} className="animate-fade-in-up" style={{ animationDelay: `${150 + (catIndex * 100)}ms` }}>
                <h3 className="text-sm font-bold text-gray-800 mb-3 ml-1">{category.title}</h3>
                <div className="flex flex-wrap gap-3">
                  {category.items.map((item) => {
                    const isSelected = selectedInterests.has(item.id);
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(item.id)}
                        className={`
                          pl-3 pr-4 py-2.5 rounded-full text-sm font-bold transition-all duration-200 border
                          flex items-center gap-2 group
                          ${isSelected 
                            ? 'bg-primary border-primary text-white shadow-md shadow-primary/30 transform scale-105' 
                            : 'bg-white border-gray-100 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                          }
                        `}
                      >
                        <Icon 
                          size={18} 
                          className={`transition-colors ${isSelected ? 'text-white' : 'text-gray-400 group-hover:text-gray-600'}`} 
                        />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Action Area */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-50 px-6 py-6 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
         <div className="max-w-[480px] mx-auto w-full flex flex-col items-center gap-4">
            <div className={`text-xs font-bold tracking-wide uppercase transition-colors ${selectedInterests.size >= MIN_INTERESTS ? 'text-green-600' : 'text-gray-400'}`}>
               Selected: {selectedInterests.size} / {MIN_INTERESTS} required
            </div>
            
            <Button 
              onClick={handleFinish} 
              isLoading={isFinishing}
              className="w-full"
            >
               Continue
            </Button>
         </div>
      </div>
    </div>
  );
};

export default ProfileSetupStep2Screen;