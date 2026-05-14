import React, { useEffect, useState } from 'react';
import Logo from '../components/Logo';

interface SplashScreenProps {
  onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    // Fade in background
    setTimeout(() => setOpacity(1), 100);

    // Navigate away
    const timer = setTimeout(() => {
      onFinish();
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div 
      className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-b from-purple-50 to-white p-8 transition-opacity duration-1000"
      style={{ opacity }}
      onClick={onFinish} // Allow skipping
    >
      <div className="flex-1 flex flex-col items-center justify-center">
        {/* Scale animation provided by tailwind utility */}
        <div className="mb-8 animate-pop-in">
           <Logo size="lg" />
        </div>
        
        <h2 className="text-2xl font-bold text-primary text-center mt-8 animate-fade-in-up delay-300">
          Feel less alone.
          <br />
          Find your people.
        </h2>
      </div>
    </div>
  );
};

export default SplashScreen;