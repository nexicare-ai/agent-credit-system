import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import EnvironmentSwitcher from './EnvironmentSwitcher';

const Layout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  // Initialize sidebar state from localStorage or default to false (expanded)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => {
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });

  // Update localStorage whenever sidebar state changes
  useEffect(() => {
    localStorage.setItem('sidebarCollapsed', JSON.stringify(sidebarCollapsed));
  }, [sidebarCollapsed]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-white shadow-md z-10">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-[#075e54]">Nexi Dashboard</h1>
          </div>
          <div className="flex items-center space-x-4 relative">
            {/* Environment Switcher */}
            {/* <EnvironmentSwitcher /> */}

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 focus:outline-none"
              >
                <div className="w-8 h-8 rounded-full bg-[#075e54] flex items-center justify-center text-white">
                  {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-gray-700">{currentUser?.username || 'User'}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <div className="px-4 py-2 text-sm text-gray-700 border-b">
                    <p className="font-medium">{currentUser?.username}</p>
                    <p className="text-gray-500 text-xs truncate">{currentUser?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex pt-16">
        {/* Sidebar */}
        <div
          className={`${sidebarCollapsed ? 'w-20' : 'w-64'} h-[calc(100vh-4rem)] bg-white shadow-md fixed transition-all duration-300`}
        >
          {/* Logo and Toggle Button */}
          <div className="flex items-center justify-between p-4 border-b">
            <div className={`flex items-center ${sidebarCollapsed ? 'justify-center w-full' : ''}`}>
              {/* Logo SVG */}
              <div className="w-10 h-10 rounded-md bg-[#075e54] flex items-center justify-center text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              {!sidebarCollapsed && <span className="ml-2 font-bold text-[#075e54]">Nexi</span>}
            </div>
            <button
              onClick={toggleSidebar}
              className={`text-gray-500 hover:text-gray-700 focus:outline-none ${sidebarCollapsed ? 'hidden' : ''}`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M15.707 4.293a1 1 0 010 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </div>

          {/* Sidebar Toggle Button (only visible when collapsed) */}
          {sidebarCollapsed && (
            <button
              onClick={toggleSidebar}
              className="w-full flex justify-center py-2 text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 15.707a1 1 0 010-1.414L8.586 10 4.293 5.707a1 1 0 011.414-1.414l5 5a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          )}

          <div className="p-4">
            <nav className="space-y-2">
              <Link
                to="/agents"
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded ${
                  location.pathname.includes('/agents') ? 'bg-gray-100' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-2">Agent Users</span>}
              </Link>
              <Link
                to="/system/events"
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded ${
                  location.pathname.includes('/system/events') ? 'bg-gray-100' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-2">System Events</span>}
              </Link>
              <Link
                to="/consumables"
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded ${
                  location.pathname.includes('/consumables') ? 'bg-gray-100' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                {!sidebarCollapsed && <span className="ml-2">Consumables</span>}
              </Link>
              <Link
                to="/purchasables"
                className={`flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded ${
                  location.pathname.includes('/purchasables') ? 'bg-gray-100' : ''
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {!sidebarCollapsed && <span className="ml-2">Purchasables</span>}
              </Link>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${sidebarCollapsed ? 'ml-20' : 'ml-64'} flex-1 p-3 transition-all duration-300`}>
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-grey rounded-lg">
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Layout;
