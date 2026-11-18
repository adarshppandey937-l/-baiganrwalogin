import { Bookmark, LayoutGrid, User } from 'lucide-react';
import { BRAND_FIRST, BRAND_SECOND } from '../data/batches';
import type { AppView, UserSession } from '../types/portal';
import { BrandLogo } from './BrandLogo';

interface NavbarProps {
  activeView: AppView;
  user: UserSession | null;
  enrolledCount: number;
  onSwitchTab: (tab: 'new' | 'wishlist') => void;
  onOpenAuth: () => void;
}

export function Navbar({
  activeView,
  user,
  enrolledCount,
  onSwitchTab,
  onOpenAuth,
}: NavbarProps) {
  const displayName =
    user && user.name && user.name !== 'User'
      ? user.name.split(' ')[0]
      : user
        ? 'My Account'
        : 'Login';

  return (
    <nav className="w-full z-40 nav-glass h-[70px] sticky top-0">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
        {/* Brand Photo + PANDEY JI */}
        <button
          type="button"
          onClick={() => onSwitchTab('new')}
          className="flex items-center gap-3 cursor-pointer btn-click-effect group shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 rounded-xl"
        >
          <BrandLogo className="w-10 h-10 rounded-xl group-hover:shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all" />
          <h1 className="text-xl font-black tracking-wider text-white font-syne drop-shadow-md whitespace-nowrap">
            {BRAND_FIRST}{' '}
            <span className="text-[#a855f7] drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]">
              {BRAND_SECOND}
            </span>
          </h1>
        </button>

        {/* Desktop Nav Links — exact 2 links matching studybeepro.site/rwax */}
        <div className="hidden md:flex items-center gap-6">
          <button
            type="button"
            onClick={() => onSwitchTab('new')}
            className={`font-bold text-sm transition-colors flex items-center gap-2 btn-click-effect whitespace-nowrap ${
              activeView === 'new' || activeView === 'batch-detail'
                ? 'text-white hover:text-[#a855f7]'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" />
            Batches
          </button>

          <button
            type="button"
            onClick={() => onSwitchTab('wishlist')}
            className={`font-bold text-sm transition-colors flex items-center gap-2 btn-click-effect whitespace-nowrap ${
              activeView === 'wishlist'
                ? 'text-white hover:text-[#a855f7]'
                : 'text-stone-400 hover:text-white'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            My Enrollments
          </button>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onSwitchTab('wishlist')}
            aria-label="My Enrollments"
            className="md:hidden text-stone-300 p-2.5 border border-white/10 rounded-xl hover:text-[#a855f7] hover:border-[#a855f7]/40 transition-colors btn-click-effect relative bg-white/5"
          >
            <Bookmark className="w-5 h-5" />
            {enrolledCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-[#a855f7] text-[10px] font-black text-white rounded-full flex items-center justify-center">
                {enrolledCount}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={onOpenAuth}
            className={`border px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-sm whitespace-nowrap btn-click-effect ${
              user
                ? 'text-[#c084fc] border-[#a855f7]/40 bg-[#a855f7]/10 hover:bg-[#a855f7]/20'
                : 'text-white bg-white/5 border-white/10 hover:bg-white/10 hover:border-[#a855f7]/40'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span>{displayName}</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
