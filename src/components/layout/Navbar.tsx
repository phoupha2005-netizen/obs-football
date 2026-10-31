import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Wifi, 
  WifiOff, 
  Play, 
  Square, 
  Globe, 
  ShieldCheck, 
  UserCheck, 
  ExternalLink 
} from 'lucide-react';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { 
    t, 
    language, 
    setLanguage, 
    onAir, 
    obsConnected, 
    match, 
    showOnAir, 
    hideFromAir, 
    role, 
    user, 
    handleLogin, 
    handleLogout 
  } = useApp();

  return (
    <header className="h-16 bg-[#0c101c] border-b border-slate-800/80 px-4 flex items-center justify-between select-none z-30 sticky top-0">
      {/* Brand & Air Tally */}
      <div className="flex items-center gap-4">
        <div 
          onClick={() => setCurrentTab('dashboard')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#0066ff] to-[#00d2ff] flex items-center justify-center font-black text-white text-base tracking-tighter shadow-md shadow-[#0066ff]/30 group-hover:scale-105 transition-transform">
            FS
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-extrabold tracking-wider text-white uppercase flex items-center gap-1.5">
              <span>{t('app_title')}</span>
            </h1>
            <p className="text-[10px] text-slate-400 tracking-tight font-medium">OBS DOCK &amp; BROADCAST</p>
          </div>
        </div>

        {/* Tally Light */}
        <div className="flex items-center gap-2 pl-3 border-l border-slate-800">
          <div
            className={`flex items-center gap-2 px-3 py-1 rounded-md text-xs font-black tracking-widest uppercase transition-all ${
              onAir
                ? 'bg-red-600 text-white shadow-lg shadow-red-600/50 animate-pulse'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            <Radio className={`w-3.5 h-3.5 ${onAir ? 'animate-spin' : ''}`} />
            <span>{onAir ? t('on_air') : t('off_air')}</span>
          </div>
        </div>
      </div>

      {/* Center Match Clock & Score Mini-Monitor */}
      <div className="hidden md:flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-lg border border-slate-800/80 text-xs">
        <span className="font-bold text-slate-300">{match.teamAName}</span>
        <span className="px-2 py-0.5 bg-slate-800 text-[#00d2ff] font-black rounded text-sm">
          {match.scoreA} - {match.scoreB}
        </span>
        <span className="font-bold text-slate-300">{match.teamBName}</span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-emerald-400 font-bold">
          {String(match.matchMinutes).padStart(2, '0')}:{String(match.matchSeconds).padStart(2, '0')}
        </span>
        <span className="px-1.5 py-0.5 bg-slate-900 border border-slate-800 text-[10px] font-bold text-amber-400 rounded">
          {match.currentHalf}
        </span>
      </div>

      {/* Right Controls & Quick Actions */}
      <div className="flex items-center gap-2.5">
        {/* Quick Show / Hide on air */}
        {onAir ? (
          <button
            onClick={() => hideFromAir()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs rounded-md shadow-md shadow-red-900/40 transition-all cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{t('hide_substitution')}</span>
          </button>
        ) : (
          <button
            onClick={() => showOnAir()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs rounded-md shadow-md shadow-emerald-900/40 transition-all cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span className="hidden sm:inline">{t('show_substitution')}</span>
          </button>
        )}

        {/* OBS Status Pill */}
        <div 
          onClick={() => setCurrentTab('obs_manager')}
          className={`cursor-pointer flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-semibold border transition-all ${
            obsConnected
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-400'
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
          }`}
          title="OBS Studio WebSocket Status"
        >
          {obsConnected ? (
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <WifiOff className="w-3.5 h-3.5 text-slate-500" />
          )}
          <span className="hidden lg:inline text-[11px] font-mono">
            {obsConnected ? t('connected') : t('disconnected')}
          </span>
        </div>

        {/* Language Switcher */}
        <div className="relative flex items-center bg-slate-900 border border-slate-800 rounded-md p-0.5 text-xs">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded font-bold text-[11px] transition-all cursor-pointer ${
              language === 'en'
                ? 'bg-[#0066ff] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('th')}
            className={`px-2 py-1 rounded font-bold text-[11px] transition-all cursor-pointer ${
              language === 'th'
                ? 'bg-[#0066ff] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ไทย
          </button>
          <button
            onClick={() => setLanguage('la')}
            className={`px-2 py-1 rounded font-bold text-[11px] transition-all cursor-pointer ${
              language === 'la'
                ? 'bg-[#0066ff] text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            ລາວ
          </button>
        </div>

        {/* User Auth & Role */}
        {user ? (
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div className="hidden xl:flex flex-col text-right">
              <span className="text-[11px] font-semibold text-slate-300 leading-tight">
                {user.displayName || user.email}
              </span>
              <span className="text-[9px] text-[#00d2ff] font-mono uppercase">
                {role}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="text-[10px] px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer"
            >
              Sign out
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-md transition cursor-pointer"
          >
            <UserCheck className="w-3.5 h-3.5 text-[#00d2ff]" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        )}
      </div>
    </header>
  );
};
