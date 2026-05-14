import React, { useState } from 'react';
import Logo from '../components/Logo';
import Input from '../components/Input';
import Button from '../components/Button';
import { ScreenName } from '../types';

interface SignupScreenProps {
  onNavigate: (screen: ScreenName) => void;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation bypassed for testing flow
    // if (password !== confirmPassword) {
    //   return;
    // }

    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to profile setup instead of home or alert
      onNavigate('profile-setup-step-1');
    }, 1500);
  };

  // Password Strength Logic
  const getStrength = (pass: string) => {
    let score = 0;
    if (!pass) return 0;
    
    // Criteria
    const hasLength = pass.length >= 8;
    const hasNumOrSpecial = /[0-9!@#$%^&*(),.?":{}|<>]/.test(pass);
    const hasUpper = /[A-Z]/.test(pass);

    // Base score for typing anything
    score = 1;

    // Progressive scoring
    if (hasLength) score++;           // Length >= 8
    if (hasNumOrSpecial) score++;     // Has number or symbol
    if (hasUpper && hasLength) score++; // Has Uppercase AND Length >= 8

    return Math.min(score, 4);
  };

  const strength = getStrength(password);

  const getStrengthStyles = (score: number) => {
    switch (score) {
      case 1: return { bg: 'bg-red-400', text: 'text-red-500', label: 'Weak' };
      case 2: return { bg: 'bg-orange-400', text: 'text-orange-500', label: 'Fair' };
      case 3: return { bg: 'bg-yellow-400', text: 'text-yellow-600', label: 'Good' };
      case 4: return { bg: 'bg-green-500', text: 'text-green-600', label: 'Strong' };
      default: return { bg: 'bg-gray-200', text: 'text-gray-400', label: '' };
    }
  };

  const strengthStyles = getStrengthStyles(strength);
  
  const passwordsMatch = password === confirmPassword;
  const showMatchError = confirmPassword.length > 0 && !passwordsMatch;

  return (
    <div className="min-h-screen flex flex-col p-8 bg-white">
      <div className="flex-1 flex flex-col justify-center items-center">
        <div className="mb-6 animate-pop-in">
          <Logo size="md" />
        </div>

        <div className="w-full flex flex-col items-center animate-fade-in-up delay-100">
          <h2 className="text-3xl font-bold text-gray-700 mb-2 text-center">Create your account</h2>
          <p className="text-gray-500 mb-10 text-center text-lg">
            Start meeting people who feel like you.
          </p>
        </div>

        <form onSubmit={handleSignup} className="w-full max-w-sm animate-fade-in-up delay-200">
          <Input 
            label="Email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input 
            label="Password" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            // Reduce bottom margin if meter is shown to keep it visually connected
            className={password ? "!mb-2" : ""} 
          />

          {/* Password Strength Meter */}
          {password && (
            <div className="w-full mb-4 px-1 animate-fade-in duration-300">
              <div className="flex gap-2 h-1.5 mb-2">
                {[1, 2, 3, 4].map((level) => (
                  <div 
                    key={level}
                    className={`flex-1 rounded-full transition-all duration-500 ${
                      level <= strength ? strengthStyles.bg : 'bg-gray-100'
                    }`} 
                  />
                ))}
              </div>
              <div className={`text-right text-xs font-bold tracking-wide transition-colors duration-300 ${strengthStyles.text}`}>
                {strengthStyles.label}
              </div>
            </div>
          )}

          <Input 
            label="Confirm Password" 
            type="password" 
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={showMatchError ? "!mb-2" : ""} 
          />
          
          {showMatchError && (
             <div className="text-red-500 text-xs px-4 mb-4 font-bold animate-fade-in">
               Passwords do not match
             </div>
          )}

          <div className="mt-4">
            <Button type="submit" isLoading={isLoading}>
              Sign up
            </Button>
          </div>
        </form>

        <div className="mt-8 text-gray-500 text-sm animate-fade-in-up delay-300">
          Already have an account?{' '}
          <button 
            onClick={() => onNavigate('login')} 
            className="text-primary font-bold hover:underline hover:text-primaryDark transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupScreen;