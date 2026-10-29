import React, { useState } from 'react';
import { Ticket } from '../../types';

interface StatusDonutChartProps {
  tickets: Ticket[];
  onSelectStatus?: (status: string | null) => void;
  selectedStatus?: string | null;
}

export const StatusDonutChart: React.FC<StatusDonutChartProps> = ({
  tickets,
  onSelectStatus,
  selectedStatus,
}) => {
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const pendingCount = tickets.filter((t) => t.status === 'pending').length;
  const inProgressCount = tickets.filter((t) => t.status === 'in_progress').length;
  const solvedCount = tickets.filter((t) => t.status === 'solved').length;
  const onHoldCount = tickets.filter((t) => t.status === 'on_hold').length;
  const total = tickets.length || 1;

  const data = [
    { label: 'Solved', key: 'solved', count: solvedCount, color: '#10b981', glow: 'rgba(16, 185, 129, 0.4)' },
    { label: 'In Progress', key: 'in_progress', count: inProgressCount, color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.4)' },
    { label: 'Pending', key: 'pending', count: pendingCount, color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.4)' },
    { label: 'On Hold', key: 'on_hold', count: onHoldCount, color: '#64748b', glow: 'rgba(100, 116, 139, 0.4)' },
  ];

  // SVG Donut calculation
  const size = 160;
  const strokeWidth = 18;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  let accumulatedPercent = 0;

  const solvedPercentage = Math.round((solvedCount / total) * 100);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0c1529]/90 border border-cyan-500/15 shadow-lg">
      <div className="relative flex items-center justify-center">
        <svg width={size} height={size} className="transform -rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.05)"
            strokeWidth={strokeWidth}
          />
          {data.map((item, idx) => {
            const percent = item.count / total;
            const strokeDasharray = `${percent * circumference} ${circumference}`;
            const strokeDashoffset = -accumulatedPercent * circumference;
            accumulatedPercent += percent;

            const isSelected = selectedStatus === item.key;
            const isHovered = hoveredIdx === idx;

            return (
              <circle
                key={item.key}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="transparent"
                stroke={item.color}
                strokeWidth={isSelected || isHovered ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-300 cursor-pointer"
                style={{
                  filter: isHovered || isSelected ? `drop-shadow(0 0 8px ${item.glow})` : undefined,
                }}
                onMouseEnter={() => setHoveredIdx(idx)}
                onMouseLeave={() => setHoveredIdx(null)}
                onClick={() => onSelectStatus?.(selectedStatus === item.key ? null : item.key)}
              />
            );
          })}
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="text-2xl font-bold tracking-tight text-white font-mono tabular-nums">
            {solvedPercentage}%
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-wider font-medium">
            Resolved
          </span>
        </div>
      </div>

      {/* Interactive Legend */}
      <div className="flex flex-col gap-2 w-full sm:w-auto min-w-[150px]">
        <div className="text-xs font-semibold text-slate-300 mb-1">
          Status Distribution
        </div>
        {data.map((item, idx) => {
          const isSelected = selectedStatus === item.key;
          const isHovered = hoveredIdx === idx;
          const pct = Math.round((item.count / total) * 100);

          return (
            <button
              key={item.key}
              onClick={() => onSelectStatus?.(selectedStatus === item.key ? null : item.key)}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
              className={`flex items-center justify-between gap-3 text-xs py-1 px-2 rounded-lg transition-colors text-left ${
                isSelected
                  ? 'bg-slate-800/80 ring-1 ring-cyan-500/40 text-white'
                  : isHovered
                  ? 'bg-slate-800/40 text-slate-200'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="font-medium">{item.label}</span>
              </div>
              <div className="flex items-center gap-1.5 font-mono tabular-nums">
                <span className="font-semibold text-slate-200">{item.count}</span>
                <span className="text-slate-500 text-[10px]">({pct}%)</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
