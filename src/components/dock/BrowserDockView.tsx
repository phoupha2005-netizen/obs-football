import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Radio, 
  Play, 
  Square, 
  SkipForward, 
  SkipBack, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Timer, 
  ArrowRightLeft, 
  Video, 
  Layers, 
  Volume2, 
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';

interface BrowserDockViewProps {
  initialSubTab?: 'sub' | 'match' | 'sources' | 'scoreboard';
  isStandalone?: boolean;
}

export const BrowserDockView: React.FC<BrowserDockViewProps> = ({ 
  initialSubTab = 'sub',
  isStandalone = false 
}) => {
  const { 
    t, 
    onAir, 
    showOnAir, 
    hideFromAir, 
    nextSub, 
    prevSub, 
    match, 
    updateScore, 
    toggleTimer, 
    resetTimer, 
    substitutions, 
    activeSub, 
    obsConnected, 
    connectOBS, 
    sources, 
    activeScene, 
    toggleSourceVisibility 
  } = useApp();

  const [activeTab, setActiveTab] = useState<'sub' | 'match' | 'sources' | 'scoreboard'>(initialSubTab);
  const [copiedUrl, setCopiedUrl] = useState<boolean>(false);

  const queuedSubs = substitutions.filter(s => s.status === 'queued');

  const dockUrl = `${window.location.origin}/dock`;
  const overlayUrl = `${window.location.origin}/overlay`;

  const copyDockUrl = () => {
    navigator.clipboard.writeText(dockUrl);
    setCopiedUrl(true);
    setTimeout(() => setCopiedUrl(false), 2000);
  };

  return (
    <div className={`flex flex-col bg-[#07090e] text-white select-none ${isStandalone ? 'h-screen w-screen' : 'p-4 max-w-4xl mx-auto space-y-4'}`}>
      {/* Studio URL Notice (shown only when inside main admin) */}
      {!isStandalone && (
        <div className="bg-gradient-to-r from-slate-900 to-[#0b1324] border border-[#00d2ff]/30 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-[#00d2ff] tracking-wider">
              {t('dock_mode_title')}
            </span>
            <a
              href="/dock"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-slate-300 hover:text-white flex items-center gap-1"
            >
              <span>{t('open_dock')}</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#00d2ff]" />
            </a>
          </div>

          <p className="text-xs text-slate-400">
            {t('dock_instructions')}
          </p>

          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={dockUrl}
              className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-1.5 font-mono text-xs text-emerald-400 focus:outline-none"
            />
            <button
              onClick={copyDockUrl}
              className="px-4 py-1.5 bg-[#0066ff] hover:bg-[#0055dd] text-white font-bold text-xs rounded flex items-center gap-1.5 cursor-pointer"
            >
              {copiedUrl ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedUrl ? 'Copied' : t('copy_url')}</span>
            </button>
          </div>
        </div>
      )}

      {/* Dock Window Body */}
      <div className={`bg-[#0a0d17] border border-slate-800 rounded-lg flex flex-col overflow-hidden shadow-2xl ${isStandalone ? 'h-full' : ''}`}>
        {/* Compact Dock Top Bar */}
        <div className="h-11 bg-slate-950 border-b border-slate-800 px-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-[#0066ff] flex items-center justify-center font-black text-white text-[10px]">
              FS
            </div>
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              OBS DOCK
            </span>

            {/* Air Tally Pill */}
            <div className={`px-2 py-0.5 rounded text-[10px] font-black tracking-widest uppercase flex items-center gap-1 ${
              onAir ? 'bg-red-600 text-white animate-pulse' : 'bg-slate-900 text-slate-500'
            }`}>
              <Radio className="w-2.5 h-2.5" />
              <span>{onAir ? 'ON AIR' : 'OFF'}</span>
            </div>
          </div>

          {/* Quick OBS connection status / reconnect */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => connectOBS()}
              className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold flex items-center gap-1 transition ${
                obsConnected
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : 'bg-slate-900 text-slate-400 border border-slate-800 hover:text-white'
              }`}
              title="Click to Reconnect OBS"
            >
              {obsConnected ? <Wifi className="w-3 h-3 text-emerald-400" /> : <WifiOff className="w-3 h-3" />}
              <span>{obsConnected ? 'OBS OK' : 'RECONNECT'}</span>
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="grid grid-cols-4 bg-slate-950/70 border-b border-slate-800 text-xs font-bold">
          <button
            onClick={() => setActiveTab('sub')}
            className={`py-2 text-center transition cursor-pointer border-b-2 ${
              activeTab === 'sub'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Substitutions
          </button>
          <button
            onClick={() => setActiveTab('match')}
            className={`py-2 text-center transition cursor-pointer border-b-2 ${
              activeTab === 'match'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Match Clock
          </button>
          <button
            onClick={() => setActiveTab('scoreboard')}
            className={`py-2 text-center transition cursor-pointer border-b-2 ${
              activeTab === 'scoreboard'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            Scoreboard
          </button>
          <button
            onClick={() => setActiveTab('sources')}
            className={`py-2 text-center transition cursor-pointer border-b-2 ${
              activeTab === 'sources'
                ? 'border-[#00d2ff] text-[#00d2ff] bg-slate-900'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            OBS Sources
          </button>
        </div>

        {/* Tab 1: SUBSTITUTION CONTROLLER */}
        {activeTab === 'sub' && (
          <div className="p-3 space-y-3 overflow-y-auto flex-1">
            {/* Master Show / Hide Big Buttons */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => showOnAir()}
                className="py-3 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>SHOW ON AIR</span>
              </button>

              <button
                onClick={() => hideFromAir()}
                className="py-3 bg-red-600 hover:bg-red-700 active:scale-98 text-white font-black text-xs uppercase tracking-wider rounded-lg shadow flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>HIDE LOWER THIRD</span>
              </button>
            </div>

            {/* Next / Prev Sub */}
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => prevSub()}
                className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded border border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
              >
                <SkipBack className="w-3.5 h-3.5" />
                <span>PREV SUB</span>
              </button>

              <button
                onClick={() => nextSub()}
                className="py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs rounded border border-slate-800 flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>NEXT SUB</span>
                <SkipForward className="w-3.5 h-3.5 text-[#00d2ff]" />
              </button>
            </div>

            {/* Currently Active or Queued items */}
            <div className="space-y-1.5 pt-1">
              <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Substitution Queue ({queuedSubs.length})
              </div>

              {queuedSubs.map(sub => (
                <div
                  key={sub.id}
                  className={`p-2.5 rounded-lg border flex items-center justify-between text-xs ${
                    activeSub?.id === sub.id && onAir
                      ? 'bg-red-950/40 border-red-500/50'
                      : 'bg-slate-900/90 border-slate-800'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="font-bold text-slate-200">
                      {sub.teamName} <span className="text-amber-400 font-mono">({sub.minute}')</span>
                    </div>
                    <div className="text-red-400 font-semibold text-[11px]">
                      ▼ #{sub.playerOutNumber} {sub.playerOutName}
                    </div>
                    <div className="text-emerald-400 font-semibold text-[11px]">
                      ▲ #{sub.playerInNumber} {sub.playerInName}
                    </div>
                  </div>

                  <button
                    onClick={() => showOnAir(sub.id)}
                    className="px-3 py-1.5 bg-[#0066ff] hover:bg-[#0055dd] text-white text-xs font-bold rounded cursor-pointer"
                  >
                    AIR
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: MATCH CLOCK CONTROLLER */}
        {activeTab === 'match' && (
          <div className="p-3 space-y-4 overflow-y-auto flex-1">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-center space-y-2">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
                Live Match Clock
              </span>
              <div className="text-4xl font-mono font-black text-emerald-400 tracking-widest">
                {String(match.matchMinutes).padStart(2, '0')}:{String(match.matchSeconds).padStart(2, '0')}
              </div>
              <div className="text-xs text-amber-400 font-bold uppercase">
                {match.currentHalf} • {match.isTimerRunning ? 'RUNNING' : 'PAUSED'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={toggleTimer}
                className={`py-3 rounded-lg font-black text-xs uppercase tracking-wider text-white shadow cursor-pointer ${
                  match.isTimerRunning ? 'bg-amber-600 hover:bg-amber-700' : 'bg-emerald-600 hover:bg-emerald-700'
                }`}
              >
                {match.isTimerRunning ? 'PAUSE CLOCK' : 'START CLOCK'}
              </button>

              <button
                onClick={resetTimer}
                className="py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 font-bold text-xs uppercase rounded-lg border border-slate-800 cursor-pointer"
              >
                RESET (00:00)
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: SCOREBOARD */}
        {activeTab === 'scoreboard' && (
          <div className="p-3 space-y-4 overflow-y-auto flex-1">
            <div className="grid grid-cols-2 gap-3 text-center">
              {/* Team A */}
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg space-y-2">
                <span className="text-xs font-bold text-slate-300 truncate block">
                  {match.teamAName}
                </span>
                <div className="text-3xl font-black text-[#00d2ff]">{match.scoreA}</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateScore('A', -1)}
                    className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => updateScore('A', 1)}
                    className="w-8 h-8 rounded bg-[#0066ff] hover:bg-[#0055dd] text-white font-bold"
                  >
                    +1
                  </button>
                </div>
              </div>

              {/* Team B */}
              <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-lg space-y-2">
                <span className="text-xs font-bold text-slate-300 truncate block">
                  {match.teamBName}
                </span>
                <div className="text-3xl font-black text-[#00d2ff]">{match.scoreB}</div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => updateScore('B', -1)}
                    className="w-8 h-8 rounded bg-slate-800 hover:bg-slate-700 text-white font-bold"
                  >
                    -1
                  </button>
                  <button
                    onClick={() => updateScore('B', 1)}
                    className="w-8 h-8 rounded bg-[#0066ff] hover:bg-[#0055dd] text-white font-bold"
                  >
                    +1
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: OBS SOURCES QUICK TOGGLES */}
        {activeTab === 'sources' && (
          <div className="p-3 space-y-2 overflow-y-auto flex-1">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Quick Toggle Sources ({sources.length})
            </div>

            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {sources.map(src => (
                <div
                  key={src.sceneItemId}
                  className="p-2 bg-slate-900 rounded border border-slate-800 flex items-center justify-between text-xs"
                >
                  <span className="font-semibold text-slate-300 truncate">{src.sourceName}</span>
                  <button
                    onClick={() => toggleSourceVisibility(src.sceneName, src.sceneItemId, !src.sceneItemEnabled)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      src.sceneItemEnabled ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-slate-800 text-slate-500'
                    }`}
                  >
                    {src.sceneItemEnabled ? 'VISIBLE' : 'HIDDEN'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
