import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { generateBridgeScript, generateBatRunner } from '../../services/localBridgeCode';
import firebaseConfig from '../../../firebase-applet-config.json';
import { 
  Cable, 
  Copy, 
  Check, 
  Download, 
  Terminal, 
  ShieldCheck, 
  AlertCircle, 
  Wifi, 
  Laptop, 
  Cloud 
} from 'lucide-react';

export const LocalBridgeView: React.FC = () => {
  const { t, pairingCode, obsConnected } = useApp();
  const [copied, setCopied] = useState<boolean>(false);

  const scriptCode = generateBridgeScript(
    pairingCode, 
    firebaseConfig.firestoreDatabaseId, 
    firebaseConfig.projectId
  );

  const batCode = generateBatRunner(pairingCode);

  const handleCopyScript = () => {
    navigator.clipboard.writeText(scriptCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadScript = () => {
    const blob = new Blob([scriptCode], { type: 'application/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'obs-bridge.js';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBat = () => {
    const blob = new Blob([batCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'run-bridge-windows.bat';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1424] to-slate-900 rounded-xl p-6 border border-slate-800 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#0066ff]/20 text-[#00d2ff] rounded-xl border border-[#00d2ff]/30">
              <Cable className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                {t('bridge_title')}
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Windows &amp; Cross-Platform Bridge for OBS Studio WebSocket v5
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 ${
              obsConnected 
                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                : 'bg-slate-950 text-amber-400 border border-amber-900/50'
            }`}>
              <Wifi className="w-3.5 h-3.5" />
              <span>{obsConnected ? 'BRIDGE ONLINE' : 'READY FOR PAIRING'}</span>
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
          {t('bridge_desc')}
        </p>
      </div>

      {/* Architecture Visual Diagram */}
      <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
          Connection Architecture
        </span>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center text-xs font-bold">
          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
            <Cloud className="w-5 h-5 text-[#00d2ff]" />
            <span className="text-white">Football Studio Web</span>
            <span className="text-[10px] text-slate-500 font-mono">Vercel / Cloud</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="text-white">Firebase Secure Relay</span>
            <span className="text-[10px] text-slate-500 font-mono">Code: {pairingCode}</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
            <Laptop className="w-5 h-5 text-purple-400" />
            <span className="text-white">Local OBS Bridge</span>
            <span className="text-[10px] text-slate-500 font-mono">Node.js / Windows</span>
          </div>

          <div className="p-3 bg-slate-900 rounded-lg border border-slate-800 flex flex-col items-center gap-1">
            <Cable className="w-5 h-5 text-amber-400" />
            <span className="text-white">OBS Studio</span>
            <span className="text-[10px] text-slate-500 font-mono">WebSocket v5 (4455)</span>
          </div>
        </div>
      </div>

      {/* Pairing Code Card */}
      <div className="p-5 bg-[#0b0f19] border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold text-slate-400">{t('pairing_code')}</span>
          <div className="text-3xl font-black font-mono text-[#00d2ff] tracking-widest mt-1">
            {pairingCode}
          </div>
          <span className="text-[11px] text-slate-500">
            Pass this code via command line: <code>--code={pairingCode}</code>
          </span>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleDownloadBat}
            className="px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00d2ff] hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#0066ff]/20 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>{t('download_bat')}</span>
          </button>

          <button
            onClick={handleDownloadScript}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Download .JS</span>
          </button>
        </div>
      </div>

      {/* Script Source Preview */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-mono font-bold text-slate-300">obs-bridge.js</span>
          </div>

          <button
            onClick={handleCopyScript}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded flex items-center gap-1 cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : t('copy_script')}</span>
          </button>
        </div>

        <pre className="p-4 bg-black/60 font-mono text-[11px] text-slate-400 max-h-80 overflow-y-auto leading-relaxed">
          {scriptCode}
        </pre>
      </div>
    </div>
  );
};
