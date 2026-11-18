import { useState } from 'react';
import {
  BRAND_FULL,
  BRAND_LOGO_FALLBACK_URL,
  BRAND_LOGO_URL,
} from '../data/batches';

interface BrandLogoProps {
  className?: string;
}

export function BrandLogo({ className = 'w-10 h-10 rounded-xl' }: BrandLogoProps) {
  const [src, setSrc] = useState(BRAND_LOGO_URL);
  const [failed, setFailed] = useState(false);

  const handleError = () => {
    if (src === BRAND_LOGO_URL) {
      setSrc(BRAND_LOGO_FALLBACK_URL);
    } else {
      setFailed(true);
    }
  };

  if (failed) {
    return (
      <div
        className={`${className} bg-[#1c1028] border border-purple-500/40 flex items-center justify-center shrink-0 select-none`}
        aria-label={BRAND_FULL}
      >
        <span className="font-display font-black text-sm tracking-tight text-purple-300">
          PJ
        </span>
      </div>
    );
  }

  return (
    <div
      className={`${className} bg-[#0d0714] border border-purple-500/35 overflow-hidden shrink-0 shadow-[0_0_16px_rgba(168,85,247,0.22)]`}
    >
      <img
        src={src}
        alt={`${BRAND_FULL} emblem`}
        referrerPolicy="no-referrer"
        onError={handleError}
        className="w-full h-full object-cover"
      />
    </div>
  );
}
