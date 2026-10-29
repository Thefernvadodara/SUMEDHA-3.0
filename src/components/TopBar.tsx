import React, { useState } from 'react';
import {
  Bell,
  Smartphone,
  Tablet,
  Monitor,
  Check,
  ExternalLink,
  ShieldCheck,
  LogOut,
  Wrench,
  LayoutDashboard,
  CheckSquare,
  Building2,
  Truck,
  CreditCard,
  Boxes,
  Users,
  Receipt,
  TrendingUp,
  Menu,
  ShieldAlert,
  Radio,
} from 'lucide-react';
import { ADMIN_USER } from '../data/mockData';
import { ActiveTab, AuthUser, NotificationItem } from '../types';
import { PWAInstallButton } from './PWA/PWAInstallButton';

interface TopBarProps {
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
  onClearAllNotifications: () => void;
  onOpenTicket: (ticketId: string) => void;
  deviceView: 'mobile' | 'tablet' | 'desktop';
  onChangeDeviceView: (view: 'mobile' | 'tablet' | 'desktop') => void;
  onOpenInstallGuide?: () => void;
  currentUser?: AuthUser | null;
  onLogout?: () => void;
  activeTab?: ActiveTab;
  onChangeTab?: (tab: ActiveTab) => void;
  onOpenAuditLogs?: () => void;
  isRealtimeConnected?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  notifications,
  onMarkNotificationRead,
  onClearAllNotifications,
  onOpenTicket,
  deviceView,
  onChangeDeviceView,
  onOpenInstallGuide,
  currentUser,
  onLogout,
  activeTab = 'dashboard',
  onChangeTab,
  onOpenAuditLogs,
  isRealtimeConnected = true,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const displayName = currentUser?.name || ADMIN_USER.name;
  const displayRole = currentUser?.role === 'admin' ? 'Super Admin' : 'Field Technician';
  const displayAvatar = currentUser?.avatarUrl || ADMIN_USER.avatarUrl;

  const navItems: { id: ActiveTab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'customers', label: 'Customers', icon: Building2 },
    { id: 'suppliers', label: 'Vendors', icon: Truck },
    { id: 'billing', label: 'Invoices', icon: CreditCard },
    { id: 'inventory', label: 'Inventory', icon: Boxes },
    { id: 'staff', label: 'Staff & Payroll', icon: Users },
    { id: 'expenses', label: 'Expenses', icon: Receipt },
    { id: 'profit_loss', label: 'P&L Analytics', icon: TrendingUp },
    { id: 'more', label: 'Settings', icon: Menu },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#070b14]/95 backdrop-blur-md border-b border-cyan-500/15">
      {/* Top Device Mode Toolbar for Developer / Client convenience */}
      <div className="hidden sm:flex items-center justify-between px-4 py-1.5 text-[11px] bg-slate-950/80 border-b border-slate-800/80 text-slate-400">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              isRealtimeConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
            }`}
            title={isRealtimeConnected ? 'Live Server Real-Time SSE Active' : 'Offline Cache Mode'}
          />
          <span className="font-semibold text-slate-300">Sumedha Tech Infra Engine</span>
          <span className="text-slate-600">·</span>
          <span className="text-emerald-400 font-mono text-[10px] flex items-center gap-1">
            <Radio className="w-3 h-3" />
            {isRealtimeConnected ? 'Multi-Device Sync Online' : 'Local Standalone Mode'}
          </span>
        </div>

        {/* Viewport Form Factor Switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
          <button
            onClick={() => onChangeDeviceView('mobile')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              deviceView === 'mobile'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pixel 9 Pro Android View"
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Android Phone</span>
          </button>
          <button
            onClick={() => onChangeDeviceView('tablet')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              deviceView === 'tablet'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Pixel Tablet View"
          >
            <Tablet className="w-3.5 h-3.5" />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => onChangeDeviceView('desktop')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
              deviceView === 'desktop'
                ? 'bg-cyan-600 text-white font-medium shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="Expanded Enterprise Console"
          >
            <Monitor className="w-3.5 h-3.5" />
            <span>Desktop</span>
          </button>
        </div>
      </div>

      {/* Main Header / Welcome Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-2.5">
        {/* User Identity & Company */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={displayAvatar}
              alt={displayName}
              referrerPolicy="no-referrer"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover ring-2 ring-cyan-500/50 shadow-md shadow-cyan-500/20"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-[#070b14] ${
                isRealtimeConnected ? 'bg-emerald-500' : 'bg-amber-500'
              }`}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-wide">
                SUMEDHA TECH INFRA
              </span>
              <span
                className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                  currentUser?.role === 'admin'
                    ? 'bg-cyan-950/80 text-cyan-300 border-cyan-500/40'
                    : 'bg-amber-950/80 text-amber-300 border-amber-500/40'
                }`}
              >
                {currentUser?.role === 'admin' ? (
                  <ShieldCheck className="w-3 h-3 text-cyan-400" />
                ) : (
                  <Wrench className="w-3 h-3 text-amber-400" />
                )}
                <span>{displayRole}</span>
              </span>
            </div>
            <h1 className="text-sm sm:text-base font-bold tracking-tight text-white flex items-center gap-1.5">
              <span>Namaste, {displayName.split(' ')[0]}</span>
              <span className="text-xs font-normal text-slate-400 hidden sm:inline font-mono">
                ({currentUser?.email || 'admin@sumedhatechinfra.com'})
              </span>
            </h1>
          </div>
        </div>

        {/* Right Actions: Audit Logs, Install App Button, Notification Bell, Logout */}
        <div className="relative flex items-center gap-2 sm:gap-2.5">
          {onOpenAuditLogs && (
            <button
              onClick={onOpenAuditLogs}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs text-cyan-300 transition-colors cursor-pointer"
              title="View Security & Audit Trail"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-cyan-400" />
              <span>Audit Logs</span>
            </button>
          )}

          {onOpenInstallGuide && (
            <PWAInstallButton onOpenGuideModal={onOpenInstallGuide} />
          )}

          <button
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Notifications"
            className="relative p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-cyan-500/40 transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
          >
            <Bell className="w-4 h-4 text-cyan-400" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white font-mono text-[9px] font-bold flex items-center justify-center shadow-md">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Logout Button */}
          {onLogout && (
            <button
              onClick={onLogout}
              className="p-2 rounded-xl bg-slate-900 hover:bg-rose-500/10 border border-slate-800 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 transition-colors cursor-pointer"
              title="Sign Out of Session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}

          {/* Notifications Dropdown Drawer */}
          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white text-sm">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="text-xs text-cyan-400 font-mono font-medium">
                      ({unreadCount} new)
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={onClearAllNotifications}
                    className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" /> Mark all read
                  </button>
                )}
              </div>

              <div className="mt-2 divide-y divide-slate-800 max-h-72 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-6">
                    No new service notifications
                  </p>
                ) : (
                  notifications.map((notif) => (
                    <div
                      key={notif.id}
                      onClick={() => {
                        onMarkNotificationRead(notif.id);
                        if (notif.ticketId) onOpenTicket(notif.ticketId);
                      }}
                      className={`py-2.5 px-2 rounded-xl cursor-pointer transition-colors ${
                        notif.read ? 'opacity-60 hover:bg-slate-800/50' : 'bg-slate-800/60 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-xs font-semibold text-white">{notif.title}</span>
                        <span className="text-[10px] text-slate-500 font-mono shrink-0">
                          {notif.time}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-2">{notif.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Desktop / Tablet Horizontal Module Navigation Bar */}
      {onChangeTab && (
        <div className="px-4 sm:px-6 py-2 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto flex items-center gap-1.5 scrollbar-none">
          {navItems.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40 shadow-sm shadow-cyan-500/10'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900 border border-transparent'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
