import React from 'react';
import { ActiveTab } from '../types';
import { LayoutDashboard, CheckSquare, Building2, CreditCard, Menu } from 'lucide-react';

interface BottomNavBarProps {
  activeTab: ActiveTab;
  onChangeTab: (tab: ActiveTab) => void;
  pendingTasksCount: number;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onChangeTab,
  pendingTasksCount,
}) => {
  const tabs = [
    {
      id: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      id: 'tasks' as const,
      label: 'Tasks',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
    },
    {
      id: 'customers' as const,
      label: 'Customers',
      icon: Building2,
    },
    {
      id: 'billing' as const,
      label: 'Billing',
      icon: CreditCard,
    },
    {
      id: 'more' as const,
      label: 'More',
      icon: Menu,
    },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-[#070b14]/95 backdrop-blur-xl border-t border-cyan-500/20 px-2 sm:px-6">
      <div className="max-w-md md:max-w-2xl mx-auto flex items-center justify-between h-16">
        {tabs.map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onChangeTab(tab.id)}
              className="flex-1 flex flex-col items-center justify-center min-h-[48px] py-1 transition-all relative group cursor-pointer"
            >
              {/* Material 3 active indicator pill */}
              <div
                className={`relative px-4 py-1 rounded-full transition-all duration-300 flex items-center justify-center ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                <IconComponent
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'scale-110 stroke-[2.2]' : 'group-hover:scale-105'
                  }`}
                />

                {/* Badge if present */}
                {tab.badge !== undefined && (
                  <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 rounded-full bg-rose-500 text-[9px] font-mono font-bold text-white flex items-center justify-center shadow">
                    {tab.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-0.5 tracking-tight transition-colors font-medium ${
                  isActive ? 'text-cyan-300 font-bold' : 'text-slate-400'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
