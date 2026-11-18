import { AlertCircle, CheckCircle2, Info } from 'lucide-react';
import type { ToastNotice } from '../types/portal';

interface ToastBannerProps {
  toast: ToastNotice | null;
}

export function ToastBanner({ toast }: ToastBannerProps) {
  if (!toast) return null;

  const styles =
    toast.type === 'success'
      ? 'bg-[#1d102b]/95 border-purple-400/45 text-purple-100'
      : toast.type === 'error'
        ? 'bg-red-950/95 border-red-500/45 text-red-100'
        : 'bg-[#171122]/95 border-white/15 text-stone-100';

  const Icon =
    toast.type === 'success'
      ? CheckCircle2
      : toast.type === 'error'
        ? AlertCircle
        : Info;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed top-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-2.5 px-5 py-3 rounded-2xl border backdrop-blur-md text-sm font-semibold shadow-2xl ${styles}`}
    >
      <Icon
        className={`w-4 h-4 shrink-0 ${
          toast.type === 'success'
            ? 'text-purple-300'
            : toast.type === 'error'
              ? 'text-red-400'
              : 'text-stone-300'
        }`}
      />
      <span>{toast.message}</span>
    </div>
  );
}
