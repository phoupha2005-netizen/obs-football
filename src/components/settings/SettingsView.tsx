import React from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Sliders, 
  Globe, 
  Volume2, 
  VolumeX, 
  Clock, 
  ShieldCheck, 
  Database, 
  Wifi,
  ExternalLink 
} from 'lucide-react';
import firebaseConfig from '../../../firebase-applet-config.json';

export const SettingsView: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage, 
    autoHideSeconds, 
    setAutoHideSeconds, 
    audioTallyEnabled, 
    setAudioTallyEnabled, 
    role, 
    setRole, 
    obsAddress, 
    setObsAddress,
    pairingCode,
    user
  } = useApp();

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
          <Sliders className="w-5 h-5 text-[#00d2ff]" />
          <span>{t('settings')}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Broadcast preferences, language localization, auto-hide timings, and database credentials
        </p>
      </div>

      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl divide-y divide-slate-800/80 shadow-xl">
        {/* Language Selection */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-slate-200 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#00d2ff]" />
              <span>{t('language_select')}</span>
            </span>
            <p className="text-xs text-slate-400">
              Select interface language: English, ภาษาไทย, or ພາສາລາວ
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLanguage('en')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                language === 'en'
                  ? 'bg-[#0066ff] text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('th')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                language === 'th'
                  ? 'bg-[#0066ff] text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ภาษาไทย (TH)
            </button>
            <button
              onClick={() => setLanguage('la')}
              className={`px-4 py-2 rounded-lg font-bold text-xs transition cursor-pointer ${
                language === 'la'
                  ? 'bg-[#0066ff] text-white shadow'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              ພາສາລາວ (LA)
            </button>
          </div>
        </div>

        {/* Lower Third Auto-Hide Timing */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-slate-200 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <span>{t('auto_hide_seconds')}</span>
            </span>
            <p className="text-xs text-slate-400">
              Duration the substitution banner stays on air before automatically hiding.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {[0, 5, 8, 10, 15].map((sec) => (
              <button
                key={sec}
                onClick={() => setAutoHideSeconds(sec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                  autoHideSeconds === sec
                    ? 'bg-[#00d2ff] text-slate-950 font-black'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {sec === 0 ? 'Manual' : `${sec}s`}
              </button>
            ))}
          </div>
        </div>

        {/* Audio Tally */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-slate-200 flex items-center gap-2">
              {audioTallyEnabled ? (
                <Volume2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <VolumeX className="w-4 h-4 text-slate-500" />
              )}
              <span>{t('audio_tally')}</span>
            </span>
            <p className="text-xs text-slate-400">
              Plays an audio tone alert when lower third is placed on air or off air.
            </p>
          </div>

          <button
            onClick={() => setAudioTallyEnabled(!audioTallyEnabled)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
              audioTallyEnabled
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                : 'bg-slate-900 text-slate-500 border border-slate-800'
            }`}
          >
            {audioTallyEnabled ? 'ENABLED' : 'MUTED'}
          </button>
        </div>

        {/* User Role */}
        <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <span className="text-xs font-black uppercase text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>{t('role')}</span>
            </span>
            <p className="text-xs text-slate-400">
              Current account authorization level: Operator (Controls) or Admin (Full DB &amp; Settings).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setRole('operator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                role === 'operator'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Operator
            </button>
            <button
              onClick={() => setRole('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                role === 'admin'
                  ? 'bg-purple-600 text-white'
                  : 'bg-slate-900 text-slate-400 border border-slate-800'
              }`}
            >
              Administrator
            </button>
          </div>
        </div>

        {/* Database & Firebase Info */}
        <div className="p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase text-slate-200 flex items-center gap-2">
              <Database className="w-4 h-4 text-[#00d2ff]" />
              <span>Firebase Database Status</span>
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono">
              ONLINE
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Project ID</span>
              <span className="text-slate-300 font-bold">{firebaseConfig.projectId}</span>
            </div>

            <div className="p-3 bg-slate-950 rounded border border-slate-800">
              <span className="text-[10px] text-slate-500 uppercase block">Firestore Database ID</span>
              <span className="text-slate-300 font-bold truncate block">{firebaseConfig.firestoreDatabaseId}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
