import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Timer,
  UserCheck2,
  Users,
  Shield,
  Palette,
  Video,
  Tags,
  LayoutTemplate,
  Sliders,
  Cable,
  AppWindow,
  MonitorPlay
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { t, substitutions, obsConnected, onAir } = useApp();

  const queuedCount = substitutions.filter(s => s.status === 'queued').length;

  const menuItems = [
    { id: 'dashboard', label: t('dashboard'), icon: LayoutDashboard },
    { id: 'match_control', label: t('match_control'), icon: Timer },
    { 
      id: 'sub_manager', 
      label: t('sub_manager'), 
      icon: UserCheck2,
      badge: queuedCount > 0 ? queuedCount : null 
    },
    { id: 'player_manager', label: t('player_manager'), icon: Users },
    { id: 'team_manager', label: t('team_manager'), icon: Shield },
    { id: 'designer', label: t('designer'), icon: Palette },
    { 
      id: 'obs_manager', 
      label: t('obs_manager'), 
      icon: Video,
      dot: obsConnected ? 'bg-emerald-400' : 'bg-slate-600'
    },
    { id: 'tag_mapping', label: t('tag_mapping'), icon: Tags },
    { id: 'templates', label: t('templates'), icon: LayoutTemplate },
    { id: 'local_bridge', label: t('local_bridge'), icon: Cable },
    { id: 'settings', label: t('settings'), icon: Sliders },
  ];

  return (
    <aside className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between select-none">
      {/* Top Nav Items */}
      <div className="p-3 space-y-1">
        <div className="px-3 py-2 text-[10px] font-black tracking-widest text-slate-500 uppercase">
          Studio Navigation
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setCurrentTab(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                isActive
                  ? 'bg-gradient-to-r from-[#0066ff] to-[#0088ff] text-white shadow-md shadow-[#0066ff]/25 font-bold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="truncate">{item.label}</span>
              </div>

              {/* Dot / Badge */}
              <div className="flex items-center gap-1.5">
                {item.dot && (
                  <span className={`w-2 h-2 rounded-full ${item.dot} shadow-sm`} />
                )}
                {item.badge && (
                  <span className="px-1.5 py-0.2 bg-[#00d2ff] text-slate-950 font-black text-[10px] rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Dedicated OBS Browser Dock Section */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950/60">
        <div className="px-3 py-1 text-[10px] font-black tracking-widest text-[#00d2ff] uppercase flex items-center justify-between">
          <span>OBS DOCK MODES</span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#00d2ff] animate-ping" />
        </div>

        <div className="mt-2 space-y-1.5">
          <button
            onClick={() => setCurrentTab('browser_dock')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition cursor-pointer ${
              currentTab === 'browser_dock'
                ? 'bg-[#00d2ff]/20 text-[#00d2ff] border border-[#00d2ff]/40'
                : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <AppWindow className="w-4 h-4 text-[#00d2ff]" />
            <div className="text-left">
              <div className="leading-tight">Custom Browser Dock</div>
              <div className="text-[10px] text-slate-500 font-mono">/dock</div>
            </div>
          </button>

          <button
            onClick={() => setCurrentTab('overlay_preview')}
            className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-xs font-bold transition cursor-pointer ${
              currentTab === 'overlay_preview'
                ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40'
                : 'text-slate-300 hover:bg-slate-800/80 border border-transparent'
            }`}
          >
            <MonitorPlay className="w-4 h-4 text-purple-400" />
            <div className="text-left">
              <div className="leading-tight">OBS Browser Source</div>
              <div className="text-[10px] text-slate-500 font-mono">/overlay</div>
            </div>
          </button>
        </div>
      </div>
    </aside>
  );
};
