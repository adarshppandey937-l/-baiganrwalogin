import { Download, Printer, X } from 'lucide-react';
import { BRAND_FULL } from '../data/batches';
import type { LectureItem } from '../types/portal';
import { BrandLogo } from './BrandLogo';

interface PdfNotesModalProps {
  lecture: LectureItem | null;
  batchTitle: string;
  subjectName: string;
  topicName: string;
  onClose: () => void;
  onDownloadSuccess: () => void;
}

export function PdfNotesModal({
  lecture,
  batchTitle,
  subjectName,
  topicName,
  onClose,
  onDownloadSuccess,
}: PdfNotesModalProps) {
  if (!lecture) return null;

  const handleDownloadNotes = () => {
    const lines = [
      `${BRAND_FULL} — REVISION NOTES SHEET`,
      `========================================`,
      `Batch: ${batchTitle}`,
      `Subject: ${subjectName}`,
      `Topic: ${topicName}`,
      `Lecture: ${lecture.title}`,
      `Instructor: ${lecture.instructor}`,
      `Date: ${lecture.recordedDate}`,
      ``,
      ...lecture.noteSections.flatMap((sec) => [
        sec.title.toUpperCase(),
        ...(sec.formulaBox ? [`Formula: ${sec.formulaBox}`] : []),
        ...sec.bullets.map((b) => `- ${b}`),
        ``,
      ]),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `PANDEY_JI_${lecture.id}_Notes.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    onDownloadSuccess();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={`Study Notes for ${lecture.title}`}
    >
      <div className="modal-surface w-full max-w-3xl rounded-3xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/[0.08] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <BrandLogo className="w-10 h-10 rounded-xl" />
            <div className="min-w-0">
              <div className="text-xs text-stone-400 truncate">
                <span className="text-purple-300 font-semibold">{BRAND_FULL} Notes</span>
                <span className="mx-1.5" aria-hidden="true">
                  ·
                </span>
                <span>{subjectName}</span>
              </div>
              <h2 className="font-display text-base sm:text-lg font-bold text-white truncate">
                {lecture.title}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleDownloadNotes}
              className="px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Download Notes
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-stone-200 text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              Print
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close notes viewer"
              className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Document Sheet */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="pb-4 border-b border-white/[0.08]">
            <div className="text-xs text-stone-400 mb-1">
              {batchTitle} · {topicName} · {lecture.instructor}
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-extrabold text-white">
              {lecture.title}
            </h3>
          </div>

          {lecture.noteSections.map((section, idx) => (
            <div
              key={idx}
              className="rounded-2xl bg-[#0e0817] border border-white/[0.08] p-5 space-y-3"
            >
              <h4 className="font-display text-base font-bold text-white">
                0{idx + 1}. {section.title}
              </h4>

              {section.formulaBox && (
                <div className="rounded-xl bg-purple-500/10 border border-purple-400/30 px-4 py-3 font-mono text-sm text-purple-200 overflow-x-auto">
                  {section.formulaBox}
                </div>
              )}

              <ul className="space-y-2 text-sm text-stone-300 leading-relaxed">
                {section.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-2.5">
                    <span className="text-purple-400 font-bold">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
