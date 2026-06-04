export interface Lesson {
  id: string;
  title: string;
  description: string;
  level: string; // e.g., 'A1', 'A2'
}

export interface Phrase {
  italian: string;
  spanish: string;
}

export interface LevelContent {
  id: string;
  title: string;
  phrases: Phrase[];
  explanation?: string;
  subSections?: {
    label: string;
    items: string[];
  }[];
  groups?: {
    label: string;
    subSections: { label: string; items: string[] }[];
  }[];
  dialogue?: {
    personA: string;
    personB: string;
    personA_content: string;
    personB_content: string;
  }[];
}

export interface Exercise {
  id: string;
  lessonId: string;
  subtopic?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  tip: string;
}

export interface VocabularyItem {
  id: string;
  word: string;
  translation: string;
  example: string;
  category: string;
  usageTip: string;
  extraExamples: string[];
}
