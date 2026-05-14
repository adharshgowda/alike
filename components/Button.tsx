import React from 'react';
import Spinner from './Spinner';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  fullWidth = true, 
  className = '',
  isLoading = false,
  disabled,
  ...props 
}) => {
  // Enhanced base styles with better transitions and interaction states
  const baseStyles = "relative py-4 px-6 rounded-full font-bold text-lg transition-all duration-300 transform active:scale-95 hover:-translate-y-1 flex justify-center items-center";
  
  // Disabled state styles - ensure we reset transforms when disabled
  const disabledStyles = "disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:hover:translate-y-0 disabled:shadow-none";

  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30 hover:bg-primaryDark hover:shadow-primary/50",
    secondary: "bg-secondary text-white shadow-md shadow-secondary/30 hover:bg-secondaryDark hover:shadow-secondary/50",
    outline: "border-2 border-primary text-primary bg-transparent hover:bg-purple-50 hover:shadow-md",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${disabledStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          {/* Invisible text to maintain width/height */}
          <span className="opacity-0">{children}</span>
          <div className="absolute inset-0 flex items-center justify-center">
             <Spinner size="md" color="currentColor" />
          </div>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;