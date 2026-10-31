import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LowerThirdTemplate, LayerElement, LayerType } from '../../types';
import { LiveLowerThirdPreview } from '../preview/LiveLowerThirdPreview';
import { PRESET_TEMPLATES } from '../../services/defaultTemplates';
import {
  Layers,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Trash2,
  Save,
  FolderOpen,
  Play,
  RotateCcw,
  Move,
  Type,
  Palette,
  Sparkles,
  Maximize2,
  ZoomIn,
  ZoomOut
} from 'lucide-react';

export const LowerThirdDesigner: React.FC = () => {
  const { 
    t, 
    match, 
    activeSub, 
    templates, 
    activeTemplate, 
    setActiveTemplate, 
    saveTemplate, 
    deleteTemplate,
    customLabels
  } = useApp();

  // Active working template in editor
  const [currentTpl, setCurrentTpl] = useState<LowerThirdTemplate>(activeTemplate);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(
    currentTpl.elements[0]?.id || null
  );
  const [canvasZoom, setCanvasZoom] = useState<number>(0.55);
  const [showGrid, setShowGrid] = useState<boolean>(true);
  const [previewAnimKey, setPreviewAnimKey] = useState<number>(0);

  const selectedLayer = currentTpl.elements.find(el => el.id === selectedLayerId) || null;

  // Update selected layer property
  const updateSelectedStyle = (updates: Partial<LayerElement['style']>) => {
    if (!selectedLayerId) return;
    setCurrentTpl(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === selectedLayerId ? { ...el, style: { ...el.style, ...updates } } : el
      )
    }));
  };

  const updateSelectedContent = (content: string) => {
    if (!selectedLayerId) return;
    setCurrentTpl(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === selectedLayerId ? { ...el, content } : el
      )
    }));
  };

  const handleToggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTpl(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, style: { ...el.style, visible: !el.style.visible } } : el
      )
    }));
  };

  const handleToggleLock = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentTpl(prev => ({
      ...prev,
      elements: prev.elements.map(el => 
        el.id === id ? { ...el, style: { ...el.style, locked: !el.style.locked } } : el
      )
    }));
  };

  const handleAddLayer = (type: LayerType) => {
    const newId = `layer-${Date.now()}`;
    const newLayer: LayerElement = {
      id: newId,
      name: `New ${type}`,
      type,
      content: type === 'customText' ? 'CUSTOM BROADCAST TEXT' : `<${type}>`,
      style: {
        x: 120,
        y: 850,
        width: 300,
        height: 50,
        color: '#ffffff',
        backgroundColor: '#0066ff',
        fontSize: 18,
        fontFamily: 'Inter, sans-serif',
        fontWeight: 'bold',
        textAlign: 'left',
        borderWidth: 0,
        borderColor: 'transparent',
        borderRadius: 6,
        boxShadow: 'none',
        opacity: 1,
        zIndex: currentTpl.elements.length + 1,
        animation: 'slide-left',
        animationDuration: 0.5,
        visible: true,
        locked: false
      }
    };

    setCurrentTpl(prev => ({
      ...prev,
      elements: [...prev.elements, newLayer]
    }));
    setSelectedLayerId(newId);
  };

  const handleDeleteLayer = (id: string) => {
    setCurrentTpl(prev => ({
      ...prev,
      elements: prev.elements.filter(el => el.id !== id)
    }));
    if (selectedLayerId === id) {
      setSelectedLayerId(currentTpl.elements[0]?.id || null);
    }
  };

  const handleSave = () => {
    saveTemplate(currentTpl);
    setActiveTemplate(currentTpl);
  };

  const handleLoadPreset = (preset: LowerThirdTemplate) => {
    setCurrentTpl(preset);
    setActiveTemplate(preset);
    setSelectedLayerId(preset.elements[0]?.id || null);
  };

  const handleTriggerTestAnimation = () => {
    setPreviewAnimKey(k => k + 1);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col bg-[#07090e] select-none">
      {/* Top Designer Toolbar */}
      <div className="h-12 bg-[#0c101c] border-b border-slate-800 px-4 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <span className="text-xs font-black uppercase tracking-wider text-slate-200 flex items-center gap-1.5">
            <Palette className="w-4 h-4 text-[#00d2ff]" />
            <span>{t('designer')}</span>
          </span>

          <input
            type="text"
            value={currentTpl.name}
            onChange={(e) => setCurrentTpl(prev => ({ ...prev, name: e.target.value }))}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-bold text-white focus:outline-none focus:border-[#00d2ff] w-56"
          />

          {/* Resolution Selector */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded p-0.5 text-[11px] font-mono">
            <button
              onClick={() => setCurrentTpl(prev => ({ ...prev, resolution: '1920x1080' }))}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                currentTpl.resolution === '1920x1080' ? 'bg-[#0066ff] text-white font-bold' : 'text-slate-400'
              }`}
            >
              1920×1080
            </button>
            <button
              onClick={() => setCurrentTpl(prev => ({ ...prev, resolution: '1280x720' }))}
              className={`px-2 py-0.5 rounded cursor-pointer ${
                currentTpl.resolution === '1280x720' ? 'bg-[#0066ff] text-white font-bold' : 'text-slate-400'
              }`}
            >
              1280×720
            </button>
          </div>
        </div>

        {/* Center / Right Quick Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded px-2 py-1 text-xs gap-1.5 text-slate-400">
            <button onClick={() => setCanvasZoom(z => Math.max(0.25, z - 0.05))} className="hover:text-white cursor-pointer">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-9 text-center">{Math.round(canvasZoom * 100)}%</span>
            <button onClick={() => setCanvasZoom(z => Math.min(1.0, z + 0.05))} className="hover:text-white cursor-pointer">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Presets dropdown */}
          <select
            onChange={(e) => {
              const found = templates.find(t => t.id === e.target.value) || PRESET_TEMPLATES.find(t => t.id === e.target.value);
              if (found) handleLoadPreset(found);
            }}
            value={currentTpl.id}
            className="bg-slate-900 border border-slate-700 rounded px-2.5 py-1 text-xs font-semibold text-slate-300 focus:outline-none"
          >
            <optgroup label="Preset Broadcast Styles">
              {PRESET_TEMPLATES.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </optgroup>
          </select>

          {/* Test Animation */}
          <button
            onClick={handleTriggerTestAnimation}
            className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded flex items-center gap-1 cursor-pointer"
          >
            <Play className="w-3 h-3 text-[#00d2ff]" />
            <span>{t('preview_animation')}</span>
          </button>

          {/* Save Template */}
          <button
            onClick={handleSave}
            className="px-4 py-1 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 active:scale-95 text-white text-xs font-black uppercase tracking-wider rounded flex items-center gap-1.5 shadow cursor-pointer"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{t('save_template')}</span>
          </button>
        </div>
      </div>

      {/* 3-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: Layers Panel */}
        <div className="w-64 bg-[#090d16] border-r border-slate-800/80 flex flex-col justify-between">
          <div className="p-3 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#00d2ff]" />
              <span>{t('layers_panel')}</span>
            </span>

            {/* Add Layer Menu */}
            <div className="relative group">
              <button className="p-1 bg-[#0066ff] hover:bg-[#0055dd] text-white rounded cursor-pointer">
                <Plus className="w-3.5 h-3.5" />
              </button>
              <div className="hidden group-hover:block absolute left-0 top-full mt-1 w-44 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-30 p-1 text-xs">
                <button onClick={() => handleAddLayer('playerOut')} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-red-400 font-bold">
                  + Player OUT
                </button>
                <button onClick={() => handleAddLayer('playerIn')} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-emerald-400 font-bold">
                  + Player IN
                </button>
                <button onClick={() => handleAddLayer('minute')} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-amber-400 font-bold">
                  + Minute Badge
                </button>
                <button onClick={() => handleAddLayer('teamName')} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-blue-400 font-bold">
                  + Team Header
                </button>
                <button onClick={() => handleAddLayer('background')} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300 font-bold">
                  + Background Panel
                </button>
                <button onClick={() => handleAddLayer('customText')} className="w-full text-left px-2 py-1.5 rounded hover:bg-slate-800 text-slate-300">
                  + Custom Text / Sponsor
                </button>
              </div>
            </div>
          </div>

          {/* Layer List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {currentTpl.elements.map((el) => {
              const isSelected = selectedLayerId === el.id;

              return (
                <div
                  key={el.id}
                  onClick={() => setSelectedLayerId(el.id)}
                  className={`flex items-center justify-between px-2.5 py-2 rounded-lg text-xs cursor-pointer transition ${
                    isSelected
                      ? 'bg-[#0066ff]/20 border border-[#00d2ff]/50 text-white font-bold'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="w-2 h-2 rounded-full bg-[#00d2ff]" />
                    <span className="truncate">{el.name}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => handleToggleVisibility(el.id, e)}
                      className="hover:text-white text-slate-500"
                    >
                      {el.style.visible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-slate-600" />}
                    </button>
                    <button
                      onClick={(e) => handleToggleLock(el.id, e)}
                      className="hover:text-white text-slate-500"
                    >
                      {el.style.locked ? <Lock className="w-3.5 h-3.5 text-amber-500" /> : <Unlock className="w-3.5 h-3.5 text-slate-600" />}
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLayer(el.id);
                      }}
                      className="hover:text-red-400 text-slate-600"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Preset templates selector */}
          <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-2">
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">
              Quick Switch Styles
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {PRESET_TEMPLATES.map(p => (
                <button
                  key={p.id}
                  onClick={() => handleLoadPreset(p)}
                  className="px-2 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded text-[10px] font-bold text-slate-300 text-left truncate cursor-pointer"
                >
                  {p.name.split(' ')[0]}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* MIDDLE: Design Canvas */}
        <div className="flex-1 bg-[#05070c] overflow-auto flex items-center justify-center p-8 relative">
          {/* Subtle grid pattern */}
          {showGrid && (
            <div 
              className="absolute inset-0 opacity-15 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(circle, #334155 1px, transparent 1px)',
                backgroundSize: '24px 24px'
              }}
            />
          )}

          {/* Canvas Viewport Frame */}
          <div 
            key={previewAnimKey}
            className="relative border border-slate-800 shadow-2xl bg-[#030508] rounded overflow-hidden"
            style={{
              width: `${(currentTpl.resolution === '1920x1080' ? 1920 : 1280) * canvasZoom}px`,
              height: `${(currentTpl.resolution === '1920x1080' ? 1080 : 720) * canvasZoom}px`
            }}
          >
            {/* Realtime Football background for broadcast contrast */}
            <div 
              className="absolute inset-0 opacity-20 bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80')`
              }}
            />

            <LiveLowerThirdPreview
              template={currentTpl}
              match={match}
              substitution={activeSub}
              customLabels={customLabels}
              scale={canvasZoom}
              interactive={true}
              selectedLayerId={selectedLayerId}
              onSelectLayer={(id) => setSelectedLayerId(id)}
              forceVisible={true}
            />
          </div>
        </div>

        {/* RIGHT: Properties Panel */}
        <div className="w-80 bg-[#090d16] border-l border-slate-800/80 p-4 overflow-y-auto space-y-5">
          <div className="border-b border-slate-800 pb-2.5 flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-slate-200">
              {t('properties_panel')}
            </span>
            {selectedLayer && (
              <span className="text-[10px] font-mono text-[#00d2ff]">
                {selectedLayer.type}
              </span>
            )}
          </div>

          {!selectedLayer ? (
            <div className="py-16 text-center text-xs text-slate-500">
              Select a layer to inspect and edit its properties.
            </div>
          ) : (
            <div className="space-y-4 text-xs">
              {/* Layer Name & Tag Content */}
              <div>
                <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                  {t('layer_name')}
                </label>
                <input
                  type="text"
                  value={selectedLayer.name}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCurrentTpl(prev => ({
                      ...prev,
                      elements: prev.elements.map(el => 
                        el.id === selectedLayerId ? { ...el, name: val } : el
                      )
                    }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-[#00d2ff]"
                />
              </div>

              {selectedLayer.type !== 'background' && selectedLayer.type !== 'logo' && (
                <div>
                  <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1 flex items-center justify-between">
                    <span>{t('text_content')}</span>
                    <span className="text-[9px] text-[#00d2ff]">Supports &lt;TAG&gt;</span>
                  </label>
                  <input
                    type="text"
                    value={selectedLayer.content || ''}
                    onChange={(e) => updateSelectedContent(e.target.value)}
                    placeholder="e.g. <PlayerOut> or #<NumberOut>"
                    className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-1.5 text-xs font-mono text-emerald-400 focus:outline-none focus:border-[#00d2ff]"
                  />
                </div>
              )}

              {/* Geometry: X, Y, Width, Height */}
              <div className="space-y-2 pt-1 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Position &amp; Size (px)
                </span>
                <div className="grid grid-cols-2 gap-2 font-mono">
                  <div>
                    <label className="block text-[9px] text-slate-500">X (Left)</label>
                    <input
                      type="number"
                      value={selectedLayer.style.x}
                      onChange={(e) => updateSelectedStyle({ x: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500">Y (Top)</label>
                    <input
                      type="number"
                      value={selectedLayer.style.y}
                      onChange={(e) => updateSelectedStyle({ y: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500">Width</label>
                    <input
                      type="number"
                      value={selectedLayer.style.width}
                      onChange={(e) => updateSelectedStyle({ width: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500">Height</label>
                    <input
                      type="number"
                      value={selectedLayer.style.height}
                      onChange={(e) => updateSelectedStyle({ height: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Colors & Typography */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Colors &amp; Styling
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-500">{t('text_color')}</label>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded p-1">
                      <input
                        type="color"
                        value={selectedLayer.style.color.startsWith('#') ? selectedLayer.style.color : '#ffffff'}
                        onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={selectedLayer.style.color}
                        onChange={(e) => updateSelectedStyle({ color: e.target.value })}
                        className="w-full bg-transparent font-mono text-[10px] text-white focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500">{t('bg_color')}</label>
                    <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded p-1">
                      <input
                        type="color"
                        value={selectedLayer.style.backgroundColor.startsWith('#') ? selectedLayer.style.backgroundColor : '#0066ff'}
                        onChange={(e) => updateSelectedStyle({ backgroundColor: e.target.value })}
                        className="w-6 h-6 rounded cursor-pointer bg-transparent border-0"
                      />
                      <input
                        type="text"
                        value={selectedLayer.style.backgroundColor}
                        onChange={(e) => updateSelectedStyle({ backgroundColor: e.target.value })}
                        className="w-full bg-transparent font-mono text-[10px] text-white focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-500">{t('font_size')} (px)</label>
                    <input
                      type="number"
                      value={selectedLayer.style.fontSize}
                      onChange={(e) => updateSelectedStyle({ fontSize: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500">Font Weight</label>
                    <select
                      value={selectedLayer.style.fontWeight}
                      onChange={(e) => updateSelectedStyle({ fontWeight: e.target.value })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                    >
                      <option value="400">Regular (400)</option>
                      <option value="600">Semibold (600)</option>
                      <option value="700">Bold (700)</option>
                      <option value="800">Extrabold (800)</option>
                      <option value="900">Black (900)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Border & Corner Radius */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Border &amp; Corners
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-500">{t('border_width')}</label>
                    <input
                      type="number"
                      value={selectedLayer.style.borderWidth}
                      onChange={(e) => updateSelectedStyle({ borderWidth: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500">{t('border_radius')}</label>
                    <input
                      type="number"
                      value={selectedLayer.style.borderRadius}
                      onChange={(e) => updateSelectedStyle({ borderRadius: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-500">Opacity</label>
                    <input
                      type="number"
                      step="0.05"
                      min="0"
                      max="1"
                      value={selectedLayer.style.opacity}
                      onChange={(e) => updateSelectedStyle({ opacity: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Animation Effect */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  {t('animation')}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[9px] text-slate-500">Effect</label>
                    <select
                      value={selectedLayer.style.animation}
                      onChange={(e) => updateSelectedStyle({ animation: e.target.value as any })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white text-[11px]"
                    >
                      <option value="slide-left">{t('slide_left')}</option>
                      <option value="slide-up">{t('slide_up')}</option>
                      <option value="fade">{t('fade')}</option>
                      <option value="zoom">{t('zoom')}</option>
                      <option value="split-modern">{t('split_modern')}</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[9px] text-slate-500">Duration (s)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="3"
                      value={selectedLayer.style.animationDuration || 0.5}
                      onChange={(e) => updateSelectedStyle({ animationDuration: Number(e.target.value) })}
                      className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
