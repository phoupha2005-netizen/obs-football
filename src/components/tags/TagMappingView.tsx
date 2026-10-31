import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DEFAULT_TAGS, resolveTags } from '../../services/tagEngine';
import { TagMapping } from '../../types';
import { 
  Tags, 
  Plus, 
  Trash2, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Code2, 
  Send,
  Layers,
  ArrowRight
} from 'lucide-react';

export const TagMappingView: React.FC = () => {
  const { 
    t, 
    match, 
    activeSub, 
    tagMappings, 
    addTagMapping, 
    updateTagMapping, 
    deleteTagMapping, 
    syncTagsToOBS, 
    sources, 
    customLabels, 
    setCustomLabels 
  } = useApp();

  // Test evaluator string
  const [testExpression, setTestExpression] = useState<string>(
    '<escape><PlayerOut> → <PlayerIn></escape> (<Minute>)'
  );

  // New mapping form
  const [newTag, setNewTag] = useState<string>('<PlayerOut>');
  const [newSourcesInput, setNewSourcesInput] = useState<string>('Sub_Player_Out_Text');

  const resolvedPreview = resolveTags(testExpression, match, activeSub, customLabels);

  const handleAddNewMapping = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag || !newSourcesInput) return;

    const sourceNames = newSourcesInput
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    addTagMapping({
      tag: newTag,
      obsSourceNames: sourceNames,
      enabled: true
    });

    setNewSourcesInput('');
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-slate-900/80 p-5 rounded-xl border border-slate-800">
        <div>
          <h2 className="text-lg font-black text-white tracking-wide uppercase flex items-center gap-2">
            <Tags className="w-5 h-5 text-[#00d2ff]" />
            <span>{t('tag_system_title')}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t('tag_description')}
          </p>
        </div>

        <button
          onClick={() => syncTagsToOBS()}
          className="px-4 py-2 bg-gradient-to-r from-[#0066ff] to-[#00d2ff] hover:brightness-110 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-[#0066ff]/20 flex items-center gap-2 cursor-pointer transition"
        >
          <Send className="w-4 h-4" />
          <span>Push All TAGs to OBS Now</span>
        </button>
      </div>

      {/* Live TAG Evaluator Box */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#00d2ff]" />
            <span>{t('test_tag_resolution')}</span>
          </span>
          <span className="text-[10px] text-slate-500 font-mono">
            Evaluates live against active match and player substitution
          </span>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">
              Template Expression
            </label>
            <input
              type="text"
              value={testExpression}
              onChange={(e) => setTestExpression(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-emerald-400 focus:outline-none focus:border-[#00d2ff]"
              placeholder="e.g. <TeamA> vs <TeamB> | <escape><PlayerOut> → <PlayerIn></escape>"
            />
          </div>

          <div className="p-4 bg-slate-950/90 border border-slate-800/80 rounded-lg flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                Resolved OBS Text Output:
              </span>
              <div className="text-base font-black text-white font-sans tracking-wide">
                {resolvedPreview || <span className="text-slate-600">(empty result)</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] px-2 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800 font-mono rounded">
                Live Dynamic
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Grid: TAG Library & Mappings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Available TAG Reference */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {t('available_tags')}
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Click tag to insert</span>
          </div>

          <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
            {DEFAULT_TAGS.map((tagDef) => (
              <div
                key={tagDef.tag}
                onClick={() => setTestExpression(prev => prev + ' ' + tagDef.tag)}
                className="p-2.5 bg-slate-900/70 border border-slate-800 rounded-lg hover:border-[#00d2ff]/40 hover:bg-slate-800/50 transition cursor-pointer flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00d2ff]">
                      {tagDef.tag}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      ({tagDef.label})
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {tagDef.description}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    {tagDef.exampleValue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Active TAG to OBS Mappings */}
        <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 shadow-xl space-y-4">
          <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
              {t('tag_mappings')} ({tagMappings.length})
            </h3>
            <span className="text-[10px] text-slate-500 font-mono">Multi-source binding</span>
          </div>

          {/* Add Mapping Form */}
          <form onSubmit={handleAddNewMapping} className="p-3 bg-slate-950 border border-slate-800 rounded-lg space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase">
              {t('add_mapping')}
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <select
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-[#00d2ff] focus:outline-none"
              >
                {DEFAULT_TAGS.map(td => (
                  <option key={td.tag} value={td.tag}>{td.tag} - {td.label}</option>
                ))}
              </select>

              <input
                type="text"
                placeholder="Target OBS Source (comma-sep)"
                value={newSourcesInput}
                onChange={(e) => setNewSourcesInput(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-1.5 bg-[#0066ff] hover:bg-[#0055dd] text-white text-xs font-bold rounded flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Bind TAG to OBS Sources</span>
            </button>
          </form>

          {/* List of active bindings */}
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
            {tagMappings.map((mapping) => (
              <div
                key={mapping.id}
                className="p-3 bg-slate-900/80 border border-slate-800 rounded-lg flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-[#00d2ff]">
                      {mapping.tag}
                    </span>
                    <ArrowRight className="w-3 h-3 text-slate-600" />
                    <span className="text-xs font-bold text-slate-200">
                      {mapping.obsSourceNames.join(', ')}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 font-mono">
                    Current text: "{resolveTags(mapping.tag, match, activeSub, customLabels)}"
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={mapping.enabled}
                    onChange={(e) => updateTagMapping(mapping.id, { enabled: e.target.checked })}
                    className="rounded text-[#0066ff] cursor-pointer"
                  />
                  <button
                    onClick={() => deleteTagMapping(mapping.id)}
                    className="p-1 hover:text-red-400 text-slate-500 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
