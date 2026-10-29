import React from 'react';
import { EquipmentType } from '../types';

interface EquipmentIconProps {
  type: EquipmentType;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const EquipmentIcon: React.FC<EquipmentIconProps> = ({
  type,
  className = '',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-7 h-7',
    xl: 'w-9 h-9',
  };

  const currentSize = sizeClasses[size];

  switch (type) {
    case 'cctv_camera':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-cyan-400 ${className}`}
        >
          {/* CCTV Dome/Bullet Body */}
          <path d="M3 13h1m3-4l9-3.5a1.5 1.5 0 0 1 2 1.4v7.2a1.5 1.5 0 0 1-2 1.4L7 16" />
          <path d="M7 9v7l-3-2V11l3-2z" />
          <circle cx="16" cy="12.5" r="2.2" fill="currentColor" fillOpacity="0.25" />
          <circle cx="16" cy="12.5" r="1" fill="currentColor" />
          {/* Wall Mount Bracket */}
          <path d="M4 19v-4" strokeWidth="2" />
          <path d="M2 19h5" strokeWidth="2" />
          <path d="M19 7l2-1" strokeOpacity="0.6" />
        </svg>
      );

    case 'nvr_dvr':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-sky-400 ${className}`}
        >
          {/* NVR Rack Enclosure */}
          <rect x="2" y="5" width="20" height="14" rx="2" />
          <line x1="2" y1="12" x2="22" y2="12" strokeOpacity="0.4" />
          {/* Channel status LEDs */}
          <circle cx="6" cy="8.5" r="1" fill="currentColor" />
          <circle cx="9" cy="8.5" r="1" fill="currentColor" />
          <circle cx="12" cy="8.5" r="1" fill="currentColor" />
          <circle cx="15" cy="8.5" r="1" fill="currentColor" />
          {/* HDD Bay & USB Ports */}
          <rect x="5" y="14.5" width="4" height="2" rx="0.5" strokeWidth="1.2" />
          <line x1="12" y1="15.5" x2="18" y2="15.5" strokeWidth="1.4" />
        </svg>
      );

    case 'desktop_pc':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-blue-400 ${className}`}
        >
          {/* Monitor Screen */}
          <rect x="3" y="3" width="18" height="12" rx="2" />
          <line x1="3" y1="12" x2="21" y2="12" strokeOpacity="0.3" />
          <path d="M8 21h8" strokeWidth="2" />
          <path d="M12 15v6" strokeWidth="2" />
        </svg>
      );

    case 'laptop':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-indigo-400 ${className}`}
        >
          <rect x="4" y="5" width="16" height="10" rx="1.5" />
          <path d="M2 19h20l-1.5-3H3.5L2 19z" />
          <line x1="10" y1="18" x2="14" y2="18" strokeWidth="1.2" />
        </svg>
      );

    case 'network_printer':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-teal-400 ${className}`}
        >
          {/* Top Paper Tray */}
          <path d="M6 9V3h12v6" />
          {/* Main Body */}
          <rect x="3" y="9" width="18" height="9" rx="2" />
          {/* Bottom Output Paper */}
          <path d="M7 15h10v5H7z" fill="currentColor" fillOpacity="0.15" />
          {/* Status Light & Button */}
          <circle cx="18" cy="12" r="1" fill="currentColor" />
        </svg>
      );

    case 'biometric_punch':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-emerald-400 ${className}`}
        >
          {/* Device Wall Terminal */}
          <rect x="4" y="2" width="16" height="20" rx="3" />
          {/* Camera / Face recognition lens */}
          <circle cx="12" cy="6" r="1.5" fill="currentColor" />
          {/* Mini LCD Display */}
          <rect x="7" y="9" width="10" height="3" rx="0.5" strokeWidth="1" strokeOpacity="0.6" />
          {/* Fingerprint Sensor Area */}
          <path d="M12 15a2 2 0 0 0-2 2c0 1.1.9 2 2 2s2-.9 2-2" strokeWidth="1.2" />
          <path d="M9 17.5a3 3 0 0 1 6 0" strokeWidth="1.2" />
        </svg>
      );

    case 'networking_switch':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-cyan-400 ${className}`}
        >
          {/* Rack Mount 1U Chassis */}
          <rect x="2" y="7" width="20" height="10" rx="1.5" />
          {/* Ethernet Ports with Status LEDs */}
          <line x1="5" y1="12" x2="6" y2="12" strokeWidth="2.5" />
          <line x1="8" y1="12" x2="9" y2="12" strokeWidth="2.5" />
          <line x1="11" y1="12" x2="12" y2="12" strokeWidth="2.5" />
          <line x1="14" y1="12" x2="15" y2="12" strokeWidth="2.5" />
          {/* SFP Fiber Uplink Ports */}
          <rect x="18" y="10.5" width="2.5" height="3" strokeWidth="1.2" fill="currentColor" fillOpacity="0.3" />
        </svg>
      );

    case 'wifi_ap':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-sky-300 ${className}`}
        >
          {/* Circular Ceiling AP Dome */}
          <circle cx="12" cy="18" r="2.5" fill="currentColor" />
          <path d="M7.5 13.5a6.5 6.5 0 0 1 9 0" />
          <path d="M4 10a11.5 11.5 0 0 1 16 0" />
          <path d="M1 6.5a16 16 0 0 1 22 0" strokeOpacity="0.7" />
        </svg>
      );

    case 'server_rack':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-blue-500 ${className}`}
        >
          {/* Server Rack Enclosure */}
          <rect x="4" y="2" width="16" height="20" rx="2" />
          {/* Blade 1 */}
          <line x1="4" y1="8" x2="20" y2="8" />
          <circle cx="7" cy="5" r="1" fill="currentColor" />
          <line x1="11" y1="5" x2="17" y2="5" strokeWidth="1.2" />
          {/* Blade 2 */}
          <line x1="4" y1="14" x2="20" y2="14" />
          <circle cx="7" cy="11" r="1" fill="currentColor" />
          <line x1="11" y1="11" x2="17" y2="11" strokeWidth="1.2" />
          {/* Blade 3 / Storage */}
          <circle cx="7" cy="17" r="1" fill="currentColor" />
          <line x1="11" y1="17" x2="17" y2="17" strokeWidth="1.2" />
        </svg>
      );

    case 'epabx_system':
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`${currentSize} text-violet-400 ${className}`}
        >
          {/* EPABX Central Unit */}
          <rect x="3" y="4" width="18" height="14" rx="2" />
          <line x1="7" y1="10" x2="9" y2="10" strokeWidth="1.5" />
          <line x1="11" y1="10" x2="13" y2="10" strokeWidth="1.5" />
          <line x1="15" y1="10" x2="17" y2="10" strokeWidth="1.5" />
          <line x1="7" y1="13" x2="9" y2="13" strokeWidth="1.5" />
          <line x1="11" y1="13" x2="13" y2="13" strokeWidth="1.5" />
          <line x1="15" y1="13" x2="17" y2="13" strokeWidth="1.5" />
          {/* Handset/Intercom Icon */}
          <path d="M5 20c3 0 6-1 8-2l3 2" strokeWidth="1.5" />
        </svg>
      );

    default:
      return (
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className={`${currentSize} text-cyan-400 ${className}`}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <line x1="3" y1="9" x2="21" y2="9" />
          <line x1="9" y1="21" x2="9" y2="9" />
        </svg>
      );
  }
};

export const getEquipmentLabel = (type: EquipmentType): string => {
  switch (type) {
    case 'cctv_camera':
      return 'CCTV Camera';
    case 'nvr_dvr':
      return 'NVR / DVR System';
    case 'desktop_pc':
      return 'Desktop PC';
    case 'laptop':
      return 'Workstation Laptop';
    case 'network_printer':
      return 'Network Printer';
    case 'biometric_punch':
      return 'Biometric Machine';
    case 'networking_switch':
      return 'PoE Network Switch';
    case 'wifi_ap':
      return 'Enterprise Wi-Fi';
    case 'server_rack':
      return 'Rack Server';
    case 'epabx_system':
      return 'EPABX Intercom';
    default:
      return 'IT Equipment';
  }
};
