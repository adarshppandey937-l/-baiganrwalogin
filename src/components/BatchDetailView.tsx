import { useMemo, useState } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  ChevronRight,
  Clock,
  FileText,
  FolderKanban,
  Home,
  Play,
  PlaySquare,
} from 'lucide-react';
import { BRAND_FULL, getBatchCurriculum } from '../data/batches';
import type {
  BatchItem,
  LectureItem,
  SubjectFolder,
  TopicFolder,
} from '../types/portal';
import { BrandLogo } from './BrandLogo';

interface BatchDetailViewProps {
  batch: BatchItem;
  onBackToBatches: () => void;
  onPlayLecture: (
    lecture: LectureItem,
    subjectName: string,
    topicName: string
  ) => void;
  onOpenPdf: (
    lecture: LectureItem,
    subjectName: string,
    topicName: string
  ) => void;
}

export function BatchDetailView({
  batch,
  onBackToBatches,
  onPlayLecture,
  onOpenPdf,
}: BatchDetailViewProps) {
  const subjects = useMemo(() => getBatchCurriculum(batch), [batch]);
  const [selectedSubject, setSelectedSubject] = useState<SubjectFolder | null>(
    null
  );
  const [selectedTopic, setSelectedTopic] = useState<TopicFolder | null>(null);

  const handleBack = () => {
    if (selectedTopic) {
      setSelectedTopic(null);
    } else if (selectedSubject) {
      setSelectedSubject(null);
    } else {
      onBackToBatches();
    }
  };

  const sectionTitle = selectedTopic
    ? selectedTopic.name
    : selectedSubject
      ? selectedSubject.name
      : 'Subjects & Folders';

  const countLabel = selectedTopic
    ? `${selectedTopic.lectures.length} ${selectedTopic.lectures.length === 1 ? 'Lecture' : 'Lectures'}`
    : selectedSubject
      ? `${selectedSubject.topics.length} ${selectedSubject.topics.length === 1 ? 'Topic' : 'Topics'}`
      : `${subjects.length} ${subjects.length === 1 ? 'Subject' : 'Subjects'}`;

  return (
    <div className="flex-1 flex flex-col">
      {/* Top Navigation mirroring content.html with PANDEY JI Portal + User Photo */}
      <header className="nav-glass sticky top-0 z-50 h-[72px]">
        <div className="max-w-[90rem] mx-auto px-4 sm:px-6 h-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            <button
              type="button"
              onClick={handleBack}
              aria-label="Go back"
              className="text-stone-300 hover:text-white btn-click-effect w-10 h-10 rounded-xl bg-white/5 hover:bg-[#a855f7]/20 border border-white/10 hover:border-[#a855f7]/40 flex items-center justify-center shrink-0 transition-all shadow-sm"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <BrandLogo className="w-10 h-10 rounded-xl shrink-0" />

            <div className="truncate">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#c084fc] block">
                {BRAND_FULL} Portal
              </span>
              <h1 className="text-base sm:text-xl font-black text-white font-syne truncate drop-shadow-sm">
                {batch.title}
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={onBackToBatches}
            className="shrink-0 text-xs sm:text-sm font-bold px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#a855f7]/40 text-stone-200 hover:text-white transition-all flex items-center gap-2 btn-click-effect shadow-sm"
          >
            <Home className="w-4 h-4 text-[#c084fc]" />
            <span className="hidden sm:inline">All Batches</span>
          </button>
        </div>
      </header>

      <main className="flex-1 w-full max-w-[90rem] mx-auto px-4 sm:px-6 pt-7 pb-16">
        {/* Breadcrumb & Status Bar */}
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4 bg-[#130a1c]/80 backdrop-blur-md px-5 py-3.5 rounded-2xl border border-white/5 shadow-inner">
          <div className="flex items-center gap-2.5 text-sm font-bold text-stone-300">
            <FolderKanban className="w-4 h-4 text-[#a855f7]" />
            <span className="tracking-wide text-white">{sectionTitle}</span>
          </div>
          <span className="text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-lg bg-[#a855f7]/15 text-[#c084fc] border border-[#a855f7]/30 tabular-nums">
            {countLabel}
          </span>
        </div>

        {/* Level 1: Subjects */}
        {!selectedSubject && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {subjects.map((subj) => (
              <div
                key={subj.id}
                onClick={() => setSelectedSubject(subj)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedSubject(subj);
                  }
                }}
                className="premium-card p-4 rounded-2xl cursor-pointer flex items-center justify-between gap-3.5 group btn-click-effect"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a855f7]/25 to-purple-900/30 border border-[#a855f7]/30 text-[#c084fc] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <FolderKanban className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-[15px] font-bold text-stone-100 group-hover:text-[#c084fc] transition-colors line-clamp-2 leading-snug">
                      {subj.name}
                    </h3>
                    <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1 mt-0.5">
                      Tap to explore
                      <ChevronRight className="w-3 h-3 text-[#a855f7]" />
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#a855f7] text-stone-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Level 2: Topics */}
        {selectedSubject && !selectedTopic && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {selectedSubject.topics.map((topic) => (
              <div
                key={topic.id}
                onClick={() => setSelectedTopic(topic)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setSelectedTopic(topic);
                  }
                }}
                className="premium-card p-4 rounded-2xl cursor-pointer flex items-center justify-between gap-3.5 group btn-click-effect"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#a855f7]/25 to-purple-900/30 border border-[#a855f7]/30 text-[#c084fc] flex items-center justify-center shrink-0 shadow-inner group-hover:scale-110 transition-transform">
                    <PlaySquare className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-[15px] font-bold text-stone-100 group-hover:text-[#c084fc] transition-colors line-clamp-2 leading-snug">
                      {topic.name}
                    </h3>
                    <span className="text-[11px] font-medium text-stone-400 flex items-center gap-1 mt-0.5">
                      Tap to explore
                      <ChevronRight className="w-3 h-3 text-[#a855f7]" />
                    </span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-[#a855f7] text-stone-400 group-hover:text-white flex items-center justify-center shrink-0 transition-all">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Level 3: Lectures */}
        {selectedSubject && selectedTopic && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {selectedTopic.lectures.map((video) => {
              const durationMin = `${Math.floor(video.durationSec / 60)}m`;
              return (
                <div
                  key={video.id}
                  className="premium-card rounded-[20px] overflow-hidden flex flex-col group"
                >
                  <div
                    onClick={() =>
                      onPlayLecture(
                        video,
                        selectedSubject.name,
                        selectedTopic.name
                      )
                    }
                    className="relative w-full aspect-video bg-[#09050d] overflow-hidden cursor-pointer"
                  >
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#130a1c] via-black/20 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-12 h-12 rounded-full bg-[#a855f7] text-white flex items-center justify-center shadow-[0_0_25px_rgba(168,85,247,0.9)]">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>
                    <span className="absolute top-3 left-3 bg-black/70 backdrop-blur-md border border-white/10 text-[#c084fc] text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-lg">
                      #{video.index}
                    </span>
                    <span className="absolute bottom-2.5 right-2.5 bg-black/80 backdrop-blur-md border border-white/10 text-stone-200 text-[11px] font-bold px-2.5 py-0.5 rounded-md flex items-center gap-1 tabular-nums">
                      <Clock className="w-3 h-3 text-[#a855f7]" />
                      {durationMin}
                    </span>
                  </div>

                  <div className="p-4 sm:p-5 flex flex-col flex-1">
                    <h3 className="text-sm sm:text-[15px] font-bold text-stone-100 group-hover:text-[#c084fc] transition-colors line-clamp-2 leading-snug mb-2">
                      {video.title}
                    </h3>
                    <p className="text-[11px] text-stone-400 font-medium flex items-center gap-1.5 mb-5">
                      <Calendar className="w-3.5 h-3.5 text-[#a855f7]" />
                      {video.recordedDate}
                    </p>

                    <div className="mt-auto pt-3.5 border-t border-white/5 flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() =>
                          onPlayLecture(
                            video,
                            selectedSubject.name,
                            selectedTopic.name
                          )
                        }
                        className="flex-1 bg-gradient-to-r from-[#a855f7] to-purple-600 hover:opacity-95 text-white py-2.5 px-4 rounded-xl transition-all flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider shadow-[0_4px_15px_rgba(168,85,247,0.35)] btn-click-effect whitespace-nowrap"
                      >
                        <Play className="w-4 h-4 fill-current" />
                        Play Video
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          onOpenPdf(
                            video,
                            selectedSubject.name,
                            selectedTopic.name
                          )
                        }
                        className="bg-[#FACC15]/10 hover:bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/30 py-2.5 px-3.5 rounded-xl transition-all flex items-center justify-center gap-1.5 text-xs font-extrabold tracking-wide btn-click-effect shrink-0 shadow-sm"
                      >
                        <FileText className="w-4 h-4" />
                        PDF
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
