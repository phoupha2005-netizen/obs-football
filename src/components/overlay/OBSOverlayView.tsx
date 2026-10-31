import React, { useState } from 'react';
import { useApp, getPublicOBSUrl } from '../../context/AppContext';
import { LiveLowerThirdPreview } from '../preview/LiveLowerThirdPreview';
import { MonitorPlay, Copy, Check, ExternalLink, Play, Square, AlertCircle } from 'lucide-react';

export const OBSOverlayView: React.FC<{ isStandalone?: boolean }> = ({ isStandalone = false }) => {
  const { 
    match, 
    activeSub, 
    onAir, 
    showOnAir, 
    hideFromAir, 
    activeTemplate, 
    customLabels 
  } = useApp();

  const [copied, setCopied] = useState<boolean>(false);
  const overlayUrl = getPublicOBSUrl('/overlay');

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(overlayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // If accessed directly as OBS Browser Source (transparent full viewport)
  if (isStandalone) {
    return (
      <div className="w-screen h-screen overflow-hidden bg-transparent pointer-events-none select-none flex items-end justify-center pb-8">
        {onAir && (
          <LiveLowerThirdPreview
            template={activeTemplate}
            match={match}
            substitution={activeSub}
            customLabels={customLabels}
            scale={1}
            forceVisible={true}
          />
        )}
      </div>
    );
  }

  // Inside Studio App Preview Mode
  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-[#120e24] p-6 rounded-xl border border-purple-500/30 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl border border-purple-500/40">
              <MonitorPlay className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-black text-white uppercase tracking-wider">
                OBS Browser Source Graphic Overlay
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Add directly into your OBS Scenes as a transparent 1920×1080 Browser Source
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onAir ? (
              <button
                onClick={() => hideFromAir()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Square className="w-4 h-4 fill-current" />
                <span>HIDE OVERLAY</span>
              </button>
            ) : (
              <button
                onClick={() => showOnAir()}
                className="px-4 py-2 bg-gradient-to-r from-emerald-600 to-teal-500 hover:brightness-110 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>SHOW TEST OVERLAY</span>
              </button>
            )}
          </div>
        </div>

        {/* Copy URL Box */}
        <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
          <input
            type="text"
            readOnly
            value={overlayUrl}
            className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 font-mono text-xs text-purple-300 focus:outline-none"
          />
          <button
            onClick={handleCopyUrl}
            className="w-full sm:w-auto px-5 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 cursor-pointer shadow whitespace-nowrap"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied URL!' : 'Copy Overlay URL'}</span>
          </button>
        </div>

        {/* Warning card for Google Sign in fix */}
        <div className="p-3.5 bg-amber-950/40 border border-amber-600/40 rounded-lg text-xs space-y-1 text-amber-200">
          <div className="flex items-center gap-2 font-bold text-amber-400">
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>คำแนะนำ: หากหน้าจอใน OBS ขึ้นหน้า Google Sign in</span>
          </div>
          <p className="text-[11px] text-amber-200/90 leading-relaxed">
            โปรแกรม OBS Studio จะไม่มีข้อมูลคุกกี้ล็อกอิน Google เหมือนในเว็บเบราว์เซอร์ของคุณ ดังนั้นหากใส่ลิงก์ Developer ส่วนตัว (<code>ais-dev-...</code>) หน้าจอ OBS จะถามหาการล็อกอิน Google ทันที
          </p>
          <p className="text-[11px] text-emerald-400 font-semibold">
            ✅ ให้คัดลอกลิงก์ด้านบนนี้ (ซึ่งเป็นลิงก์สาธารณะ <code>ais-pre-...</code> หรือลิงก์ Vercel) ไปวางใน OBS เพื่อให้โหลดกราฟิกได้ทันที 100% โดยไม่ติดหน้าล็อกอิน!
          </p>
        </div>
      </div>

      {/* Instructions & Preview */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-200">
            How to use in OBS Studio
          </h3>
          <span className="text-[10px] text-slate-500 font-mono">100% Alpha Transparent</span>
        </div>

        <ol className="list-decimal list-inside space-y-2 text-xs text-slate-300">
          <li>In OBS Studio, go to your Sources panel and click <strong>+ (Add Source) &gt; Browser</strong>.</li>
          <li>Name it: <strong>Football Substitution Lower Third</strong>.</li>
          <li>Paste the URL: <code className="bg-slate-950 px-2 py-0.5 rounded text-purple-300">{overlayUrl}</code></li>
          <li>Set Width: <strong>1920</strong> and Height: <strong>1080</strong> (or 1280 × 720).</li>
          <li>Check: <strong>"Shutdown source when not visible"</strong> and <strong>"Refresh browser when scene becomes active"</strong>.</li>
          <li>Whenever you click <strong>SHOW ON OBS</strong> in this Studio or Browser Dock, the graphic will appear instantly on stream!</li>
        </ol>

        {/* Live Test Window Preview */}
        <div className="pt-4 border-t border-slate-800">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider block mb-2">
            Simulated Stream Output:
          </span>
          <div className="relative aspect-video bg-gradient-to-b from-slate-950 to-black rounded-lg border border-slate-800 overflow-hidden flex items-end justify-center p-4">
            {/* Football pitch background */}
            <div
              className="absolute inset-0 opacity-25 bg-cover bg-center pointer-events-none"
              style={{
                backgroundImage: `url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80')`
              }}
            />

            {onAir ? (
              <div className="relative z-10 w-full flex items-end justify-center">
                <LiveLowerThirdPreview
                  template={activeTemplate}
                  match={match}
                  substitution={activeSub}
                  customLabels={customLabels}
                  scale={0.48}
                  forceVisible={true}
                />
              </div>
            ) : (
              <div className="relative z-10 text-xs text-slate-500 font-mono py-8">
                [Overlay is currently OFF AIR. Click "SHOW TEST OVERLAY" above]
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
