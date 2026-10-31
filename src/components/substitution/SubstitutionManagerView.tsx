import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Substitution, SubstitutionType } from '../../types';
import { 
  Play, 
  Square, 
  Plus, 
  Check, 
  Trash2, 
  RotateCcw, 
  Edit3, 
  ArrowRightLeft,
  Clock,
  Layers,
  History,
  AlertCircle
} from 'lucide-react';

export const SubstitutionManagerView: React.FC = () => {
  const { 
    t, 
    match, 
    teams, 
    players, 
    substitutions, 
    activeSub, 
    onAir, 
    addSubstitution, 
    updateSubstitution, 
    deleteSubstitution, 
    clearSubstitutions, 
    showOnAir, 
    hideFromAir 
  } = useApp();

  // Form State
  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [playerOutName, setPlayerOutName] = useState<string>('');
  const [playerOutNumber, setPlayerOutNumber] = useState<number | string>('');
  const [playerInName, setPlayerInName] = useState<string>('');
  const [playerInNumber, setPlayerInNumber] = useState<number | string>('');
  const [subMinute, setSubMinute] = useState<number>(match.matchMinutes || 68);
  const [additionalTime, setAdditionalTime] = useState<string>('');
  const [subType, setSubType] = useState<SubstitutionType>('tactical');
  
  // Edit mode
  const [editingId, setEditingId] = useState<string | null>(null);

  // Filter players for currently selected team
  const currentTeamPlayers = players.filter(p => p.teamId === selectedTeamId);
  const startingPlayers = currentTeamPlayers.filter(p => p.isStarting);
  const benchPlayers = currentTeamPlayers.filter(p => !p.isStarting);

  // Quick Select from squad
  const handleSelectPlayerOut = (playerId: string) => {
    const p = players.find(x => x.id === playerId);
    if (p) {
      setPlayerOutName(p.name);
      setPlayerOutNumber(p.number);
    }
  };

  const handleSelectPlayerIn = (playerId: string) => {
    const p = players.find(x => x.id === playerId);
    if (p) {
      setPlayerInName(p.name);
      setPlayerInNumber(p.number);
    }
  };

  const handleClearForm = () => {
    setPlayerOutName('');
    setPlayerOutNumber('');
    setPlayerInName('');
    setPlayerInNumber('');
    setAdditionalTime('');
    setSubMinute(match.matchMinutes);
    setEditingId(null);
  };

  const handleAddOrUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!playerOutName || !playerInName) return;

    const selectedTeam = teams.find(t => t.id === selectedTeamId);

    const payload: Partial<Substitution> = {
      teamId: selectedTeamId,
      teamName: selectedTeam?.name || 'Football Club',
      playerOutName,
      playerOutNumber: Number(playerOutNumber) || 0,
      playerInName,
      playerInNumber: Number(playerInNumber) || 0,
      minute: Number(subMinute) || match.matchMinutes,
      additionalTime,
      subType,
    };

    if (editingId) {
      updateSubstitution(editingId, payload);
      setEditingId(null);
    } else {
      addSubstitution(payload);
    }

    handleClearForm();
  };

  const startEdit = (sub: Substitution) => {
    setEditingId(sub.id);
    setSelectedTeamId(sub.teamId);
    setPlayerOutName(sub.playerOutName);
    setPlayerOutNumber(sub.playerOutNumber);
    setPlayerInName(sub.playerInName);
    setPlayerInNumber(sub.playerInNumber);
    setSubMinute(sub.minute);
    setAdditionalTime(sub.additionalTime || '');
    setSubType(sub.subType);
  };

  const queuedSubs = substitutions.filter(s => s.status === 'queued' || s.status === 'on_air');
  const historySubs = substitutions.filter(s => s.status === 'completed');

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Global Air Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
            <ArrowRightLeft className="w-5 h-5 text-[#00d2ff]" />
            <span>{t('sub_manager')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Queue and control on-air football lower thirds with direct OBS sync
          </p>
        </div>

        <div className="flex items-center gap-3">
          {onAir ? (
            <button
              onClick={() => hideFromAir()}
              className="px-5 py-2.5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-red-600/30 flex items-center gap-2 cursor-pointer transition"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>{t('hide_on_obs')}</span>
            </button>
          ) : (
            <button
              onClick={() => showOnAir()}
              className="px-5 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-emerald-600/30 flex items-center gap-2 cursor-pointer transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{t('show_on_obs')}</span>
            </button>
          )}

          <button
            onClick={clearSubstitutions}
            className="px-3 py-2.5 bg-slate-800 hover:bg-red-950 text-slate-300 hover:text-red-400 font-bold text-xs rounded-lg border border-slate-700 cursor-pointer transition"
            title="Clear all queue items"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Substitution Input Form */}
      <form onSubmit={handleAddOrUpdate} className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <span>{editingId ? t('update_substitution') : t('add_substitution')}</span>
            {editingId && (
              <span className="px-2 py-0.5 bg-amber-500/20 text-amber-400 rounded text-[10px]">
                Editing Mode
              </span>
            )}
          </h3>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSubMinute(match.matchMinutes)}
              className="text-[11px] font-mono text-[#00d2ff] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Use Current Clock ({match.matchMinutes}')</span>
            </button>
          </div>
        </div>

        {/* Row 1: Team & Minute & Type */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('team')}
            </label>
            <select
              value={selectedTeamId}
              onChange={(e) => setSelectedTeamId(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
            >
              {teams.map(t => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.shortName})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('sub_minute')}
            </label>
            <input
              type="number"
              min="0"
              max="130"
              value={subMinute}
              onChange={(e) => setSubMinute(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('additional_time')}
            </label>
            <input
              type="text"
              placeholder="+3"
              value={additionalTime}
              onChange={(e) => setAdditionalTime(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('sub_type')}
            </label>
            <select
              value={subType}
              onChange={(e) => setSubType(e.target.value as SubstitutionType)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
            >
              <option value="tactical">{t('tactical')}</option>
              <option value="injury">{t('injury')}</option>
              <option value="double">{t('double')}</option>
              <option value="emergency">{t('emergency')}</option>
            </select>
          </div>
        </div>

        {/* Row 2: Player OUT (Red) and Player IN (Green) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
          {/* PLAYER OUT */}
          <div className="p-4 bg-red-950/20 border border-red-900/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-red-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>▼ {t('player_out')}</span>
              </span>

              {/* Roster Quick Selector */}
              {startingPlayers.length > 0 && (
                <select
                  onChange={(e) => handleSelectPlayerOut(e.target.value)}
                  defaultValue=""
                  className="bg-slate-900 border border-red-900/60 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                >
                  <option value="" disabled>Quick pick starter...</option>
                  {startingPlayers.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.name} ({p.position})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {t('number_out')}
                </label>
                <input
                  type="number"
                  placeholder="7"
                  value={playerOutNumber}
                  onChange={(e) => setPlayerOutNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-red-900/60 rounded-lg px-3 py-2 text-sm font-black text-red-400 focus:outline-none focus:border-red-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {t('player_name')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bukayo Saka"
                  value={playerOutName}
                  onChange={(e) => setPlayerOutName(e.target.value)}
                  className="w-full bg-slate-900 border border-red-900/60 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-red-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* PLAYER IN */}
          <div className="p-4 bg-emerald-950/20 border border-emerald-900/40 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span>▲ {t('player_in')}</span>
              </span>

              {/* Bench Quick Selector */}
              {benchPlayers.length > 0 && (
                <select
                  onChange={(e) => handleSelectPlayerIn(e.target.value)}
                  defaultValue=""
                  className="bg-slate-900 border border-emerald-900/60 rounded px-2 py-1 text-[11px] text-slate-300 focus:outline-none"
                >
                  <option value="" disabled>Quick pick bench...</option>
                  {benchPlayers.map(p => (
                    <option key={p.id} value={p.id}>
                      #{p.number} {p.name} ({p.position})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-1">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {t('number_in')}
                </label>
                <input
                  type="number"
                  placeholder="11"
                  value={playerInNumber}
                  onChange={(e) => setPlayerInNumber(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-900/60 rounded-lg px-3 py-2 text-sm font-black text-emerald-400 focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div className="col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {t('player_name')}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Gabriel Martinelli"
                  value={playerInName}
                  onChange={(e) => setPlayerInName(e.target.value)}
                  className="w-full bg-slate-900 border border-emerald-900/60 rounded-lg px-3 py-2 text-sm font-bold text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button Row */}
        <div className="flex items-center justify-end gap-3 pt-2">
          {editingId && (
            <button
              type="button"
              onClick={handleClearForm}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-lg cursor-pointer"
            >
              Cancel Edit
            </button>
          )}

          <button
            type="button"
            onClick={handleClearForm}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-400 font-bold text-xs rounded-lg border border-slate-800 cursor-pointer"
          >
            {t('clear_btn')}
          </button>

          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-[#0066ff] to-[#00d2ff] hover:brightness-110 active:scale-95 text-white font-extrabold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#0066ff]/30 cursor-pointer transition flex items-center gap-1.5"
          >
            {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
            <span>{editingId ? t('update_btn') : t('add_substitution')}</span>
          </button>
        </div>
      </form>

      {/* Substitution Queue Table */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-3.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-[#00d2ff]" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {t('sub_queue')} ({queuedSubs.length})
            </h3>
          </div>
          <span className="text-[11px] text-slate-400">
            Click SHOW to transmit lower third to OBS Studio
          </span>
        </div>

        {queuedSubs.length === 0 ? (
          <div className="py-12 text-center text-slate-500 text-xs">
            {t('no_subs_in_queue')}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Min</th>
                  <th className="py-3 px-4">{t('team')}</th>
                  <th className="py-3 px-4">{t('player_out')}</th>
                  <th className="py-3 px-4">{t('player_in')}</th>
                  <th className="py-3 px-4">{t('sub_type')}</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {queuedSubs.map((sub) => {
                  const isActive = activeSub?.id === sub.id && onAir;

                  return (
                    <tr
                      key={sub.id}
                      className={`hover:bg-slate-900/50 transition ${
                        isActive ? 'bg-[#00d2ff]/10 border-l-4 border-[#00d2ff]' : ''
                      }`}
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-400">
                        {sub.minute}' {sub.additionalTime ? `(+${sub.additionalTime})` : ''}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-white">
                        {sub.teamName}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-red-400">
                        ▼ #{sub.playerOutNumber} {sub.playerOutName}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-emerald-400">
                        ▲ #{sub.playerInNumber} {sub.playerInName}
                      </td>
                      <td className="py-3.5 px-4 text-slate-400 uppercase font-mono text-[11px]">
                        {sub.subType}
                      </td>
                      <td className="py-3.5 px-4">
                        {isActive ? (
                          <span className="px-2 py-0.5 rounded bg-red-600 text-white font-black text-[10px] animate-pulse">
                            ON AIR
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-400 text-[10px] font-semibold">
                            QUEUED
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4 text-right space-x-1.5">
                        {isActive ? (
                          <button
                            onClick={() => hideFromAir()}
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white font-bold rounded cursor-pointer transition text-[11px]"
                          >
                            HIDE
                          </button>
                        ) : (
                          <button
                            onClick={() => showOnAir(sub.id)}
                            className="px-3 py-1 bg-[#0066ff] hover:bg-[#0055dd] text-white font-bold rounded cursor-pointer transition text-[11px]"
                          >
                            SHOW
                          </button>
                        )}

                        <button
                          onClick={() => startEdit(sub)}
                          className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer transition"
                          title="Edit"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => deleteSubstitution(sub.id)}
                          className="p-1.5 bg-slate-800 hover:bg-red-950 text-slate-400 hover:text-red-400 rounded cursor-pointer transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* History Table */}
      {historySubs.length > 0 && (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center gap-2">
            <History className="w-4 h-4 text-slate-400" />
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-400">
              {t('sub_history')} ({historySubs.length})
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs opacity-70 hover:opacity-100 transition">
              <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-4">Min</th>
                  <th className="py-2.5 px-4">{t('team')}</th>
                  <th className="py-2.5 px-4">{t('player_out')}</th>
                  <th className="py-2.5 px-4">{t('player_in')}</th>
                  <th className="py-2.5 px-4 text-right">Recall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {historySubs.map((sub) => (
                  <tr key={sub.id} className="hover:bg-slate-900/40">
                    <td className="py-2.5 px-4 font-mono text-amber-400">{sub.minute}'</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-300">{sub.teamName}</td>
                    <td className="py-2.5 px-4 text-red-400">#{sub.playerOutNumber} {sub.playerOutName}</td>
                    <td className="py-2.5 px-4 text-emerald-400">#{sub.playerInNumber} {sub.playerInName}</td>
                    <td className="py-2.5 px-4 text-right">
                      <button
                        onClick={() => showOnAir(sub.id)}
                        className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-[10px] font-bold rounded cursor-pointer"
                      >
                        Re-air
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
