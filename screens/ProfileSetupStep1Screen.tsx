import React, { useState, useRef, useMemo } from 'react';
import { Plus, ChevronLeft, MapPin, Smile, User, ArrowRight, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Input from '../components/Input';
import Button from '../components/Button';
import Logo from '../components/Logo';
import Spinner from '../components/Spinner';
import { ScreenName } from '../types';

interface ProfileSetupStep1ScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ProfileSetupStep1Screen: React.FC<ProfileSetupStep1ScreenProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);
  const [bioFocused, setBioFocused] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  
  // Define available frame colors
  const FRAME_COLORS = [
    { id: 'default', class: 'bg-gradient-to-tr from-purple-200 via-violet-100 to-emerald-100' },
    { id: 'blue', class: 'bg-gradient-to-tr from-blue-300 via-cyan-200 to-sky-100' },
    { id: 'pink', class: 'bg-gradient-to-tr from-pink-300 via-rose-200 to-red-100' },
    { id: 'orange', class: 'bg-gradient-to-tr from-orange-300 via-amber-200 to-yellow-100' },
    { id: 'dark', class: 'bg-gradient-to-tr from-slate-400 via-gray-300 to-zinc-200' },
  ];

  const [frameColor, setFrameColor] = useState(FRAME_COLORS[0].class);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const MAX_BIO_LENGTH = 150;
  const QUICK_EMOJIS = ['👋', '🎧', '📸', '✈️', '🍕', '🎮', '🎨', '🐶', '💻', '🧘', '✨', '🎵'];

  // Calculate dynamic progress
  const progress = useMemo(() => {
    let p = 10; // Base progress for account creation
    if (avatar) p += 10;
    if (name.trim().length >= 2) p += 10;
    if (city.trim().length >= 3) p += 10;
    if (bio.trim().length >= 15) p += 10;
    return p;
  }, [avatar, name, city, bio]);

  const progressLabel = useMemo(() => {
    if (progress <= 10) return "Let's get started";
    if (progress <= 20) return "Good start";
    if (progress <= 30) return "Keep going...";
    if (progress <= 40) return "Almost there!";
    return "Looking great!";
  }, [progress]);

  const handleAvatarClick = () => {
    // Trigger file selection dialog
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Set the avatar to the base64 string result
        setAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleContinue = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to step 2
    onNavigate('profile-setup-step-2');
  };

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    if (text.length <= MAX_BIO_LENGTH) {
      setBio(text);
    }
  };

  const handleAddEmoji = (emoji: string) => {
    if (bio.length + emoji.length <= MAX_BIO_LENGTH) {
      setBio(prev => prev + emoji);
    }
  };

  const handleAiGenerate = async () => {
    setIsAiLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      
      let prompt = "";
      if (bio.trim().length > 5) {
        prompt = `Rewrite this social media bio to be more engaging, fun, and friendly. Keep it under 140 characters. Use emojis. Original bio: "${bio}"`;
      } else {
         const userContext = [
            name ? `Name: ${name}` : '',
            city ? `City: ${city}` : ''
         ].filter(Boolean).join(', ');
         
         prompt = `Write a short, creative, and friendly social media bio (max 140 characters) for a user. ${userContext ? `Context: ${userContext}.` : ''} Include emojis.`;
      }

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: prompt,
      });

      const text = response.text;
      if (text) {
        let cleanText = text.replace(/^["']|["']$/g, '').trim();
        // Ensure it fits
        if (cleanText.length > MAX_BIO_LENGTH) {
            cleanText = cleanText.substring(0, MAX_BIO_LENGTH - 1) + '…';
        }
        setBio(cleanText);
      }
    } catch (error) {
      console.error("AI Generation failed", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        className="hidden" 
        accept="image/*"
      />

      {/* Sticky Header Group */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm transition-all duration-300">
        {/* Navigation */}
        <div className="pt-6 px-6 pb-2 flex items-center justify-between">
          <button 
            onClick={() => onNavigate('login')}
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
                 <span className="text-xs font-bold text-gray-500 tracking-wide">Step 1 of 2</span>
                 <span className="text-[10px] font-bold text-gray-400 mt-0.5 tracking-wider uppercase animate-fade-in key-{progress}">{progressLabel}</span>
            </div>
            <span className="text-xs font-bold text-primary tracking-wide transition-all duration-500">{progress}% Complete</span>
          </div>
          <div className="w-full flex items-center bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div 
                className="h-full bg-primary rounded-full shadow-sm transition-all duration-700 ease-out relative"
                style={{ width: `${progress}%` }}
            >
                <div className="absolute top-0 right-0 bottom-0 w-full bg-gradient-to-l from-white/30 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 px-8 pb-12 pt-6">
        <div className="flex flex-col items-center animate-fade-in-up delay-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center tracking-tight">Let's get to know you</h2>
          <p className="text-gray-500 text-center text-sm mb-10 px-4 leading-relaxed">
            Let's start with the basics so you can find your people.
          </p>

          {/* Avatar Section */}
          <div className="flex flex-col items-center mb-8">
            <div 
              className="relative group cursor-pointer"
              onClick={handleAvatarClick}
            >
              {/* Customizable Frame Wrapper */}
              <div className={`rounded-full p-1.5 transition-all duration-500 ${frameColor} hover:shadow-md`}>
                <div className={`
                  w-32 h-32 rounded-full flex items-center justify-center 
                  transition-all duration-300 overflow-hidden relative border-4 border-white shadow-sm
                  ${avatar ? 'bg-white' : 'bg-gray-50'}
                `}>
                  {avatar ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover animate-fade-in" />
                  ) : (
                    <User className="text-gray-200 w-16 h-16" strokeWidth={2} />
                  )}
                </div>
              </div>
              
              {/* Plus Icon Badge */}
              <div className="absolute bottom-2 right-2 bg-primary p-2.5 rounded-full text-white shadow-lg border-4 border-white transform transition-transform group-hover:scale-110 flex items-center justify-center">
                <Plus size={20} strokeWidth={3} className="text-white" />
              </div>
            </div>

            {/* Frame Color Picker */}
            <div className="flex items-center gap-3 mt-6 animate-fade-in-up delay-75">
                {FRAME_COLORS.map((color) => (
                    <button
                        key={color.id}
                        type="button"
                        onClick={() => setFrameColor(color.class)}
                        className={`
                            w-6 h-6 rounded-full ${color.class} 
                            border-2 transition-all duration-300
                            ${frameColor === color.class ? 'border-gray-500 scale-125 shadow-sm' : 'border-transparent hover:scale-110'}
                        `}
                        aria-label={`Select ${color.id} frame color`}
                    />
                ))}
            </div>
          </div>

          <form onSubmit={handleContinue} className="w-full">
            {/* Display Name */}
            <div className="mb-5 animate-fade-in-up delay-150">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">Display Name</label>
              <Input 
                label="What do friends call you?" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                rightIcon={<Smile className="text-gray-400 hover:text-primary transition-colors cursor-pointer" size={20} />}
                className="!mb-0"
              />
            </div>
            
            {/* City */}
            <div className="mb-5 animate-fade-in-up delay-200">
              <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">City</label>
              <Input 
                label="Where are you based?" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                rightIcon={<MapPin className="text-gray-400" size={20} />}
                className="!mb-0"
              />
            </div>

            {/* Short Bio */}
            <div className="mb-8 animate-fade-in-up delay-300">
              <div className="flex justify-between items-center mb-2 ml-1">
                <label className="block text-sm font-bold text-gray-700">Short Bio</label>
              </div>
              <div className={`
                relative bg-gray-100 rounded-2xl border-2 transition-all duration-200 flex flex-col
                ${bioFocused ? 'border-primary bg-white shadow-sm' : 'border-transparent'}
              `}>
                 {/* AI Button */}
                <button
                  type="button"
                  onClick={handleAiGenerate}
                  disabled={isAiLoading}
                  className="absolute top-3 right-3 bg-white/60 backdrop-blur-md p-1.5 pl-2 pr-2.5 rounded-full text-primary hover:bg-white hover:shadow-sm transition-all flex items-center gap-1.5 text-xs font-bold border border-purple-100 z-10 shadow-sm"
                >
                  {isAiLoading ? (
                    <div className="flex items-center gap-2">
                      <Spinner size="sm" className="text-primary" />
                      <span>Writing...</span>
                    </div>
                  ) : (
                    <>
                      <Sparkles size={14} className="text-primary fill-purple-100" />
                      <span>AI Magic</span>
                    </>
                  )}
                </button>

                <textarea
                  value={bio}
                  onChange={handleBioChange}
                  onFocus={() => setBioFocused(true)}
                  onBlur={() => setBioFocused(false)}
                  placeholder="Tell us a bit about yourself..."
                  className="w-full bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 font-medium resize-none min-h-[120px] text-base px-4 py-3 pb-12 rounded-t-2xl mt-1"
                />
                
                {/* Toolbar */}
                <div className="absolute bottom-2 left-2 right-4 flex justify-between items-center bg-transparent">
                   {/* Emoji Quick Bar */}
                   <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide w-full mr-4 px-1 mask-gradient-r">
                      {QUICK_EMOJIS.map(emoji => (
                        <button
                          key={emoji}
                          type="button"
                          onClick={() => handleAddEmoji(emoji)}
                          className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 active:scale-90 transition-all text-lg"
                        >
                          {emoji}
                        </button>
                      ))}
                   </div>

                   {/* Count */}
                   <div className={`text-xs font-bold transition-colors whitespace-nowrap ${bio.length >= MAX_BIO_LENGTH ? 'text-red-500' : 'text-gray-400'}`}>
                      {bio.length}/{MAX_BIO_LENGTH}
                   </div>
                </div>
              </div>
            </div>

            <div className="animate-fade-in-up delay-500 mb-4">
              <Button type="submit">
                <span className="flex items-center gap-2">
                  Continue <ArrowRight size={20} />
                </span>
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSetupStep1Screen;