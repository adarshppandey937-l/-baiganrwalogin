import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  ChevronDown,
  FolderSearch,
  Search,
  Sparkles,
  X,
} from 'lucide-react';
import { BatchCard } from './components/BatchCard';
import { BatchDetailView } from './components/BatchDetailView';
import { LecturePlayerModal } from './components/LecturePlayerModal';
import { LoginModal } from './components/LoginModal';
import { Navbar } from './components/Navbar';
import { PdfNotesModal } from './components/PdfNotesModal';
import { ToastBanner } from './components/ToastBanner';
import { WhatsAppPopupModal } from './components/WhatsAppPopupModal';
import { BATCHES } from './data/batches';
import type {
  AppView,
  BatchItem,
  LectureBookmark,
  LectureItem,
  ToastNotice,
  UserSession,
} from './types/portal';

const ITEMS_PER_PAGE = 12;

const STORAGE_KEYS = {
  user: 'pandeyji_user',
  wishlist: 'pandeyji_wishlist',
  completed: 'pandeyji_completed_lectures',
  bookmarks: 'pandeyji_bookmarks',
};

function loadJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<AppView>('new');
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const [user, setUser] = useState<UserSession | null>(() =>
    loadJson<UserSession | null>(STORAGE_KEYS.user, null)
  );
  const [wishlist, setWishlist] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.wishlist, []).map(String)
  );
  const [completedLectureIds, setCompletedLectureIds] = useState<string[]>(() =>
    loadJson<string[]>(STORAGE_KEYS.completed, [])
  );
  const [bookmarks, setBookmarks] = useState<LectureBookmark[]>(() =>
    loadJson<LectureBookmark[]>(STORAGE_KEYS.bookmarks, [])
  );

  const [activeBatch, setActiveBatch] = useState<BatchItem | null>(null);
  const [isWhatsAppPopupOpen, setIsWhatsAppPopupOpen] = useState(true);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const pendingActionRef = useRef<(() => void) | null>(null);

  const [activeLectureCtx, setActiveLectureCtx] = useState<{
    lecture: LectureItem;
    batchTitle: string;
    subjectName: string;
    topicName: string;
  } | null>(null);

  const [activePdfCtx, setActivePdfCtx] = useState<{
    lecture: LectureItem;
    batchTitle: string;
    subjectName: string;
    topicName: string;
  } | null>(null);

  const [toast, setToast] = useState<ToastNotice | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const showToast = useCallback(
    (message: string, type: ToastNotice['type'] = 'success') => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
      setToast({ id: Date.now(), message, type });
      toastTimerRef.current = window.setTimeout(() => {
        setToast(null);
      }, 3000);
    },
    []
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.completed,
      JSON.stringify(completedLectureIds)
    );
  }, [completedLectureIds]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const checkAuth = useCallback(
    (callback: () => void) => {
      if (user && user.token) {
        callback();
      } else {
        pendingActionRef.current = callback;
        setIsLoginOpen(true);
      }
    },
    [user]
  );

  const handleLoginSuccess = (session: UserSession) => {
    setUser(session);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(session));
    setIsLoginOpen(false);
    showToast('Welcome back!', 'success');
    if (pendingActionRef.current) {
      const next = pendingActionRef.current;
      pendingActionRef.current = null;
      next();
    }
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEYS.user);
    showToast('Logged out successfully', 'success');
  };

  const handleSwitchTab = (tab: 'new' | 'wishlist') => {
    setActiveView(tab);
    setActiveBatch(null);
    setSearchQuery('');
    setVisibleCount(ITEMS_PER_PAGE);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleEnroll = (batchId: string) => {
    checkAuth(() => {
      const id = String(batchId);
      setWishlist((prev) => {
        if (prev.includes(id)) {
          return prev.filter((item) => item !== id);
        }
        showToast('Added to your enrollments!', 'success');
        return [...prev, id];
      });
    });
  };

  const handleStudyClick = (batch: BatchItem) => {
    checkAuth(() => {
      setActiveBatch(batch);
      setActiveView('batch-detail');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  };

  const handleToggleLectureComplete = (lectureId: string) => {
    setCompletedLectureIds((prev) =>
      prev.includes(lectureId)
        ? prev.filter((id) => id !== lectureId)
        : [...prev, lectureId]
    );
  };

  const handleAddBookmark = (lectureId: string, timeSec: number, note: string) => {
    setBookmarks((prev) => [
      {
        id: `bm_${Date.now()}`,
        lectureId,
        timeSec,
        note,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    showToast('Bookmark saved!', 'success');
  };

  const handleDeleteBookmark = (bookmarkId: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== bookmarkId));
  };

  const filteredBatches = useMemo(() => {
    const base =
      activeView === 'wishlist'
        ? BATCHES.filter((batch) => wishlist.includes(batch.id))
        : BATCHES;

    const query = searchQuery.toLowerCase().trim();
    if (!query) return base;

    return base.filter(
      (batch) =>
        batch.title.toLowerCase().includes(query) ||
        batch.id.includes(query)
    );
  }, [activeView, wishlist, searchQuery]);

  const displayedBatches = filteredBatches.slice(0, visibleCount);
  const hasMore = visibleCount < filteredBatches.length;

  return (
    <div className="min-h-screen relative flex flex-col font-sans page-bg pb-16">
      <ToastBanner toast={toast} />

      {activeView === 'batch-detail' && activeBatch ? (
        <BatchDetailView
          batch={activeBatch}
          onBackToBatches={() => {
            setActiveView('new');
            setActiveBatch(null);
          }}
          onPlayLecture={(lecture, subjectName, topicName) =>
            setActiveLectureCtx({
              lecture,
              batchTitle: activeBatch.title,
              subjectName,
              topicName,
            })
          }
          onOpenPdf={(lecture, subjectName, topicName) =>
            setActivePdfCtx({
              lecture,
              batchTitle: activeBatch.title,
              subjectName,
              topicName,
            })
          }
        />
      ) : (
        <>
          <Navbar
            activeView={activeView}
            user={user}
            enrolledCount={wishlist.length}
            onSwitchTab={handleSwitchTab}
            onOpenAuth={() => setIsLoginOpen(true)}
          />

          <main className="flex-1 w-full max-w-[90rem] mx-auto px-4 sm:px-6 pt-8 relative z-10">
            {/* Header & Controls — exact match to studybeepro.site/rwax */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 mb-8">
              <div className="flex items-center gap-2 overflow-x-auto hide-scroll w-full md:w-auto p-1.5 bg-[#130a1c]/80 backdrop-blur-md rounded-2xl border border-white/5 shadow-inner">
                <button
                  type="button"
                  onClick={() => handleSwitchTab('new')}
                  className={`shrink-0 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeView === 'new'
                      ? 'bg-[#a855f7]/10 text-white border border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-transparent text-stone-400 hover:text-stone-200 border border-transparent'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#c084fc]" />
                  <span>
                    Latest <span className="hidden sm:inline">Batches</span>
                  </span>
                  <span className="bg-[#a855f7]/30 text-[#c084fc] ml-1 px-2 py-0.5 rounded-md text-[10px] font-black border border-[#a855f7]/20 tabular-nums">
                    {BATCHES.length}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleSwitchTab('wishlist')}
                  className={`shrink-0 px-4 sm:px-6 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 ${
                    activeView === 'wishlist'
                      ? 'bg-[#a855f7]/10 text-white border border-[#a855f7]/30 shadow-[0_0_15px_rgba(168,85,247,0.15)]'
                      : 'bg-transparent text-stone-400 hover:text-stone-200 border border-transparent'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>
                    <span className="hidden sm:inline">My </span>Enrolled
                  </span>
                  {wishlist.length > 0 && (
                    <span className="bg-[#10B981]/20 text-[#10B981] border border-[#10B981]/30 text-[10px] font-black px-2 py-0.5 rounded-md tabular-nums">
                      {wishlist.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="relative w-full md:w-[380px] group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="w-4 h-4 text-stone-500 group-focus-within:text-[#a855f7] transition-colors" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  placeholder="Search batches..."
                  aria-label="Search batches"
                  className="w-full bg-[#130a1c]/80 backdrop-blur-md border border-white/10 text-white text-sm rounded-2xl block pl-11 pr-11 py-3.5 transition-all placeholder:text-stone-600 focus:outline-none focus:border-[#a855f7]/60 focus:bg-[#1a0f26] shadow-inner"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    aria-label="Clear search"
                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-stone-500 hover:text-[#c084fc] transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Batch Grid */}
            {displayedBatches.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {displayedBatches.map((batch) => (
                    <BatchCard
                      key={batch.id}
                      batch={batch}
                      isEnrolled={wishlist.includes(batch.id)}
                      onToggleEnroll={handleToggleEnroll}
                      onStudy={handleStudyClick}
                    />
                  ))}
                </div>

                {/* Load More */}
                {hasMore && (
                  <div className="w-full flex justify-center mt-12 mb-8">
                    <button
                      type="button"
                      onClick={() =>
                        setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                      }
                      className="px-8 py-3 bg-[#130a1c]/80 backdrop-blur-md border border-[#a855f7]/30 hover:border-[#a855f7] hover:bg-[#a855f7]/10 rounded-2xl text-white font-bold text-sm transition-all btn-click-effect flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.1)] hover:shadow-[0_0_25px_rgba(168,85,247,0.25)]"
                    >
                      Load More Batches
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </>
            ) : (
              /* Empty State */
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="w-20 h-20 bg-[#130a1c] rounded-full flex items-center justify-center mb-5 border border-white/5 shadow-inner">
                  <FolderSearch className="w-10 h-10 text-stone-600" />
                </div>
                <h3 className="text-2xl font-black text-white mb-2 tracking-tight">
                  No Batches Found
                </h3>
                <p className="text-stone-400 text-sm max-w-xs">
                  Try adjusting your search terms or enroll in new batches to see
                  them here.
                </p>
              </div>
            )}
          </main>
        </>
      )}

      {/* WhatsApp Channel Popup on Load */}
      <WhatsAppPopupModal
        isOpen={isWhatsAppPopupOpen}
        onClose={() => setIsWhatsAppPopupOpen(false)}
      />

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        user={user}
        onClose={() => {
          pendingActionRef.current = null;
          setIsLoginOpen(false);
        }}
        onLoginSuccess={handleLoginSuccess}
        onLogout={handleLogout}
      />

      {/* Lecture Player Modal */}
      <LecturePlayerModal
        lecture={activeLectureCtx?.lecture || null}
        subjectName={activeLectureCtx?.subjectName || ''}
        topicName={activeLectureCtx?.topicName || ''}
        isCompleted={
          activeLectureCtx
            ? completedLectureIds.includes(activeLectureCtx.lecture.id)
            : false
        }
        bookmarks={bookmarks}
        onClose={() => setActiveLectureCtx(null)}
        onToggleComplete={handleToggleLectureComplete}
        onOpenPdf={() => {
          if (activeLectureCtx) {
            setActivePdfCtx(activeLectureCtx);
          }
        }}
        onAddBookmark={handleAddBookmark}
        onDeleteBookmark={handleDeleteBookmark}
      />

      {/* PDF Notes Modal */}
      <PdfNotesModal
        lecture={activePdfCtx?.lecture || null}
        batchTitle={activePdfCtx?.batchTitle || ''}
        subjectName={activePdfCtx?.subjectName || ''}
        topicName={activePdfCtx?.topicName || ''}
        onClose={() => setActivePdfCtx(null)}
        onDownloadSuccess={() => showToast('Notes downloaded!', 'success')}
      />
    </div>
  );
}
