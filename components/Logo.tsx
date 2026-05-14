import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  orientation?: 'vertical' | 'horizontal';
}

const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  size = 'md', 
  showText = true,
  orientation = 'vertical'
}) => {
  let sizeClasses = "w-40 h-40";
  let textSize = "text-4xl";
  let gapClass = "mt-2";
  
  // Mapping existing size props to Tailwind dimension classes
  switch (size) {
    case 'sm': 
      sizeClasses = "w-8 h-8"; 
      textSize = "text-xl";
      gapClass = orientation === 'horizontal' ? "ml-2" : "mt-1";
      break;
    case 'md': 
      sizeClasses = "w-40 h-40"; 
      textSize = "text-4xl";
      gapClass = orientation === 'horizontal' ? "ml-3" : "mt-2";
      break;
    case 'lg': 
      sizeClasses = "w-56 h-56"; 
      textSize = "text-6xl";
      gapClass = orientation === 'horizontal' ? "ml-4" : "mt-4";
      break;
    case 'xl': 
      sizeClasses = "w-72 h-72"; 
      textSize = "text-7xl";
      gapClass = orientation === 'horizontal' ? "ml-5" : "mt-6";
      break;
  }

  const containerClasses = orientation === 'horizontal' 
    ? `flex flex-row items-center justify-center ${className}`
    : `flex flex-col items-center justify-center ${className}`;

  return (
    <div className={containerClasses}>
      <svg 
        viewBox="0 0 120 100" 
        className={sizeClasses} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle 
          cx="45" 
          cy="55" 
          r="30" 
          fill="#7C3AED" 
        />
        <path 
          d="M35 60C35 60 40 68 55 60" 
          stroke="white" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />

        <circle 
          cx="75" 
          cy="45" 
          r="26" 
          fill="#34D399" 
          stroke="white" 
          strokeWidth="4" 
        />
        <path 
          d="M68 48C68 48 72 54 82 48" 
          stroke="white" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
        />
      </svg>
      
      {showText && (
        <h1 className={`${textSize} font-bold tracking-wide text-slate-900 font-sans ${gapClass}`}>
          <span className="text-violet-600">A</span>
          <span className="text-slate-900">LIKE</span>
        </h1>
      )}
    </div>
  );
};

export default Logo;