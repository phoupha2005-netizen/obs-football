import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MatchHalf, MatchStatus } from '../../types';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Plus, 
  Minus, 
  Save, 
  Shield, 
  Clock, 
  Trophy, 
  Send 
} from 'lucide-react';

export const MatchControlView: React.FC = () => {
  const { 
    t, 
    match, 
    setMatch, 
    updateScore, 
    toggleTimer, 
    resetTimer, 
    setMatchTime, 
    setMatchHalf, 
    teams,
    syncTagsToOBS
  } = useApp();

  const [customMin, setCustomMin] = useState<number>(match.matchMinutes);
  const [customSec, setCustomSec] = useState<number>(match.matchSeconds);

  const halves: MatchHalf[] = ['1H', 'HT', '2H', 'FT', 'ET1', 'ET2', 'PEN'];

  const handleApplyTime = () => {
    setMatchTime(Number(customMin) || 0, Number(customSec) || 0);
  };

  const handleQuickAddMin = (delta: number) => {
    const newMin = Math.max(0, match.matchMinutes + delta);
    setMatchTime(newMin, match.matchSeconds);
    setCustomMin(newMin);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Timer className="w-5 h-5 text-[#00d2ff]" />
            <span>{t('match_control')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast scorekeeper, timer controller, and match period coordinator
          </p>
        </div>

        <button
          onClick={() => syncTagsToOBS()}
          className="px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00d2ff] hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#0066ff]/20 flex items-center gap-2 cursor-pointer transition"
        >
          <Send className="w-4 h-4" />
          <span>Sync Score &amp; Clock to OBS</span>
        </button>
      </div>

      {/* Main Scoreboard Station */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-6 shadow-2xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* TEAM A */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-xl bg-slate-950 p-1 flex items-center justify-center border border-slate-700">
              <img src={match.teamALogo} alt={match.teamAName} className="max-h-full max-w-full object-contain" />
            </div>

            <select
              value={match.teamAId}
              onChange={(e) => {
                const found = teams.find(t => t.id === e.target.value);
                if (found) {
                  setMatch(prev => ({
                    ...prev,
                    teamAId: found.id,
                    teamAName: found.name,
                    teamALogo: found.logoUrl
                  }));
                }
              }}
              className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs font-bold text-white w-full"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <div className="text-5xl font-black text-[#00d2ff] font-mono tracking-tighter">
              {match.scoreA}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => updateScore('A', -1)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-base flex items-center justify-center cursor-pointer active:scale-95 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateScore('A', 1)}
                className="w-10 h-10 rounded-lg bg-[#0066ff] hover:bg-[#0055dd] text-white font-bold text-base flex items-center justify-center cursor-pointer active:scale-95 transition shadow-lg shadow-[#0066ff]/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center: Clock & Halves */}
          <div className="text-center space-y-4">
            <div className="space-y-1">
              <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                Official Match Clock
              </span>
              <div className="text-5xl font-mono font-black text-emerald-400 tracking-widest">
                {String(match.matchMinutes).padStart(2, '0')}:{String(match.matchSeconds).padStart(2, '0')}
              </div>
            </div>

            {/* Start / Pause / Reset Buttons */}
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={toggleTimer}
                className={`px-5 py-2.5 rounded-lg text-xs font-black uppercase tracking-wider text-white shadow-lg flex items-center gap-2 cursor-pointer transition active:scale-95 ${
                  match.isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-700 shadow-amber-600/30'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/30'
                }`}
              >
                {match.isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{match.isTimerRunning ? t('pause_timer') : t('start_timer')}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 cursor-pointer"
                title="Reset to 00:00"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>

            {/* Quick +1 / -1 Minute */}
            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => handleQuickAddMin(-1)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-[11px] font-mono border border-slate-800 cursor-pointer"
              >
                {t('sub_min')}
              </button>
              <button
                onClick={() => handleQuickAddMin(1)}
                className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded text-[11px] font-mono border border-slate-800 cursor-pointer"
              >
                {t('add_min')}
              </button>
            </div>
          </div>

          {/* TEAM B */}
          <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl text-center space-y-3">
            <div className="w-16 h-16 mx-auto rounded-xl bg-slate-950 p-1 flex items-center justify-center border border-slate-700">
              <img src={match.teamBLogo} alt={match.teamBName} className="max-h-full max-w-full object-contain" />
            </div>

            <select
              value={match.teamBId}
              onChange={(e) => {
                const found = teams.find(t => t.id === e.target.value);
                if (found) {
                  setMatch(prev => ({
                    ...prev,
                    teamBId: found.id,
                    teamBName: found.name,
                    teamBLogo: found.logoUrl
                  }));
                }
              }}
              className="bg-slate-950 border border-slate-700 rounded px-2.5 py-1 text-xs font-bold text-white w-full"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            <div className="text-5xl font-black text-[#00d2ff] font-mono tracking-tighter">
              {match.scoreB}
            </div>

            <div className="flex items-center justify-center gap-2 pt-1">
              <button
                onClick={() => updateScore('B', -1)}
                className="w-10 h-10 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-bold text-base flex items-center justify-center cursor-pointer active:scale-95 transition"
              >
                <Minus className="w-4 h-4" />
              </button>
              <button
                onClick={() => updateScore('B', 1)}
                className="w-10 h-10 rounded-lg bg-[#0066ff] hover:bg-[#0055dd] text-white font-bold text-base flex items-center justify-center cursor-pointer active:scale-95 transition shadow-lg shadow-[#0066ff]/30"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Period Selector Tabs */}
        <div className="pt-4 border-t border-slate-800/80">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">
            Match Period (Half)
          </span>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {halves.map(h => (
              <button
                key={h}
                onClick={() => setMatchHalf(h)}
                className={`py-2 rounded-lg text-xs font-bold font-mono transition cursor-pointer ${
                  match.currentHalf === h
                    ? 'bg-[#00d2ff] text-slate-950 font-black shadow-md shadow-[#00d2ff]/30'
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-800'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Extra Time / Manual Setter */}
        <div className="pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Additional Time Stoppage (Minutes)
            </label>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5, 6].map(min => (
                <button
                  key={min}
                  onClick={() => setMatch(prev => ({ ...prev, additionalMinutes: min }))}
                  className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition cursor-pointer ${
                    match.additionalMinutes === min
                      ? 'bg-amber-500 text-black font-black'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  +{min}'
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('aggregate_score')} (Team A - Team B)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={match.score2A || 0}
                onChange={(e) => setMatch(prev => ({ ...prev, score2A: Number(e.target.value) }))}
                className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white text-xs"
              />
              <span className="text-slate-600">-</span>
              <input
                type="number"
                value={match.score2B || 0}
                onChange={(e) => setMatch(prev => ({ ...prev, score2B: Number(e.target.value) }))}
                className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono font-bold text-white text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Manual Clock Override
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min"
                value={customMin}
                onChange={(e) => setCustomMin(Number(e.target.value))}
                className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white text-xs"
              />
              <span className="text-slate-500">:</span>
              <input
                type="number"
                placeholder="Sec"
                value={customSec}
                onChange={(e) => setCustomSec(Number(e.target.value))}
                className="w-16 bg-slate-950 border border-slate-700 rounded px-2 py-1 text-center font-mono text-white text-xs"
              />
              <button
                onClick={handleApplyTime}
                className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded cursor-pointer"
              >
                Set
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
