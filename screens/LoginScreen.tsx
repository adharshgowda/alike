import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import { ScreenName } from '../types';

interface LoginScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(''); // Clear previous errors
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      
      // Simulate validation/server error for demonstration
      // In a real app, this would come from the backend response
      if (email === 'fail@example.com' || password === 'error') {
        setError('Invalid email or password. Please try again.');
        return;
      }
      
      if (rememberMe) {
        localStorage.setItem('alike_is_logged_in', 'true');
      }
      
      // Navigate to home instead of alerting
      onNavigate('home');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-white">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-10 animate-pop-in">
          <Logo size="md" />
        </div>

        <div className="animate-fade-in-up delay-100 w-full flex flex-col items-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Welcome back</h2>
        </div>

        <form onSubmit={handleLogin} className="w-full max-w-sm animate-fade-in-up delay-200">
          <Input 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError('');
            }}
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (error) setError('');
            }}
          />

          <div className="flex items-center justify-between w-full mb-8 mt-2 px-1">
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-primary bg-gray-100 border-gray-300 rounded focus:ring-primary focus:ring-2 cursor-pointer accent-violet-500 transition-all duration-200"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 cursor-pointer font-medium select-none hover:text-gray-800 transition-colors">
                Remember me
              </label>
            </div>

            <button 
              type="button" 
              onClick={() => onNavigate('forgot-password')}
              className="text-primary font-semibold text-sm hover:underline hover:text-primaryDark transition-colors"
            >
              Forgot password?
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-500 text-sm font-medium leading-tight">{error}</p>
            </div>
          )}

          <Button type="submit" isLoading={isLoading}>
            Log in
          </Button>
        </form>

        <div className="mt-8 text-gray-500 text-sm animate-fade-in-up delay-300">
          New here?{' '}
          <button 
            onClick={() => onNavigate('signup')} 
            className="text-primary font-bold hover:underline hover:text-primaryDark transition-colors"
          >
            Create an account
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;