import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { OBSSource } from '../../types';
import { 
  Video, 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  Eye, 
  EyeOff, 
  Type, 
  Edit3, 
  Terminal, 
  CheckCircle2, 
  AlertTriangle,
  Send,
  Layers,
  ShieldCheck
} from 'lucide-react';

export const OBSSourcesManagerView: React.FC = () => {
  const { 
    t, 
    obsConnected, 
    obsConnecting, 
    obsAddress, 
    setObsAddress, 
    obsPassword, 
    setObsPassword, 
    connectOBS, 
    disconnectOBS, 
    scenes, 
    sources, 
    activeScene, 
    setActiveScene, 
    refreshOBSSources, 
    toggleSourceVisibility, 
    updateOBSTextSource, 
    logs, 
    clearLogs 
  } = useApp();

  const [selectedSource, setSelectedSource] = useState<OBSSource | null>(null);
  const [editTextContent, setEditTextContent] = useState<string>('');
  const [filterType, setFilterType] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  const handleConnect = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionNotice(null);
    const res = await connectOBS(obsAddress, obsPassword);
    if (!res.success) {
      setActionNotice(`Connection failed: ${res.error}`);
    } else {
      setActionNotice('Connected successfully to OBS WebSocket v5!');
    }
  };

  const handleSelectSource = (src: OBSSource) => {
    setSelectedSource(src);
    setEditTextContent('');
  };

  const handleApplyText = async () => {
    if (!selectedSource || !editTextContent) return;
    
    // Strict safety check on UI level as well
    if (!selectedSource.isTextSource) {
      setActionNotice(`Safety Check: Cannot send text to "${selectedSource.sourceType}". Only Text sources allowed.`);
      return;
    }

    await updateOBSTextSource(selectedSource.sourceName, editTextContent);
    setActionNotice(`Updated text on "${selectedSource.sourceName}"`);
  };

  const filteredSources = sources.filter(s => {
    if (filterType === 'text') return s.isTextSource;
    if (filterType === 'visible') return s.sceneItemEnabled;
    return true;
  });

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header & Connection Bar */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
              <Video className="w-5 h-5 text-[#00d2ff]" />
              <span>{t('obs_manager')}</span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Direct OBS WebSocket v5 Scene &amp; Source Controller with Type Safety
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold border ${
              obsConnected 
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400' 
                : 'bg-slate-950 border-slate-800 text-slate-400'
            }`}>
              {obsConnected ? <Wifi className="w-4 h-4 text-emerald-400" /> : <WifiOff className="w-4 h-4" />}
              <span>{obsConnected ? 'CONNECTED (v5)' : 'NOT CONNECTED'}</span>
            </span>
          </div>
        </div>

        {/* Connection Form */}
        <form onSubmit={handleConnect} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-800/80">
          <div className="sm:col-span-2">
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              {t('obs_url')}
            </label>
            <input
              type="text"
              value={obsAddress}
              onChange={(e) => setObsAddress(e.target.value)}
              placeholder="ws://127.0.0.1:4455"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-[#00d2ff]"
              disabled={obsConnected}
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
              {t('obs_password')}
            </label>
            <input
              type="password"
              value={obsPassword}
              onChange={(e) => setObsPassword(e.target.value)}
              placeholder="Optional password"
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
              disabled={obsConnected}
            />
          </div>

          <div className="flex items-end gap-2">
            {obsConnected ? (
              <button
                type="button"
                onClick={disconnectOBS}
                className="w-full py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition"
              >
                {t('disconnect_btn')}
              </button>
            ) : (
              <button
                type="submit"
                disabled={obsConnecting}
                className="w-full py-2 bg-gradient-to-r from-[#0066ff] to-[#00d2ff] hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg cursor-pointer transition disabled:opacity-50"
              >
                {obsConnecting ? t('connecting') : t('connect_btn')}
              </button>
            )}
          </div>
        </form>

        {actionNotice && (
          <div className="p-2.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-[#00d2ff] flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#00d2ff]" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* Main Sources & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Scenes and Sources Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-xl">
            {/* Scene Selector & Refresh Toolbar */}
            <div className="p-3.5 bg-slate-950 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Scene:</span>
                <select
                  value={activeScene}
                  onChange={(e) => setActiveScene(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-bold text-white focus:outline-none"
                >
                  {scenes.map(sc => (
                    <option key={sc.sceneName} value={sc.sceneName}>{sc.sceneName}</option>
                  ))}
                  {scenes.length === 0 && <option value="">No Scenes Discovered</option>}
                </select>
              </div>

              <div className="flex items-center gap-2">
                {/* Filter */}
                <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[11px]">
                  <button
                    onClick={() => setFilterType('all')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${filterType === 'all' ? 'bg-[#0066ff] text-white font-bold' : 'text-slate-400'}`}
                  >
                    All ({sources.length})
                  </button>
                  <button
                    onClick={() => setFilterType('text')}
                    className={`px-2 py-0.5 rounded cursor-pointer ${filterType === 'text' ? 'bg-[#0066ff] text-white font-bold' : 'text-slate-400'}`}
                  >
                    Text Only
                  </button>
                </div>

                <button
                  onClick={refreshOBSSources}
                  className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-[#00d2ff]" />
                  <span>{t('refresh_sources')}</span>
                </button>
              </div>
            </div>

            {/* Sources List */}
            {sources.length === 0 ? (
              <div className="py-16 text-center text-xs text-slate-500 space-y-2">
                <div>No sources loaded from active scene.</div>
                <div className="text-[11px] text-slate-600">
                  Connect to OBS or run the Local OBS Bridge on your streaming PC.
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono text-[10px] tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Visibility</th>
                      <th className="py-3 px-4">Source Name</th>
                      <th className="py-3 px-4">Type / Kind</th>
                      <th className="py-3 px-4">Text Safe?</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredSources.map((src) => {
                      const isSelected = selectedSource?.sceneItemId === src.sceneItemId;

                      return (
                        <tr
                          key={src.sceneItemId}
                          onClick={() => handleSelectSource(src)}
                          className={`hover:bg-slate-900/50 cursor-pointer transition ${
                            isSelected ? 'bg-[#00d2ff]/10 border-l-4 border-[#00d2ff]' : ''
                          }`}
                        >
                          <td className="py-3 px-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleSourceVisibility(src.sceneName, src.sceneItemId, !src.sceneItemEnabled);
                              }}
                              className={`p-1.5 rounded transition ${
                                src.sceneItemEnabled
                                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                  : 'bg-slate-900 text-slate-600 border border-slate-800 hover:text-slate-400'
                              }`}
                              title="Toggle Visibility in OBS"
                            >
                              {src.sceneItemEnabled ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                          </td>

                          <td className="py-3 px-4 font-bold text-slate-200">
                            {src.sourceName}
                          </td>

                          <td className="py-3 px-4 font-mono text-[11px] text-slate-400">
                            {src.sourceType}
                          </td>

                          <td className="py-3 px-4">
                            {src.isTextSource ? (
                              <span className="px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-mono font-bold">
                                YES (Text)
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800 text-[10px] font-mono">
                                Media/Other
                              </span>
                            )}
                          </td>

                          <td className="py-3 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSelectSource(src);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded text-[11px]"
                            >
                              Inspect
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
        </div>

        {/* Right Col: Source Inspector & Command Log */}
        <div className="space-y-4">
          {/* Source Inspector Panel */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                Source Inspector
              </h3>
              {selectedSource && (
                <span className="text-[10px] font-mono text-slate-500">
                  ID: {selectedSource.sceneItemId}
                </span>
              )}
            </div>

            {!selectedSource ? (
              <div className="py-8 text-center text-xs text-slate-500">
                Click a source on the left to edit properties or send text.
              </div>
            ) : (
              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-500 text-[11px]">Selected Source:</span>
                  <div className="font-extrabold text-sm text-white mt-0.5">{selectedSource.sourceName}</div>
                  <div className="text-[10px] font-mono text-slate-400">Kind: {selectedSource.sourceType}</div>
                </div>

                {/* Text Source Safety Gate */}
                {selectedSource.isTextSource ? (
                  <div className="space-y-2 pt-2 border-t border-slate-800">
                    <label className="block text-[11px] font-bold text-slate-300 uppercase flex items-center justify-between">
                      <span>{t('edit_text')}</span>
                      <span className="text-[9px] text-emerald-400">Verified Text Input</span>
                    </label>
                    <textarea
                      rows={3}
                      value={editTextContent}
                      onChange={(e) => setEditTextContent(e.target.value)}
                      placeholder="Type text to display in OBS source..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00d2ff]"
                    />
                    <button
                      onClick={handleApplyText}
                      className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg flex items-center justify-center gap-1.5 cursor-pointer shadow"
                    >
                      <Send className="w-3.5 h-3.5" />
                      <span>Send to OBS Source</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-950 border border-slate-800 rounded-lg text-slate-400 text-[11px] space-y-1">
                    <div className="text-amber-400 font-bold flex items-center gap-1">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>Non-Text Source</span>
                    </div>
                    <p>{t('safety_text_warning')}</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Real-time OBS Console Log */}
          <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-3.5 h-3.5 text-[#00d2ff]" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
                  {t('console_log')}
                </h3>
              </div>
              <button
                onClick={clearLogs}
                className="text-[10px] text-slate-500 hover:text-slate-300"
              >
                Clear
              </button>
            </div>

            <div className="space-y-1 max-h-52 overflow-y-auto font-mono text-[10px] text-slate-400">
              {logs.map(log => (
                <div key={log.id} className="leading-tight">
                  <span className="text-slate-600">[{log.timestamp}]</span>{' '}
                  <span className={
                    log.type === 'error' ? 'text-red-400' :
                    log.type === 'obs' ? 'text-[#00d2ff]' :
                    log.type === 'sub' ? 'text-emerald-400' : 'text-slate-300'
                  }>
                    {log.message}
                  </span>
                </div>
              ))}
              {logs.length === 0 && (
                <div className="text-slate-600 text-center py-4">No events logged yet.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
