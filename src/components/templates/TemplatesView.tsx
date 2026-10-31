import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LowerThirdTemplate } from '../../types';
import { PRESET_TEMPLATES } from '../../services/defaultTemplates';
import { LayoutTemplate, Check, Download, Upload, Trash2, Layers, Sparkles } from 'lucide-react';

export const TemplatesView: React.FC<{ onNavigateToDesigner: () => void }> = ({ onNavigateToDesigner }) => {
  const { t, templates, activeTemplate, setActiveTemplate, saveTemplate, deleteTemplate } = useApp();
  const [importJson, setImportJson] = useState<string>('');
  const [showImport, setShowImport] = useState<boolean>(false);

  const handleExport = (tpl: LowerThirdTemplate) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(tpl, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${tpl.name.toLowerCase().replace(/\s+/g, '-')}-template.json`);
    downloadAnchor.click();
  };

  const handleImport = () => {
    try {
      const parsed = JSON.parse(importJson);
      if (parsed.name && parsed.elements) {
        const imported: LowerThirdTemplate = {
          ...parsed,
          id: `tpl-${Date.now()}`
        };
        saveTemplate(imported);
        setShowImport(false);
        setImportJson('');
      }
    } catch (e) {
      alert('Invalid JSON template file.');
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#00d2ff]" />
            <span>{t('templates')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Broadcast Lower Third presets, styling libraries, and custom JSON templates
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowImport(!showImport)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-lg border border-slate-700 flex items-center gap-1.5 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Import JSON</span>
          </button>
        </div>
      </div>

      {showImport && (
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-4 space-y-3">
          <span className="text-xs font-bold text-slate-300">Paste Template JSON:</span>
          <textarea
            rows={5}
            value={importJson}
            onChange={(e) => setImportJson(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-xs font-mono text-white focus:outline-none focus:border-[#00d2ff]"
            placeholder='{ "name": "My Template", "resolution": "1920x1080", "elements": [...] }'
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={() => setShowImport(false)}
              className="px-3 py-1.5 bg-slate-800 text-slate-300 text-xs font-bold rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-4 py-1.5 bg-[#0066ff] text-white text-xs font-bold rounded"
            >
              Load into Studio
            </button>
          </div>
        </div>
      )}

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((tpl) => {
          const isActive = activeTemplate.id === tpl.id;

          return (
            <div
              key={tpl.id}
              className={`bg-[#0b0f19] border rounded-xl p-5 flex flex-col justify-between space-y-4 shadow-xl transition ${
                isActive ? 'border-[#00d2ff] ring-1 ring-[#00d2ff]/40 shadow-[#00d2ff]/10' : 'border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                    {tpl.resolution}
                  </span>
                  {isActive && (
                    <span className="px-2 py-0.5 bg-[#00d2ff]/20 text-[#00d2ff] rounded text-[10px] font-bold flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      <span>ACTIVE ON AIR</span>
                    </span>
                  )}
                </div>

                <div>
                  <h3 className="text-base font-extrabold text-white leading-tight">{tpl.name}</h3>
                  <span className="text-xs text-slate-400 mt-1 block">
                    {tpl.elements.length} Graphic Layers &amp; Animations
                  </span>
                </div>

                {/* Layer pills */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {tpl.elements.slice(0, 4).map(el => (
                    <span key={el.id} className="text-[10px] px-2 py-0.5 rounded bg-slate-900 text-slate-400 font-mono">
                      {el.name}
                    </span>
                  ))}
                  {tpl.elements.length > 4 && (
                    <span className="text-[10px] text-slate-600 font-mono">
                      +{tpl.elements.length - 4} more
                    </span>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setActiveTemplate(tpl)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-slate-800 text-slate-400 cursor-default'
                      : 'bg-[#0066ff] hover:bg-[#0055dd] text-white shadow'
                  }`}
                >
                  {isActive ? 'Current' : 'Select'}
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      setActiveTemplate(tpl);
                      onNavigateToDesigner();
                    }}
                    className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded cursor-pointer"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleExport(tpl)}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-white"
                    title="Export JSON"
                  >
                    <Download className="w-4 h-4" />
                  </button>
                  {!tpl.isDefault && (
                    <button
                      onClick={() => deleteTemplate(tpl.id)}
                      className="p-1.5 hover:bg-slate-800 rounded text-slate-400 hover:text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
