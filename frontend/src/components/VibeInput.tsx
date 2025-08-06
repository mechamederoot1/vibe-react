import React, { useState } from 'react';

interface VibeInputProps {
  type?: 'text' | 'email' | 'password' | 'date' | 'tel';
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  label?: string;
  className?: string;
}

const VibeInput: React.FC<VibeInputProps> = ({
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  error,
  label,
  className = '',
}) => {
  const [focused, setFocused] = useState(false);

  const baseClasses = 'w-full px-4 py-3 border rounded-lg transition-all duration-200 focus:outline-none';
  const normalClasses = 'border-gray-300 focus:ring-2 focus:ring-vibe-blue focus:border-transparent';
  const errorClasses = 'border-red-500 focus:ring-2 focus:ring-red-500 focus:border-transparent';
  const focusedClasses = focused ? 'shadow-md' : 'shadow-sm';

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        required={required}
        className={`
          ${baseClasses}
          ${error ? errorClasses : normalClasses}
          ${focusedClasses}
        `}
      />
      
      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default VibeInput;
