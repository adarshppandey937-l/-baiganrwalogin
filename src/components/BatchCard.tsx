import { useState } from 'react';
import { ArrowRight, Check, Plus } from 'lucide-react';
import type { BatchItem } from '../types/portal';

interface BatchCardProps {
  batch: BatchItem;
  isEnrolled: boolean;
  onToggleEnroll: (batchId: string) => void;
  onStudy: (batch: BatchItem) => void;
}

export function BatchCard({
  batch,
  isEnrolled,
  onToggleEnroll,
  onStudy,
}: BatchCardProps) {
  const [imgSrc, setImgSrc] = useState(batch.thumbnail);
  const [imgFailed, setImgFailed] = useState(false);

  const handleImageError = () => {
    if (imgSrc !== batch.fallbackThumbnail) {
      setImgSrc(batch.fallbackThumbnail);
    } else {
      setImgFailed(true);
    }
  };

  return (
    <div className="premium-card rounded-[20px] overflow-hidden group flex flex-col relative">
      {/* Thumbnail */}
      <div
        onClick={() => onStudy(batch)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onStudy(batch);
          }
        }}
        className="relative w-full aspect-[16/9] overflow-hidden bg-[#09050d] cursor-pointer"
      >
        {!imgFailed && (
          <img
            src={imgSrc}
            alt={batch.title}
            loading="lazy"
            referrerPolicy="no-referrer"
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-[1.08] transition-transform duration-700 ease-out opacity-90 group-hover:opacity-100"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#130a1c] via-[#130a1c]/20 to-transparent pointer-events-none" />
        <div className="absolute top-3 right-3 bg-[#a855f7]/20 backdrop-blur-md border border-[#a855f7]/30 px-2.5 py-1 rounded-lg z-10 shadow-[0_0_10px_rgba(168,85,247,0.3)]">
          <span className="text-[#c084fc] text-[9px] font-black tracking-widest uppercase drop-shadow-md">
            batch
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex flex-col flex-1 relative z-10">
        <h3
          onClick={() => onStudy(batch)}
          className="text-stone-200 font-bold text-sm sm:text-[15px] leading-relaxed mb-5 line-clamp-2 group-hover:text-[#c084fc] transition-colors drop-shadow-sm cursor-pointer"
        >
          {batch.title}
        </h3>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5 gap-3">
          {isEnrolled ? (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleEnroll(batch.id);
              }}
              className="bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/30 px-3.5 py-2 rounded-xl text-[11px] font-black tracking-wider flex items-center gap-1.5 hover:bg-[#10B981]/25 transition-colors shadow-inner whitespace-nowrap btn-click-effect"
            >
              <Check className="w-3.5 h-3.5 shrink-0" />
              ENROLLED
            </button>
          ) : (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onToggleEnroll(batch.id);
              }}
              className="bg-gradient-to-r from-[#a855f7] to-purple-600 hover:opacity-90 text-white px-3.5 py-2 rounded-xl text-[11px] font-black tracking-wider flex items-center gap-1.5 transition-all btn-click-effect shadow-[0_4px_10px_rgba(168,85,247,0.3)] whitespace-nowrap"
            >
              <Plus className="w-3.5 h-3.5 shrink-0" />
              ENROLL
            </button>
          )}

          <button
            type="button"
            onClick={() => onStudy(batch)}
            className="bg-white hover:bg-stone-200 text-black px-4 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider flex items-center gap-2 transition-all btn-click-effect shadow-md whitespace-nowrap"
          >
            Study
            <ArrowRight className="w-3.5 h-3.5 shrink-0" />
          </button>
        </div>
      </div>
    </div>
  );
}
