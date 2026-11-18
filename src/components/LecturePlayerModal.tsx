import { useEffect, useState, type FormEvent } from 'react';
import {
  Bookmark,
  CheckCircle2,
  FileText,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
  Trash2,
  X,
} from 'lucide-react';
import type { LectureBookmark, LectureItem } from '../types/portal';
import { BrandLogo } from './BrandLogo';

interface LecturePlayerModalProps {
  lecture: LectureItem | null;
  subjectName: string;
  topicName: string;
  isCompleted: boolean;
  bookmarks: LectureBookmark[];
  onClose: () => void;
  onToggleComplete: (lectureId: string) => void;
  onOpenPdf: () => void;
  onAddBookmark: (lectureId: string, timeSec: number, note: string) => void;
  onDeleteBookmark: (bookmarkId: string) => void;
}

const SPEEDS = [0.75, 1, 1.25, 1.5, 2];

function formatClock(sec: number): string {
  const safe = Math.max(0, Math.floor(sec));
  const mins = Math.floor(safe / 60);
  const rem = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(rem).padStart(2, '0')}`;
}

export function LecturePlayerModal({
  lecture,
  subjectName,
  topicName,
  isCompleted,
  bookmarks,
  onClose,
  onToggleComplete,
  onOpenPdf,
  onAddBookmark,
  onDeleteBookmark,
}: LecturePlayerModalProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [speedIndex, setSpeedIndex] = useState(1);
  const [sideTab, setSideTab] = useState<'notes' | 'quiz' | 'bookmarks'>('notes');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [bookmarkInput, setBookmarkInput] = useState('');

  useEffect(() => {
    if (!lecture) return;
    setCurrentTime(0);
    setIsPlaying(true);
    setSelectedAnswers({});
    setSideTab('notes');
  }, [lecture]);

  useEffect(() => {
    if (!lecture || !isPlaying) return;
    const rate = SPEEDS[speedIndex];
    const interval = window.setInterval(() => {
      setCurrentTime((prev) => {
        const next = prev + rate;
        if (next >= lecture.durationSec) {
          setIsPlaying(false);
          return lecture.durationSec;
        }
        return next;
      });
    }, 1000);
    return () => window.clearInterval(interval);
  }, [lecture, isPlaying, speedIndex]);

  if (!lecture) return null;

  const activeSlide =
    [...lecture.slides]
      .reverse()
      .find((slide) => currentTime >= slide.timeSec) || lecture.slides[0];

  const lectureBookmarks = bookmarks.filter((b) => b.lectureId === lecture.id);

  const handleSaveBookmark = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = bookmarkInput.trim();
    if (!trimmed) return;
    onAddBookmark(lecture.id, Math.floor(currentTime), trimmed);
    setBookmarkInput('');
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={lecture.title}
    >
      <div className="modal-surface w-full max-w-6xl rounded-3xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Top Header */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo className="w-9 h-9 rounded-lg" />
            <div className="min-w-0">
              <div className="text-xs text-stone-400 truncate">
                <span className="text-purple-300 font-semibold">{subjectName}</span>
                <span className="mx-1.5" aria-hidden="true">
                  /
                </span>
                <span>{topicName}</span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white truncate">
                {lecture.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={onOpenPdf}
              className="px-3.5 py-2 rounded-xl bg-amber-400/12 hover:bg-amber-400/22 border border-amber-400/35 text-amber-300 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <FileText className="w-3.5 h-3.5" />
              Notes PDF
            </button>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close lecture player"
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Two-Zone Classroom Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 flex-1 overflow-y-auto">
          {/* Left Zone: Interactive Study Board & Controls */}
          <div className="lg:col-span-8 p-5 sm:p-6 flex flex-col justify-between gap-5 border-b lg:border-b-0 lg:border-r border-white/[0.08]">
            {/* Chalkboard Slide Stage */}
            <div className="rounded-2xl bg-[#0c0714] border border-purple-500/20 p-6 sm:p-8 flex-1 flex flex-col justify-between min-h-[320px]">
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-400 mb-4 tabular-nums">
                  <span>Instructor: {lecture.instructor}</span>
                  <span>
                    Chapter {lecture.slides.indexOf(activeSlide) + 1} of{' '}
                    {lecture.slides.length}
                  </span>
                </div>

                <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white mb-5">
                  {activeSlide.heading}
                </h3>

                {activeSlide.formula && (
                  <div className="mb-5 rounded-xl bg-purple-500/10 border border-purple-400/30 px-4 py-3 font-mono text-sm text-purple-200 overflow-x-auto">
                    {activeSlide.formula}
                  </div>
                )}

                <ul className="space-y-3 text-sm sm:text-[15px] text-stone-200 leading-relaxed">
                  {activeSlide.keyPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="font-mono text-xs text-purple-400 font-bold mt-1">
                        0{idx + 1}.
                      </span>
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>

                {activeSlide.exampleProblem && (
                  <div className="mt-5 rounded-xl bg-white/[0.04] border border-white/10 p-4 space-y-2">
                    <div className="text-xs font-bold text-amber-300">
                      Solved Exam Problem
                    </div>
                    <p className="text-sm font-semibold text-white">
                      {activeSlide.exampleProblem.question}
                    </p>
                    <p className="text-sm text-stone-300 leading-relaxed">
                      {activeSlide.exampleProblem.solution}
                    </p>
                  </div>
                )}
              </div>

              {/* Chapter Jump Tabs */}
              <div className="mt-6 pt-4 border-t border-white/[0.08] flex flex-wrap gap-2">
                {lecture.slides.map((slide, idx) => {
                  const isCurrent = slide === activeSlide;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCurrentTime(slide.timeSec)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap ${
                        isCurrent
                          ? 'bg-purple-600 text-white'
                          : 'bg-white/5 text-stone-400 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <span className="font-mono mr-1.5 opacity-80 tabular-nums">
                        {formatClock(slide.timeSec)}
                      </span>
                      {idx === 0
                        ? 'Concepts'
                        : idx === 1
                          ? 'Worked Example'
                          : 'Revision'}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Playback Transport Bar */}
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-stone-300 tabular-nums w-12">
                  {formatClock(currentTime)}
                </span>
                <input
                  type="range"
                  min={0}
                  max={lecture.durationSec}
                  value={Math.floor(currentTime)}
                  onChange={(e) => setCurrentTime(Number(e.target.value))}
                  aria-label="Lecture progress timeline"
                  className="flex-1 accent-purple-500 h-1.5 bg-white/15 rounded-lg cursor-pointer"
                />
                <span className="font-mono text-xs text-stone-400 tabular-nums w-12 text-right">
                  {formatClock(lecture.durationSec)}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentTime((t) => Math.max(0, t - 15))}
                    aria-label="Rewind 15 seconds"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 transition-colors"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsPlaying((p) => !p)}
                    className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-2 transition-colors"
                  >
                    {isPlaying ? (
                      <>
                        <Pause className="w-4 h-4" />
                        Pause
                      </>
                    ) : (
                      <>
                        <Play className="w-4 h-4 fill-current" />
                        Play
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setCurrentTime((t) => Math.min(lecture.durationSec, t + 15))
                    }
                    aria-label="Forward 15 seconds"
                    className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-stone-200 transition-colors"
                  >
                    <RotateCw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setSpeedIndex((idx) => (idx + 1) % SPEEDS.length)}
                    className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-xs font-bold text-stone-200 tabular-nums transition-colors"
                  >
                    {SPEEDS[speedIndex]}x
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onToggleComplete(lecture.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors whitespace-nowrap ${
                    isCompleted
                      ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/35'
                      : 'bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200'
                  }`}
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {isCompleted ? 'Completed' : 'Mark Completed'}
                </button>
              </div>
            </div>
          </div>

          {/* Right Zone: Study Companion Panel */}
          <div className="lg:col-span-4 p-5 flex flex-col gap-4 bg-[#0f0817]">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
              {(
                [
                  { id: 'notes', label: 'Summary' },
                  { id: 'quiz', label: 'Quick Quiz' },
                  { id: 'bookmarks', label: `Notes (${lectureBookmarks.length})` },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSideTab(tab.id)}
                  className={`flex-1 py-2 px-2 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                    sideTab === tab.id
                      ? 'bg-purple-600 text-white'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {sideTab === 'notes' && (
              <div className="space-y-4 text-sm text-stone-300 overflow-y-auto">
                <div>
                  <h4 className="font-bold text-white mb-1.5">Topic Overview</h4>
                  <p className="text-xs text-stone-400 leading-relaxed">
                    {lecture.summary}
                  </p>
                </div>

                {lecture.noteSections.map((sec, idx) => (
                  <div
                    key={idx}
                    className="rounded-xl bg-white/[0.03] border border-white/[0.07] p-3.5 space-y-2"
                  >
                    <h5 className="text-xs font-bold text-purple-300">
                      {sec.title}
                    </h5>
                    <ul className="space-y-1.5 text-xs text-stone-300 leading-relaxed">
                      {sec.bullets.map((b, bIdx) => (
                        <li key={bIdx}>• {b}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {sideTab === 'quiz' && (
              <div className="space-y-4 overflow-y-auto">
                {lecture.quiz.map((q) => {
                  const chosen = selectedAnswers[q.id];
                  const answered = chosen !== undefined;
                  return (
                    <div
                      key={q.id}
                      className="rounded-xl bg-white/[0.03] border border-white/[0.08] p-4 space-y-3"
                    >
                      <p className="text-sm font-semibold text-white leading-snug">
                        {q.question}
                      </p>
                      <div className="space-y-2">
                        {q.options.map((opt, idx) => {
                          const isSelected = chosen === idx;
                          const isCorrect = idx === q.correctIndex;
                          let style =
                            'bg-white/[0.03] border-white/10 text-stone-200 hover:border-purple-400/50';
                          if (answered) {
                            if (isCorrect) {
                              style =
                                'bg-emerald-500/15 border-emerald-400/50 text-emerald-200';
                            } else if (isSelected) {
                              style = 'bg-red-500/15 border-red-400/50 text-red-200';
                            }
                          }
                          return (
                            <button
                              key={idx}
                              type="button"
                              onClick={() =>
                                setSelectedAnswers((prev) => ({
                                  ...prev,
                                  [q.id]: idx,
                                }))
                              }
                              className={`w-full text-left px-3.5 py-2.5 rounded-xl border text-xs font-medium transition-colors ${style}`}
                            >
                              {String.fromCharCode(65 + idx)}. {opt}
                            </button>
                          );
                        })}
                      </div>
                      {answered && (
                        <div className="text-xs text-stone-300 bg-black/30 rounded-xl p-3 border border-white/[0.06] leading-relaxed">
                          <span className="font-bold text-purple-300">
                            {chosen === q.correctIndex ? 'Correct: ' : 'Explanation: '}
                          </span>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {sideTab === 'bookmarks' && (
              <div className="flex flex-col flex-1 gap-3 overflow-y-auto">
                <form onSubmit={handleSaveBookmark} className="space-y-2">
                  <textarea
                    rows={2}
                    value={bookmarkInput}
                    onChange={(e) => setBookmarkInput(e.target.value)}
                    placeholder={`Add a study note at ${formatClock(currentTime)}...`}
                    className="w-full rounded-xl bg-black/45 border border-white/10 p-3 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-purple-400 resize-none"
                  />
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    Save Timestamp Note ({formatClock(currentTime)})
                  </button>
                </form>

                {lectureBookmarks.length === 0 ? (
                  <p className="text-xs text-stone-500 text-center py-6">
                    No bookmarks saved for this lecture yet.
                  </p>
                ) : (
                  <div className="space-y-2">
                    {lectureBookmarks.map((bm) => (
                      <div
                        key={bm.id}
                        className="rounded-xl bg-white/[0.04] border border-white/[0.08] p-3 flex items-start justify-between gap-2"
                      >
                        <button
                          type="button"
                          onClick={() => setCurrentTime(bm.timeSec)}
                          className="text-left min-w-0 flex-1"
                        >
                          <span className="font-mono text-[11px] text-purple-300 font-bold tabular-nums">
                            {formatClock(bm.timeSec)}
                          </span>
                          <p className="text-xs text-stone-200 mt-0.5 leading-relaxed">
                            {bm.note}
                          </p>
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteBookmark(bm.id)}
                          aria-label="Delete note"
                          className="text-stone-500 hover:text-red-400 p-1 transition-colors shrink-0"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
