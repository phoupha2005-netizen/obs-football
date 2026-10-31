import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Team } from '../../types';
import { Shield, Plus, Trash2, Edit3, Check, Globe } from 'lucide-react';

export const TeamManagerView: React.FC = () => {
  const { t, teams, addTeam, updateTeam, deleteTeam, players } = useApp();

  const [name, setName] = useState<string>('');
  const [shortName, setShortName] = useState<string>('');
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [primaryColor, setPrimaryColor] = useState<string>('#0066ff');
  const [secondaryColor, setSecondaryColor] = useState<string>('#ffffff');
  const [coach, setCoach] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleClear = () => {
    setName('');
    setShortName('');
    setLogoUrl('');
    setPrimaryColor('#0066ff');
    setSecondaryColor('#ffffff');
    setCoach('');
    setEditingId(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !shortName) return;

    const payload = {
      name,
      shortName: shortName.toUpperCase(),
      logoUrl: logoUrl || 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=128&auto=format&fit=crop&q=80',
      primaryColor,
      secondaryColor,
      coach: coach || 'Head Coach'
    };

    if (editingId) {
      updateTeam(editingId, payload);
    } else {
      addTeam(payload);
    }
    handleClear();
  };

  const startEdit = (team: Team) => {
    setEditingId(team.id);
    setName(team.name);
    setShortName(team.shortName);
    setLogoUrl(team.logoUrl);
    setPrimaryColor(team.primaryColor);
    setSecondaryColor(team.secondaryColor);
    setCoach(team.coach);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#00d2ff]" />
            <span>{t('team_manager')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure club branding, crests, jersey colors, and coaches
          </p>
        </div>
      </div>

      {/* Add / Edit Team Form */}
      <form onSubmit={handleSubmit} className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
          {editingId ? 'Edit Team Profile' : t('add_team')}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('team_name')}
            </label>
            <input
              type="text"
              placeholder="e.g. Arsenal FC"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('short_code')}
            </label>
            <input
              type="text"
              placeholder="ARS"
              maxLength={6}
              value={shortName}
              onChange={(e) => setShortName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-white focus:outline-none focus:border-[#00d2ff]"
              required
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              {t('coach_name')}
            </label>
            <input
              type="text"
              placeholder="e.g. Mikel Arteta"
              value={coach}
              onChange={(e) => setCoach(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff]"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Logo / Crest Image URL
            </label>
            <input
              type="url"
              placeholder="https://..."
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Primary Jersey Color
            </label>
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg p-1.5">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-7 h-7 rounded cursor-pointer bg-transparent border-0"
              />
              <span className="font-mono text-xs text-slate-300">{primaryColor}</span>
            </div>
          </div>

          <div className="flex items-end justify-end gap-2">
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
              className="px-6 py-2.5 bg-gradient-to-r from-[#0066ff] to-[#00d2ff] hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#0066ff]/20 cursor-pointer flex items-center gap-1.5"
            >
              {editingId ? <Check className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
              <span>{editingId ? 'Save Changes' : t('add_team')}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Teams Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {teams.map((team) => {
          const squadCount = players.filter(p => p.teamId === team.id).length;

          return (
            <div
              key={team.id}
              className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 shadow-lg hover:border-slate-700 transition flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-slate-400 font-mono tracking-wider">
                    {team.shortName}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startEdit(team)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => deleteTeam(team.id)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-950 p-1 flex items-center justify-center border border-slate-800 overflow-hidden">
                    <img src={team.logoUrl} alt={team.name} className="max-h-full max-w-full object-contain" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-white leading-tight">{team.name}</h4>
                    <span className="text-[11px] text-slate-400 font-medium">Coach: {team.coach}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 mt-3 flex items-center justify-between text-xs text-slate-400 font-mono">
                <span>Squad: {squadCount} Players</span>
                <div className="w-3 h-3 rounded-full border border-black" style={{ backgroundColor: team.primaryColor }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
