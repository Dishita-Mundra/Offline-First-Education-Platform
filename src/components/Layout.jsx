import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { BookOpen, Download, User, Menu, X, Wifi, WifiOff } from 'lucide-react';
import { resetDatabase } from '../data/seedData';

const Layout = ({ userType = 'student' }) => {
  const { isOnline, simulatedOffline, setSimulatedOffline, syncMessage, syncing } = useAppContext();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleReset = async () => {
    if (window.confirm("Are you sure you want to reset all demo data? This will clear all progress and downloads.")) {
      await resetDatabase();
      window.location.href = "/";
    }
  };

  const navLinks = userType === 'student' ? [
    { name: 'Dashboard', path: '/student', icon: BookOpen },
    { name: 'My Courses', path: '/student/courses', icon: BookOpen },
    { name: 'Offline Library', path: '/student/downloads', icon: Download },
  ] : [
    { name: 'Dashboard', path: '/teacher', icon: BookOpen },
    { name: 'Courses', path: '/teacher/courses', icon: BookOpen },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Network Status Banner */}
      {!isOnline && (
        <div className="bg-red-600 text-white px-4 py-2 text-sm font-medium flex flex-col sm:flex-row items-center justify-center text-center">
          <div className="flex items-center font-bold mb-1 sm:mb-0 sm:mr-2">
            <WifiOff className="w-4 h-4 mr-1" />
            🔴 OFFLINE MODE:
          </div>
          <span>Core learning materials are available. Downloaded videos can also be accessed.</span>
        </div>
      )}
      {isOnline && syncMessage && (
        <div className="bg-green-600 text-white px-4 py-2 text-sm font-medium flex items-center justify-center">
          <Wifi className="w-4 h-4 mr-2" />
          {syncMessage}
        </div>
      )}

      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center">
            <Link to={userType === 'student' ? '/student' : '/teacher'} className="flex items-center">
              <div className="w-8 h-8 bg-blue-700 rounded text-white flex items-center justify-center font-bold text-lg mr-2">
                IAS
              </div>
              <span className="font-bold text-slate-800 text-xl hidden sm:block">Learn Without Internet</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            <nav className="flex space-x-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path || (link.path !== '/student' && link.path !== '/teacher' && location.pathname.startsWith(link.path));
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 ${
                      isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-1.5" />
                    {link.name}
                  </Link>
                );
              })}
            </nav>
            <div className="flex items-center">
              <button 
                onClick={() => setSimulatedOffline(!simulatedOffline)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full border ${
                  simulatedOffline 
                    ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' 
                    : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                }`}
              >
                {simulatedOffline ? 'Simulate Online' : 'Simulate Offline'}
              </button>
            </div>
            <Link to="/" className="text-sm font-medium text-slate-600 hover:text-slate-900 flex items-center">
              <User className="w-4 h-4 mr-1" />
              Exit Demo
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="pt-2 pb-3 space-y-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                  >
                    <Icon className="w-5 h-5 mr-3 text-slate-400" />
                    {link.name}
                  </Link>
                );
              })}
              <div className="px-4 py-3 border-t border-slate-100">
                <button 
                  onClick={() => setSimulatedOffline(!simulatedOffline)}
                  className={`w-full flex justify-center py-2 px-4 border rounded-md text-sm font-medium ${
                    simulatedOffline 
                      ? 'border-red-300 text-red-700 bg-red-50 hover:bg-red-100' 
                      : 'border-slate-300 text-slate-700 bg-white hover:bg-slate-50'
                  }`}
                >
                  {simulatedOffline ? 'Switch to Online Mode' : 'Simulate Offline Mode'}
                </button>
              </div>
              <div className="px-4 py-3">
                <button onClick={handleReset} className="w-full text-left text-sm text-red-600 font-medium py-2">
                  Reset Demo Data
                </button>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center text-sm text-slate-500">
          <div>
            <p className="font-medium text-slate-700">Prototype for IAS School, Buxar</p>
            <p className="text-xs">Buxar, Bihar, India</p>
          </div>
          <button onClick={handleReset} className="text-slate-400 hover:text-red-500 underline">
            Reset DB
          </button>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
