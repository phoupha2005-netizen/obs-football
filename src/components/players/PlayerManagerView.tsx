import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Player } from '../../types';
import { Users, Plus, Trash2, Edit3, Check, Star } from 'lucide-react';

export const PlayerManagerView: React.FC = () => {
  const { t, players, teams, addPlayer, updatePlayer, deletePlayer } = useApp();

  const [selectedTeamId, setSelectedTeamId] = useState<string>(teams[0]?.id || '');
  const [name, setName] = useState<string>('');
  const [number, setNumber] = useState<number | string>('');
  const [position, setPosition] = useState<Player['position']>('FW');
  const [isStarting, setIsStarting] = useState<boolean>(true);
  const [editingId, setEditingId] = useState<string | null>(null);

  const currentTeam = teams.find(t => t.id === selectedTeamId);
  const filteredPlayers = players.filter(p => p.teamId === selectedTeamId);

  const handleClear = () => {
    setName('');
    setNumber('');
    setPosition('FW');
    setIsStarting(true);
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || number === '') return;

    const payload = {
      teamId: selectedTeamId,
      name,
      number: Number(number),
      position,
      isStarting,
    };

    if (editingId) {
      updatePlayer(editingId, payload);
    } else {
      addPlayer(payload);
    }
    handleClear();
  };

  const startEdit = (p: Player) => {
    setEditingId(p.id);
    setSelectedTeamId(p.teamId);
    setName(p.name);
    setNumber(p.number);
    setPosition(p.position);
    setIsStarting(p.isStarting);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header & Team Filter */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Users className="w-5 h-5 text-[#00d2ff]" />
            <span>{t('player_manager')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage squad rosters, jersey numbers, and starting XI line-ups
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-400">{t('team')}:</span>
          <select
            value={selectedTeamId}
            onChange={(e) => setSelectedTeamId(e.target.value)}
            className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-bold text-white focus:outline-none"
          >
            {teams.map(t => (
              <option key={t.id} value={t.id}>{t.name} ({t.shortName})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Add / Edit Player Form */}
      <form onSubmit={handleSubmit} className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
          {editingId ? 'Edit Player' : t('add_player')} for {currentTeam?.name}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('player_name')}
            </label>
            <input
              type="text"
              placeholder="e.g. Bukayo Saka"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('jersey_number')}
            </label>
            <input
              type="number"
              placeholder="7"
              value={number}
              onChange={(e) => setNumber(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-black text-amber-400 focus:outline-none focus:border-[#00d2ff]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('position')}
            </label>
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value as Player['position'])}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
            >
              <option value="GK">Goalkeeper (GK)</option>
              <option value="DF">Defender (DF)</option>
              <option value="MF">Midfielder (MF)</option>
              <option value="FW">Forward (FW)</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-300">
            <input
              type="checkbox"
              checked={isStarting}
              onChange={(e) => setIsStarting(e.target.checked)}
              className="rounded text-[#0066ff] focus:ring-0 cursor-pointer"
            />
            <span>Starting XI (Active Starter)</span>
          </label>

          <div className="flex items-center gap-2">
            {editingId && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 bg-slate-800 text-slate-300 font-bold text-xs rounded-lg"
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-[#0066ff] to-[#00d2ff] hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#0066ff]/20 cursor-pointer flex items-center gap-1.5"
            >
              {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingId ? 'Update Player' : t('add_player')}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Roster Table */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-5 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            {currentTeam?.name} Squad ({filteredPlayers.length})
          </h3>
          <span className="text-[11px] text-slate-400">
            Starters: {filteredPlayers.filter(p => p.isStarting).length} | Bench: {filteredPlayers.filter(p => !p.isStarting).length}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">#</th>
                <th className="py-3 px-4">{t('player_name')}</th>
                <th className="py-3 px-4">{t('position')}</th>
                <th className="py-3 px-4">Role</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredPlayers.map((player) => (
                <tr key={player.id} className="hover:bg-slate-900/50">
                  <td className="py-3 px-4 font-mono font-black text-amber-400 text-sm">
                    {player.number}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">
                    {player.name}
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-400">
                    <span className="px-2 py-0.5 bg-slate-900 rounded border border-slate-800">
                      {player.position}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {player.isStarting ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        STARTER
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800 text-[10px]">
                        BENCH
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => startEdit(player)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deletePlayer(player.id)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
