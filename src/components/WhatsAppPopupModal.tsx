import { useEffect } from 'react';
import { ExternalLink, X } from 'lucide-react';
import { BRAND_FULL } from '../data/batches';
import { BrandLogo } from './BrandLogo';

export const WHATSAPP_CHANNEL_URL =
  'https://whatsapp.com/channel/0029VbDcWLp8PgsHZKtwRd0z';

interface WhatsAppPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function WhatsAppPopupModal({
  isOpen,
  onClose,
}: WhatsAppPopupModalProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[9995] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-label={`Join ${BRAND_FULL} WhatsApp Channel`}
      onClick={onClose}
    >
      <div
        className="modal-glass w-full max-w-sm rounded-3xl p-7 relative overflow-hidden border border-[#25D366]/30 shadow-[0_0_50px_-10px_rgba(37,211,102,0.28)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close WhatsApp popup"
          className="absolute top-4 right-4 text-stone-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Brand Photo + WhatsApp Emblem */}
        <div className="text-center mb-6">
          <div className="relative mx-auto mb-4 w-16 h-16">
            <BrandLogo className="w-16 h-16 rounded-2xl border-2 border-[#25D366]/45 shadow-[0_0_20px_rgba(37,211,102,0.28)]" />
            <div className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-full bg-[#25D366] text-[#051a0d] flex items-center justify-center border-2 border-[#0e0716] shadow-md">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 fill-current"
                aria-hidden="true"
              >
                <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .14 5.35.14 11.92c0 2.1.55 4.15 1.59 5.96L0 24l6.29-1.65a11.88 11.88 0 0 0 5.77 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.18-3.47-8.42ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.88-9.9 9.88Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
              </svg>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white font-syne tracking-tight leading-snug">
            JOIN <span className="text-[#25D366]">WHATSAPP</span> CHANNEL
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
            <span className="font-bold text-white">{BRAND_FULL}</span> ke latest
            batches, free classes, exam updates aur notes pane ke liye official
            WhatsApp Channel join karein.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <a
            href={WHATSAPP_CHANNEL_URL}
            target="_blank"
            rel="noopener noreferrer"
            onClick={onClose}
            className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-[#04180c] font-black text-sm py-3.5 px-5 rounded-xl transition-all btn-click-effect shadow-[0_6px_24px_rgba(37,211,102,0.35)] flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 fill-current shrink-0"
              aria-hidden="true"
            >
              <path d="M20.52 3.48A11.86 11.86 0 0 0 12.06 0C5.49 0 .14 5.35.14 11.92c0 2.1.55 4.15 1.59 5.96L0 24l6.29-1.65a11.88 11.88 0 0 0 5.77 1.47h.01c6.57 0 11.92-5.35 11.92-11.92 0-3.18-1.24-6.18-3.47-8.42ZM12.07 21.8h-.01a9.87 9.87 0 0 1-5.04-1.38l-.36-.21-3.73.98 1-3.64-.24-.37a9.86 9.86 0 0 1-1.52-5.26c0-5.46 4.44-9.9 9.9-9.9 2.64 0 5.13 1.03 7 2.9a9.84 9.84 0 0 1 2.9 7c0 5.46-4.44 9.88-9.9 9.88Zm5.43-7.41c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.48-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.07 2.88 1.21 3.08c.15.2 2.1 3.2 5.08 4.49.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.41-.07-.12-.27-.2-.57-.35Z" />
            </svg>
            Join WhatsApp Channel
            <ExternalLink className="w-4 h-4 shrink-0" />
          </a>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 px-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-300 hover:text-white text-xs font-bold transition-colors btn-click-effect"
          >
            Already Joined / Close
          </button>
        </div>
      </div>
    </div>
  );
}
