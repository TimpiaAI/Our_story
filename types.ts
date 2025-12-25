export enum GameLevel {
  HERO = 'HERO',
  MEETING = 'MEETING', // Nivelul nou cu banca
  TIMELINE = 'TIMELINE',
  LOVE_SLIDER = 'LOVE_SLIDER', // Slider cu cat de mult te iubesc
  MEMORY = 'MEMORY',
  QUIZ = 'QUIZ',
  LOVE_REASONS = 'LOVE_REASONS', // Te iubesc pentru că...
  BOSS = 'BOSS',
  LETTER = 'LETTER'
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct answer
  wrongMessage: string;
}

// Global declaration for canvas-confetti
declare global {
  interface Window {
    confetti: any;
  }
}