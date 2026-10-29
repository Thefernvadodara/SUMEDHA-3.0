import React, { useState } from 'react';
import { WEEKLY_CHART_DATA } from '../../data/mockData';

export const WeeklyBarChart: React.FC = () => {
  const [activeDay, setActiveDay] = useState<string | null>(null);

  const maxVal = Math.max(...WEEKLY_CHART_DATA.flatMap((d) => [d.opened, d.resolved]), 16);
  const totalOpened = WEEKLY_CHART_DATA.reduce((acc, curr) => acc + curr.opened, 0);
  const totalResolved = WEEKLY_CHART_DATA.reduce((acc, curr) => acc + curr.resolved, 0);

  return (
    <div className="flex flex-col gap-4 p-4 rounded-2xl bg-gradient-to-br from-slate-900/90 to-[#0c1529]/90 border border-cyan-500/15 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white tracking-tight">
            Weekly Service Volume
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Ticket intake vs resolution velocity
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400" />
            <span className="text-slate-300">Opened ({totalOpened})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-blue-600" />
            <span className="text-slate-300">Resolved ({totalResolved})</span>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-44 flex items-end justify-between gap-2 pt-6 pb-2 px-1 border-b border-slate-800">
        {WEEKLY_CHART_DATA.map((item) => {
          const openedHeight = (item.opened / maxVal) * 100;
          const resolvedHeight = (item.resolved / maxVal) * 100;
          const isSelected = activeDay === item.day;

          return (
            <div
              key={item.day}
              className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end cursor-pointer group"
              onClick={() => setActiveDay(activeDay === item.day ? null : item.day)}
            >
              {/* Tooltip on active */}
              {isSelected && (
                <div className="text-[10px] font-mono py-0.5 px-1.5 rounded bg-cyan-950/90 border border-cyan-400/40 text-cyan-200 shadow-md">
                  +{item.opened} / -{item.resolved}
                </div>
              )}

              {/* Dual Bars */}
              <div className="w-full flex items-end justify-center gap-1 h-32">
                {/* Opened Bar */}
                <div
                  className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                    isSelected ? 'bg-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.8)]' : 'bg-cyan-500/85 hover:bg-cyan-400'
                  }`}
                  style={{ height: `${openedHeight}%` }}
                />
                {/* Resolved Bar */}
                <div
                  className={`w-3 sm:w-4 rounded-t-md transition-all duration-300 ${
                    isSelected ? 'bg-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.8)]' : 'bg-blue-600/80 hover:bg-blue-500'
                  }`}
                  style={{ height: `${resolvedHeight}%` }}
                />
              </div>

              {/* Day Label */}
              <span
                className={`text-[11px] font-medium transition-colors ${
                  isSelected ? 'text-cyan-400 font-bold' : 'text-slate-400 group-hover:text-slate-200'
                }`}
              >
                {item.day}
              </span>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
        <span>SLA Resolution Efficiency: <strong className="text-emerald-400 font-mono">94.2%</strong></span>
        <span>Avg On-Site Turnaround: <strong className="text-cyan-300 font-mono">1.8h</strong></span>
      </div>
    </div>
  );
};
