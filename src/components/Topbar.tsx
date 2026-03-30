import React from 'react';
import { Bell, HelpCircle, Moon, Sun } from 'lucide-react';

interface TopbarProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

export default function Topbar({ theme, toggleTheme }: TopbarProps) {
  return (
    <header className="h-20 bg-white dark:bg-[#1A1D23] border-b border-gray-200 dark:border-gray-800 px-8 flex items-center justify-between sticky top-0 z-20 transition-colors duration-300">
      <div className="flex items-center gap-12">
        <h2 className="text-xl font-bold text-blue-600">Blueprint Engineering</h2>
        <nav className="flex gap-8">
          {['Dashboard', 'Analytics', 'Reports'].map((item) => (
            <button 
              key={item} 
              className={`text-sm font-medium transition-colors ${item === 'Dashboard' ? 'text-blue-600 border-b-2 border-blue-600 pb-1' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'}`}
            >
              {item}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-6">
        <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500">
          <button 
            onClick={toggleTheme}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
          >
            {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
          </button>
          <button className="hover:text-gray-600 dark:hover:text-gray-300 relative">
            <Bell size={20} />
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-[#1A1D23]"></span>
          </button>
          <button className="hover:text-gray-600 dark:hover:text-gray-300">
            <HelpCircle size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3 pl-6 border-l border-gray-100 dark:border-gray-800">
          <div className="text-right">
            <p className="text-sm font-bold text-black dark:text-white">Omar Al-Farsi</p>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase">Administrator</p>
          </div>
          <img 
            src="https://picsum.photos/seed/omar/100/100" 
            alt="User" 
            className="w-10 h-10 rounded-full object-cover border-2 border-gray-100 dark:border-gray-800"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
}
