
export type ScreenName = 'splash' | 'login' | 'signup' | 'home' | 'matches' | 'explore' | 'chat' | 'conversation' | 'forgot-password' | 'profile-setup-step-1' | 'profile-setup-step-2' | 'profile';

export interface AuthFormData {
  email?: string;
  password?: string;
}

export interface ChatUser {
  id: number;
  name: string;
  image: string;
  isOnline?: boolean;
}

export interface MatchProfile {
  id: number;
  name: string;
  age: number;
  location: string;
  job: string;
  image: string;
  matchPercentage: number;
  isVerified: boolean;
  tags: string[];
  whyAlike: string;
  interests?: string; // Keep for compatibility if needed, though tags cover this
}