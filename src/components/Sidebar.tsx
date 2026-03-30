import React from 'react';
import { 
  LayoutDashboard, 
  Users,
  Briefcase,
  Zap,
  CreditCard,
  FileText,
  LogOut,
  Plus,
  ShieldCheck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: any) => void;
  onNewTransaction: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, onNewTransaction }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard },
    { id: 'clients', label: 'Clients', icon: Users },
    { id: 'projects', label: 'Projects', icon: Briefcase },
    { id: 'sprints', label: 'Sprints', icon: Zap },
    { id: 'transactions', label: 'Transactions', icon: CreditCard },
    { id: 'reports', label: 'Financial Reports', icon: FileText },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-[#1A1D23] border-r border-gray-200 dark:border-gray-800 flex flex-col h-screen sticky top-0 transition-colors duration-300">
      <div className="p-6 flex items-center gap-3">
        <div className="bg-blue-600 p-2 rounded-lg">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        <div>
          <h1 className="text-lg font-bold leading-tight text-black dark:text-white">Project Alpha</h1>
          <p className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider">Engineering Lead</p>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
              activeTab === item.id 
                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            <item.icon size={20} className={activeTab === item.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'} />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 space-y-4">
        <button 
          onClick={onNewTransaction}
          className="w-full bg-blue-600 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-100 dark:shadow-none hover:bg-blue-700 transition-all"
        >
          <Plus size={18} /> NEW TRANSACTION
        </button>

        <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
            <ShieldCheck size={18} /> System Status
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-2 text-sm font-medium text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>
    </aside>
  );
}
