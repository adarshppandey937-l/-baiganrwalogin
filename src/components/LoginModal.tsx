import { useState, type FormEvent } from 'react';
import {
  AlertCircle,
  KeyRound,
  LogOut,
  Phone,
  ShieldCheck,
  X,
} from 'lucide-react';
import type { UserSession } from '../types/portal';
import { BrandLogo } from './BrandLogo';

interface LoginModalProps {
  isOpen: boolean;
  user: UserSession | null;
  onClose: () => void;
  onLoginSuccess: (session: UserSession) => void;
  onLogout: () => void;
}

export function LoginModal({
  isOpen,
  user,
  onClose,
  onLoginSuccess,
  onLogout,
}: LoginModalProps) {
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setStep('phone');
    setOtpInput('');
    setGeneratedOtp('');
    setError('');
  };

  const handleSendOtp = (e: FormEvent) => {
    e.preventDefault();
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) {
      setError('Enter a valid 10-digit number.');
      return;
    }
    const code = String(Math.floor(100000 + Math.random() * 900000));
    setPhone(cleaned);
    setGeneratedOtp(code);
    setOtpInput('');
    setError('');
    setStep('otp');
  };

  const handleVerifyOtp = (e: FormEvent) => {
    e.preventDefault();
    if (!otpInput.trim()) {
      setError('Please enter the OTP.');
      return;
    }
    if (otpInput.trim() !== generatedOtp) {
      setError('Invalid OTP. Please enter the code shown above.');
      return;
    }
    const session: UserSession = {
      token: `pj_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
      userid: String(Math.floor(10000 + Math.random() * 90000)),
      name: 'User',
      phone,
    };
    resetForm();
    onLoginSuccess(session);
  };

  return (
    <div
      className="fixed inset-0 z-[9990] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md transition-opacity"
      role="dialog"
      aria-modal="true"
      aria-label="Login"
    >
      <div className="modal-glass w-full max-w-sm rounded-3xl p-7 relative overflow-hidden">
        <button
          type="button"
          onClick={() => {
            resetForm();
            onClose();
          }}
          aria-label="Close login dialog"
          className="absolute top-4 right-4 text-stone-500 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* User Photo + Heading */}
        <div className="text-center mb-7">
          <div className="mx-auto mb-4 w-14 h-14 flex items-center justify-center">
            <BrandLogo className="w-14 h-14 rounded-2xl border-2 border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.4)]" />
          </div>
          <h2 className="text-2xl font-black text-white font-syne mb-1 tracking-tight drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
            {user ? 'MY ACCOUNT' : 'WELCOME BACK'}
          </h2>
          <p className="text-xs text-stone-400">
            {user
              ? `Logged in with +91 ${user.phone}`
              : 'Login to unlock premium batches'}
          </p>
        </div>

        {user ? (
          <button
            type="button"
            onClick={() => {
              onLogout();
              onClose();
            }}
            className="w-full bg-red-500/15 hover:bg-red-500/25 border border-red-500/35 text-red-200 font-bold text-sm py-3.5 rounded-xl flex items-center justify-center gap-2 transition-colors btn-click-effect"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        ) : (
          <>
            {error && (
              <div className="mb-5 bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3.5 rounded-xl flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {step === 'phone' ? (
              <form onSubmit={handleSendOtp} className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Phone className="w-4 h-4 text-[#a855f7]" />
                  </div>
                  <input
                    type="tel"
                    inputMode="numeric"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => {
                      setPhone(e.target.value.replace(/\D/g, '').slice(0, 10));
                      setError('');
                    }}
                    placeholder="Enter 10-digit number"
                    className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#a855f7] transition-all"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#a855f7] to-purple-500 text-white font-bold text-sm py-3.5 rounded-xl hover:opacity-90 transition-opacity shadow-[0_0_20px_rgba(168,85,247,0.4)] btn-click-effect"
                >
                  Get OTP
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="flex flex-col gap-4">
                <p className="text-xs text-stone-400 text-center">
                  OTP sent to{' '}
                  <span className="text-[#c084fc] font-bold">{phone}</span>{' '}
                  <button
                    type="button"
                    onClick={resetForm}
                    className="text-stone-300 underline ml-1 hover:text-white"
                  >
                    Edit
                  </button>
                </p>

                <div className="rounded-xl bg-[#a855f7]/10 border border-[#a855f7]/30 px-3.5 py-2.5 flex items-center justify-between gap-2 text-xs">
                  <span className="flex items-center gap-1.5 text-purple-200">
                    <ShieldCheck className="w-4 h-4 text-[#c084fc]" />
                    OTP: <strong className="font-mono text-white">{generatedOtp}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpInput(generatedOtp);
                      setError('');
                    }}
                    className="text-[11px] font-bold text-[#c084fc] hover:text-white underline"
                  >
                    Fill
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <KeyRound className="w-4 h-4 text-[#a855f7]" />
                  </div>
                  <input
                    type="number"
                    value={otpInput}
                    onChange={(e) => {
                      setOtpInput(e.target.value.slice(0, 6));
                      setError('');
                    }}
                    placeholder="Enter OTP"
                    className="w-full bg-black/40 border border-white/10 text-white text-sm rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:border-[#a855f7] transition-all tracking-[0.4em] text-center font-bold"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-white text-black font-bold text-sm py-3.5 rounded-xl hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] btn-click-effect"
                >
                  Verify &amp; Proceed
                </button>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
