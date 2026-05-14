import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  type?: string;
  rightIcon?: React.ReactNode;
}

const Input: React.FC<InputProps> = ({ label, type = 'text', className = '', rightIcon, ...props }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className={`relative mb-4 ${className}`}>
      <div 
        className={`
          flex items-center bg-gray-100 rounded-2xl px-4 py-3 border-2 transition-colors duration-200
          ${isFocused ? 'border-primary bg-white' : 'border-transparent'}
        `}
      >
        <input
          {...props}
          type={inputType}
          placeholder={label}
          className="flex-1 bg-transparent border-none outline-none text-gray-700 placeholder-gray-400 font-medium h-full w-full"
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
        />
        
        {rightIcon && (
          <div className="ml-2 text-gray-400">
            {rightIcon}
          </div>
        )}

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        )}
      </div>
    </div>
  );
};

export default Input;