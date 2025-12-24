export enum GameLevel {
  HERO = 'HERO',
  MEETING = 'MEETING', // Nivelul nou cu banca
  TIMELINE = 'TIMELINE',
  MEMORY = 'MEMORY',
  QUIZ = 'QUIZ',
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