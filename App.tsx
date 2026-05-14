import React, { useState, useEffect } from 'react';
import SplashScreen from './screens/SplashScreen';
import LoginScreen from './screens/LoginScreen';
import SignupScreen from './screens/SignupScreen';
import HomeScreen from './screens/HomeScreen';
import MatchesScreen from './screens/MatchesScreen';
import ExploreScreen from './screens/ExploreScreen';
import ChatScreen from './screens/ChatScreen';
import ConversationScreen from './screens/ConversationScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import ProfileSetupStep1Screen from './screens/ProfileSetupStep1Screen';
import ProfileSetupStep2Screen from './screens/ProfileSetupStep2Screen';
import ProfileScreen from './screens/ProfileScreen';
import { ScreenName, ChatUser, MatchProfile } from './types';

const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<ScreenName>(() => {
    const isLoggedIn = localStorage.getItem('alike_is_logged_in') === 'true';
    return isLoggedIn ? 'home' : 'splash';
  });

  const [selectedUser, setSelectedUser] = useState<ChatUser | undefined>(undefined);
  const [selectedMatch, setSelectedMatch] = useState<MatchProfile | undefined>(undefined);
  
  // --- Global Interaction State ---
  const [connectedIds, setConnectedIds] = useState<Set<number>>(new Set());
  const [joinedPlanIds, setJoinedPlanIds] = useState<Set<number>>(new Set());

  // Theme Management
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const navigate = (screen: ScreenName) => {
    setCurrentScreen(screen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleConnect = (id: number) => {
    setConnectedIds(prev => new Set(prev).add(id));
  };

  const handleTogglePlan = (id: number) => {
    setJoinedPlanIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleChatSelect = (user: ChatUser) => {
    setSelectedUser(user);
    navigate('conversation');
  };
  
  const handleMatchSelect = (profile: MatchProfile) => {
    setSelectedMatch(profile);
    navigate('profile'); 
  };

  const handleLogout = () => {
    localStorage.removeItem('alike_is_logged_in');
    setConnectedIds(new Set());
    setJoinedPlanIds(new Set());
    navigate('login');
  };

  return (
    <div className="w-full min-h-screen transition-colors duration-300 font-sans">
      {currentScreen === 'splash' && (
        <SplashScreen onFinish={() => navigate('login')} />
      )}
      {currentScreen === 'login' && (
        <LoginScreen onNavigate={navigate} />
      )}
      {currentScreen === 'signup' && (
        <SignupScreen onNavigate={navigate} />
      )}
      {currentScreen === 'forgot-password' && (
        <ForgotPasswordScreen onNavigate={navigate} />
      )}
      {currentScreen === 'profile-setup-step-1' && (
        <ProfileSetupStep1Screen onNavigate={navigate} />
      )}
      {currentScreen === 'profile-setup-step-2' && (
        <ProfileSetupStep2Screen onNavigate={navigate} />
      )}
      {currentScreen === 'home' && (
        <HomeScreen 
          onNavigate={navigate} 
          onLogout={handleLogout} 
          onMatchSelect={handleMatchSelect}
        />
      )}
      {currentScreen === 'explore' && (
        <ExploreScreen 
          onNavigate={navigate} 
          joinedPlanIds={joinedPlanIds}
          onTogglePlan={handleTogglePlan}
        />
      )}
      {currentScreen === 'matches' && (
        <MatchesScreen 
          onNavigate={navigate} 
          onConnect={handleConnect}
          connectedIds={connectedIds}
        />
      )}
      {currentScreen === 'chat' && (
        <ChatScreen 
          onNavigate={navigate} 
          onChatSelect={handleChatSelect} 
          connectedIds={connectedIds}
        />
      )}
      {currentScreen === 'conversation' && (
        <ConversationScreen onNavigate={navigate} user={selectedUser} />
      )}
      {currentScreen === 'profile' && (
        <ProfileScreen 
          onNavigate={navigate} 
          onLogout={handleLogout} 
          isDarkMode={isDarkMode}
          toggleTheme={toggleTheme}
          profile={selectedMatch}
          onConnect={handleConnect}
          connectedIds={connectedIds}
        />
      )}
    </div>
  );
};

export default App;