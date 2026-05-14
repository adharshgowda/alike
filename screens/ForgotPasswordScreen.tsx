import React, { useState } from 'react';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import { ScreenName } from '../types';

interface ForgotPasswordScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSent(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col p-8 bg-white">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-6 animate-pop-in">
          <Logo size="md" />
        </div>

        <div className="w-full flex flex-col items-center animate-fade-in-up delay-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center">
            {isSent ? 'Check your mail' : 'Reset Password'}
          </h2>
          <p className="text-gray-500 mb-10 text-center text-lg max-w-xs">
            {isSent 
              ? `We have sent password recovery instructions to ${email}`
              : "Enter the email address associated with your account and we'll send you a link to reset your password."
            }
          </p>
        </div>

        {!isSent ? (
          <form onSubmit={handleSubmit} className="w-full max-w-sm animate-fade-in-up delay-200">
            <Input 
              label="Email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
            />

            <div className="mt-8">
              <Button type="submit" disabled={!email} isLoading={isLoading}>
                Send Reset Link
              </Button>
            </div>
          </form>
        ) : (
          <div className="w-full max-w-sm animate-fade-in-up delay-200">
            <Button onClick={() => onNavigate('login')}>
              Back to Login
            </Button>
            
            <button 
              onClick={() => setIsSent(false)}
              className="mt-6 w-full text-center text-primary font-bold hover:underline hover:text-primaryDark transition-colors"
            >
              Try another email
            </button>
          </div>
        )}

        {!isSent && (
          <div className="mt-8 text-gray-500 text-sm animate-fade-in-up delay-300">
            <button 
              onClick={() => onNavigate('login')} 
              className="font-bold hover:text-gray-800 transition-colors flex items-center gap-2"
            >
              <span className="text-lg">←</span> Back to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;