import React from 'react';
import { useApp } from '../../context/AppContext';
import { LiveLowerThirdPreview } from '../preview/LiveLowerThirdPreview';
import { 
  Play, 
  Square, 
  SkipForward, 
  SkipBack, 
  Trash2, 
  Radio, 
  Wifi, 
  WifiOff, 
  Shield, 
  Clock, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const DashboardView: React.FC<{ onNavigate: (tab: string) => void }> = ({ onNavigate }) => {
  const { 
    t, 
    match, 
    substitutions, 
    activeSub, 
    onAir, 
    showOnAir, 
    hideFromAir, 
    nextSub, 
    prevSub, 
    clearSubstitutions, 
    activeTemplate, 
    obsConnected, 
    pairingCode, 
    logs,
    customLabels
  } = useApp();

  const queuedSubs = substitutions.filter(s => s.status === 'queued');

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Live Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 rounded-xl p-5 border border-slate-800 shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Match Overview */}
        <div className="flex items-center gap-6 w-full lg:w-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
              <img src={match.teamALogo} alt={match.teamAName} className="max-h-full max-w-full object-contain" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white leading-tight">{match.teamAName}</div>
              <div className="text-xs text-slate-400 font-mono">HOME</div>
            </div>
          </div>

          <div className="flex flex-col items-center px-4 py-2 bg-slate-950/80 rounded-lg border border-slate-800">
            <div className="text-2xl font-black text-[#00d2ff] tracking-tight">
              {match.scoreA} - {match.scoreB}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
              <Clock className="w-3 h-3" />
              <span>
                {String(match.matchMinutes).padStart(2, '0')}:{String(match.matchSeconds).padStart(2, '0')}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-amber-400">{match.currentHalf}</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-base font-extrabold text-white leading-tight">{match.teamBName}</div>
              <div className="text-xs text-slate-400 font-mono">AWAY</div>
            </div>
            <div className="w-12 h-12 rounded-xl bg-slate-800 border border-slate-700 p-1 flex items-center justify-center overflow-hidden">
              <img src={match.teamBLogo} alt={match.teamBName} className="max-h-full max-w-full object-contain" />
            </div>
          </div>
        </div>

        {/* Broadcast Action Buttons */}
        <div className="flex items-center flex-wrap gap-2.5 w-full lg:w-auto justify-end">
          {onAir ? (
            <button
              onClick={() => hideFromAir()}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{t('hide_substitution')}</span>
            </button>
          ) : (
            <button
              onClick={() => showOnAir()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-95 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t('show_substitution')}</span>
            </button>
          )}

          <button
            onClick={() => nextSub()}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer transition"
            title="Show Next Queued Substitution"
          >
            <SkipForward className="w-4 h-4 text-[#00d2ff]" />
            <span>{t('next_substitution')}</span>
          </button>

          <button
            onClick={() => prevSub()}
            className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer transition"
            title="Recall Previous Substitution"
          >
            <SkipBack className="w-4 h-4 text-slate-400" />
            <span>{t('prev_substitution')}</span>
          </button>

          <button
            onClick={() => clearSubstitutions()}
            className="px-3 py-2.5 bg-slate-900 hover:bg-red-950 text-slate-400 hover:text-red-400 font-bold text-xs rounded-lg border border-slate-800 cursor-pointer transition"
            title="Clear Queue"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Grid: On-Air Live Preview & Queue */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Live On-Air Monitor */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0b0f19] border border-slate-800/90 rounded-xl overflow-hidden shadow-2xl">
            {/* Monitor Header */}
            <div className="px-4 py-3 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse" />
                <span className="text-xs font-black tracking-wider text-slate-200 uppercase">
                  PROGRAM OUTPUT PREVIEW (1920×1080)
                </span>
                <span className="text-[10px] text-slate-500 font-mono">
                  [{activeTemplate.name}]
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('designer')}
                  className="text-xs font-bold text-[#00d2ff] hover:underline flex items-center gap-1"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Customize in Designer</span>
                </button>
              </div>
            </div>

            {/* Scaled Preview Canvas */}
            <div className="relative w-full aspect-video bg-gradient-to-b from-slate-950 via-[#060a14] to-black flex items-center justify-center p-2 overflow-hidden border-b border-slate-800">
              {/* Stadium Mock Background for Broadcast Contrast */}
              <div 
                className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80')`
                }}
              />
              
              {/* Scanline overlay effect */}
              <div className="absolute inset-0 bg-radial from-transparent to-black/80 pointer-events-none" />

              {/* Render Lower Third */}
              <div className="relative z-10 w-full h-full flex items-end justify-center pb-4">
                <LiveLowerThirdPreview
                  template={activeTemplate}
                  match={match}
                  substitution={activeSub || queuedSubs[0] || null}
                  customLabels={customLabels}
                  scale={0.42}
                  forceVisible={onAir || true}
                />
              </div>

              {/* Overlay status tag */}
              <div className="absolute top-3 left-3 z-20 flex items-center gap-2 bg-black/70 backdrop-blur px-2.5 py-1 rounded border border-slate-700 text-[10px] font-mono">
                <span className={`w-2 h-2 rounded-full ${onAir ? 'bg-red-500 animate-ping' : 'bg-slate-600'}`} />
                <span className={onAir ? 'text-red-400 font-bold' : 'text-slate-400'}>
                  {onAir ? 'TRANSMITTING TO OBS' : 'STANDBY PREVIEW'}
                </span>
              </div>
            </div>

            {/* Quick Status Bar */}
            <div className="p-4 bg-slate-950/70 flex items-center justify-between text-xs">
              <div className="flex items-center gap-4">
                <div>
                  <span className="text-slate-500">Active Lower Third: </span>
                  <span className="font-bold text-slate-200">
                    {activeSub ? `#${activeSub.playerOutNumber} ${activeSub.playerOutName} ➜ #${activeSub.playerInNumber} ${activeSub.playerInName}` : 'None (Ready)'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('browser_dock')}
                  className="px-3 py-1 rounded bg-[#00d2ff]/10 text-[#00d2ff] hover:bg-[#00d2ff]/20 font-bold text-xs flex items-center gap-1 cursor-pointer transition"
                >
                  <span>Open OBS Dock</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Queued Substitutions & Quick OBS Link */}
        <div className="space-y-4">
          {/* Queued Substitutions Card */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#00d2ff]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {t('sub_queue')} ({queuedSubs.length})
                </h3>
              </div>
              <button
                onClick={() => onNavigate('sub_manager')}
                className="text-[11px] font-bold text-[#00d2ff] hover:underline"
              >
                Manage Queue
              </button>
            </div>

            {queuedSubs.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-500">
                {t('no_subs_in_queue')}
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {queuedSubs.map((sub, index) => (
                  <div
                    key={sub.id}
                    className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg hover:border-slate-700 transition flex items-center justify-between group"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-1.5 py-0.5 bg-slate-800 text-[10px] font-mono font-bold text-slate-400 rounded">
                          #{index + 1}
                        </span>
                        <span className="text-xs font-bold text-slate-300">
                          {sub.teamName}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                          {sub.minute}'
                        </span>
                      </div>
                      <div className="text-xs space-y-0.5">
                        <div className="text-red-400 flex items-center gap-1 font-semibold">
                          <span>▼ OUT:</span>
                          <span>#{sub.playerOutNumber} {sub.playerOutName}</span>
                        </div>
                        <div className="text-emerald-400 flex items-center gap-1 font-semibold">
                          <span>▲ IN:</span>
                          <span>#{sub.playerInNumber} {sub.playerInName}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => showOnAir(sub.id)}
                      className="px-3 py-1.5 bg-[#0066ff] hover:bg-[#0055dd] text-white text-xs font-bold rounded shadow cursor-pointer active:scale-95 transition"
                    >
                      SHOW
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Local OBS Bridge Status Card */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Wifi className="w-4 h-4 text-emerald-400" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  OBS Connection &amp; Bridge
                </h3>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-mono font-bold rounded ${
                obsConnected 
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}>
                {obsConnected ? 'CONNECTED' : 'DISCONNECTED'}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-slate-400">
                <span>Studio Pairing Code:</span>
                <span className="font-mono text-base font-black text-[#00d2ff] bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {pairingCode}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                To connect OBS Studio without browser security warnings, run the Local OBS Bridge on your streaming PC.
              </p>
            </div>

            <div className="pt-2 flex items-center gap-2">
              <button
                onClick={() => onNavigate('local_bridge')}
                className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center justify-center gap-1.5 transition cursor-pointer"
              >
                <span>Setup OBS Bridge</span>
                <ChevronRight className="w-3.5 h-3.5 text-[#00d2ff]" />
              </button>
            </div>
          </div>

          {/* Event Log stream */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
                Broadcast Log
              </h3>
              <span className="text-[10px] text-slate-500 font-mono">Live Feed</span>
            </div>
            <div className="space-y-1.5 max-h-36 overflow-y-auto text-[11px] font-mono text-slate-400">
              {logs.slice(0, 5).map(log => (
                <div key={log.id} className="truncate">
                  <span className="text-slate-600">[{log.timestamp}]</span>{' '}
                  <span className={log.type === 'sub' ? 'text-emerald-400' : log.type === 'error' ? 'text-red-400' : 'text-slate-300'}>
                    {log.message}
                  </span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-slate-600 text-center py-2">No broadcast events yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
