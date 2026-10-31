import React from 'react';
import { LowerThirdTemplate, Match, Substitution, LayerElement } from '../../types';
import { resolveTags } from '../../services/tagEngine';

interface LiveLowerThirdPreviewProps {
  template: LowerThirdTemplate;
  match: Match | null;
  substitution: Substitution | null;
  customLabels?: Record<string, string>;
  scale?: number;
  interactive?: boolean;
  selectedLayerId?: string | null;
  onSelectLayer?: (id: string) => void;
  onUpdateLayerPos?: (id: string, x: number, y: number) => void;
  forceVisible?: boolean;
}

export const LiveLowerThirdPreview: React.FC<LiveLowerThirdPreviewProps> = ({
  template,
  match,
  substitution,
  customLabels = {},
  scale = 1,
  interactive = false,
  selectedLayerId = null,
  onSelectLayer,
  forceVisible = false
}) => {
  const is1080p = template.resolution === '1920x1080';
  const canvasWidth = is1080p ? 1920 : 1280;
  const canvasHeight = is1080p ? 1080 : 720;

  // Substitute fallback for preview if none active
  const effectiveSub = substitution || {
    id: 'demo-preview',
    matchId: match?.id || 'demo',
    teamId: match?.teamAId || 'team-1',
    teamName: match?.teamAName || 'Arsenal FC',
    playerOutName: 'Bukayo Saka',
    playerOutNumber: 7,
    playerInName: 'Gabriel Martinelli',
    playerInNumber: 11,
    minute: match?.matchMinutes || 68,
    additionalTime: '',
    subType: 'tactical',
    status: 'on_air',
    obsStatus: 'visible',
    order: 1
  };

  const getAnimationClass = (anim: string) => {
    switch (anim) {
      case 'slide-left':
        return 'animate-slide-in-left';
      case 'slide-up':
        return 'animate-slide-in-up';
      case 'zoom':
        return 'animate-scale-in';
      case 'split-modern':
        return 'animate-split-reveal';
      case 'fade':
      default:
        return 'animate-fade-in';
    }
  };

  return (
    <div
      style={{
        width: `${canvasWidth * scale}px`,
        height: `${canvasHeight * scale}px`,
        transformOrigin: 'top left',
      }}
      className="relative overflow-hidden select-none pointer-events-auto"
    >
      <div
        style={{
          width: `${canvasWidth}px`,
          height: `${canvasHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
        className="absolute inset-0"
      >
        {template.elements.map((el: LayerElement) => {
          if (!el.style.visible && !forceVisible) return null;

          const isSelected = selectedLayerId === el.id;
          const resolvedText = resolveTags(el.content || '', match, effectiveSub, customLabels);

          const animClass = getAnimationClass(el.style.animation);

          return (
            <div
              key={el.id}
              onClick={(e) => {
                if (interactive && onSelectLayer) {
                  e.stopPropagation();
                  onSelectLayer(el.id);
                }
              }}
              style={{
                position: 'absolute',
                left: `${el.style.x}px`,
                top: `${el.style.y}px`,
                width: `${el.style.width}px`,
                height: `${el.style.height}px`,
                backgroundColor: el.style.backgroundColor,
                color: el.style.color,
                fontSize: `${el.style.fontSize}px`,
                fontFamily: el.style.fontFamily,
                fontWeight: el.style.fontWeight as any,
                textAlign: el.style.textAlign,
                borderWidth: `${el.style.borderWidth}px`,
                borderColor: el.style.borderColor,
                borderRadius: `${el.style.borderRadius}px`,
                boxShadow: el.style.boxShadow,
                opacity: el.style.opacity,
                zIndex: el.style.zIndex,
                cursor: interactive ? 'move' : 'default',
                animationDuration: `${el.style.animationDuration || 0.5}s`,
              }}
              className={`flex items-center px-3 py-1 transition-shadow ${animClass} ${
                isSelected && interactive
                  ? 'ring-2 ring-[#00d2ff] ring-offset-2 ring-offset-black shadow-lg shadow-[#00d2ff]/40'
                  : ''
              }`}
            >
              {/* Specialized layer rendering */}
              {el.type === 'logo' ? (
                <div className="w-full h-full flex items-center justify-center">
                  {match?.teamALogo ? (
                    <img
                      src={match.teamALogo}
                      alt="Logo"
                      className="max-h-full max-w-full object-contain filter drop-shadow"
                    />
                  ) : (
                    <span className="text-xs opacity-60">LOGO</span>
                  )}
                </div>
              ) : el.type === 'minute' ? (
                <div className="w-full h-full flex items-center justify-center font-black tracking-wider">
                  {resolvedText || `${effectiveSub.minute}'`}
                </div>
              ) : (
                <div className="w-full truncate font-sans tracking-wide">
                  {resolvedText}
                </div>
              )}

              {/* Selection handle indicators */}
              {isSelected && interactive && (
                <>
                  <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-[#00d2ff] border border-black rounded-full" />
                  <div className="absolute -top-1.5 -right-1.5 w-3 h-3 bg-[#00d2ff] border border-black rounded-full" />
                  <div className="absolute -bottom-1.5 -left-1.5 w-3 h-3 bg-[#00d2ff] border border-black rounded-full" />
                  <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-[#00d2ff] border border-black rounded-full" />
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
