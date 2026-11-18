export type BatchCategory =
  | 'police'
  | 'ssc'
  | 'railway'
  | 'defence'
  | 'board'
  | 'state';

export type AppView = 'new' | 'wishlist' | 'batch-detail';

export interface BatchItem {
  id: string;
  title: string;
  thumbnail: string;
  fallbackThumbnail: string;
  category: BatchCategory;
}

export interface LectureSlide {
  timeSec: number;
  heading: string;
  keyPoints: string[];
  formula?: string;
  exampleProblem?: {
    question: string;
    solution: string;
  };
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface StudyNoteSection {
  title: string;
  bullets: string[];
  formulaBox?: string;
}

export interface LectureItem {
  id: string;
  index: number;
  title: string;
  durationSec: number;
  recordedDate: string;
  thumbnail: string;
  instructor: string;
  summary: string;
  slides: LectureSlide[];
  noteSections: StudyNoteSection[];
  quiz: QuizQuestion[];
}

export interface TopicFolder {
  id: string;
  name: string;
  lectureCount: number;
  description: string;
  lectures: LectureItem[];
}

export interface SubjectFolder {
  id: string;
  name: string;
  faculty: string;
  topicCount: number;
  lectureCount: number;
  topics: TopicFolder[];
}

export interface UserSession {
  name: string;
  phone: string;
  token: string;
  userid: string;
}

export interface LectureBookmark {
  id: string;
  lectureId: string;
  timeSec: number;
  note: string;
  createdAt: string;
}

export interface ToastNotice {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info';
}
