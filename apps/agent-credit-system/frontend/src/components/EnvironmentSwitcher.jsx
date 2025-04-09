import React, { useState, useEffect } from 'react';
import { environments, getCurrentEnvironment } from '../utils/environments';

const EnvironmentSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentEnv, setCurrentEnv] = useState(getCurrentEnvironment());
  
  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isOpen && !event.target.closest('.env-switcher')) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleEnvironmentChange = (env) => {
    window.location.href = env.url + window.location.pathname;
    setIsOpen(false);
  };

  return (
    <div className="env-switcher relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-sm font-medium text-gray-700 focus:outline-none"
      >
        <span className="w-2 h-2 rounded-full bg-green-500"></span>
        <span>{currentEnv.name}</span>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
          <div className="px-4 py-2 text-xs font-semibold text-gray-500 border-b">
            SWITCH ENVIRONMENT
          </div>
          {environments.map((env) => (
            <button
              key={env.id}
              onClick={() => handleEnvironmentChange(env)}
              className={`block w-full text-left px-4 py-2 text-sm ${
                currentEnv.id === env.id ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center">
                <span className={`w-2 h-2 rounded-full ${currentEnv.id === env.id ? 'bg-green-500' : 'bg-gray-300'} mr-2`}></span>
                <div>
                  <div className="font-medium">{env.name}</div>
                  <div className="text-xs text-gray-500 truncate">{env.url}</div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default EnvironmentSwitcher; 