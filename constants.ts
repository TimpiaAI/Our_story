import { QuizQuestion } from './types';

// CONFIGURATION
export const PARTNER_NAME = "Antonia"; 
export const START_DATE = "2024-05-25";
export const END_DATE = "2025-12-25";

export const calculateDaysTogether = () => {
  const start = new Date(START_DATE);
  const end = new Date(END_DATE);
  const diffTime = Math.abs(end.getTime() - start.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  return diffDays;
};

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: "Unde ne place nouă să mergem cel mai des?",
    options: ["La film", "În parc", "La restaurantul nostru", "Pe lună"],
    correctAnswer: 2,
    wrongMessage: "Eroare! Nu mai ții minte? Pedeapsă: Un pupic!"
  },
  {
    id: 2,
    question: "Care este culoarea mea preferată când mă gândesc la tine?",
    options: ["Albastru", "Roșu Aprins", "Verde", "Gri"],
    correctAnswer: 1,
    wrongMessage: "Nu! Gândește-te la inima mea! Pedeapsă: O îmbrățișare!"
  },
  {
    id: 3,
    question: "Cât de mult te iubesc?",
    options: ["Până la cer", "Infinit", "Ca pe sarmale", "Toate de mai sus"],
    correctAnswer: 3,
    wrongMessage: "Răspuns incorect! De fapt, te iubesc și mai mult. Pedeapsă: Spune 'Te iubesc'!"
  }
];

export const TIMELINE_EVENTS = [
  { 
    date: "25 Mai 2024", 
    title: "Începutul", 
    icon: "🌱",
    image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop", 
    desc: "Ziua în care totul s-a schimbat în bine."
  },
  { 
    date: "31 Dec 2024", 
    title: "Primul Revelion", 
    icon: "🎆",
    image: "https://images.unsplash.com/photo-1467810563316-b5476525c0f9?q=80&w=400&auto=format&fit=crop", 
    desc: "Noaptea dintre ani, prima dintre multele."
  },
  { 
    date: "25 Dec 2025", 
    title: "Crăciun Împreună", 
    icon: "🎄",
    image: "https://images.unsplash.com/photo-1544967082-d9d25d867d66?q=80&w=400&auto=format&fit=crop", 
    desc: "Sărbători magice alături de tine, Antonia."
  },
  { 
    date: "Viitor", 
    title: "Pentru totdeauna", 
    icon: "💍",
    image: "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=400&auto=format&fit=crop", 
    desc: "Urmează o viață întreagă de aventuri."
  }
];

export const MEMORY_CARDS = [
  { id: 1, content: "🍕", type: 'pizza' },
  { id: 2, content: "🍕", type: 'pizza' },
  { id: 3, content: "🐱", type: 'cat' },
  { id: 4, content: "🐱", type: 'cat' },
  { id: 5, content: "🎬", type: 'movie' },
  { id: 6, content: "🎬", type: 'movie' },
  { id: 7, content: "✈️", type: 'travel' },
  { id: 8, content: "✈️", type: 'travel' },
  { id: 9, content: "❤️", type: 'heart' },
  { id: 10, content: "❤️", type: 'heart' },
  { id: 11, content: "🏠", type: 'home' },
  { id: 12, content: "🏠", type: 'home' },
];

export const BATTLE_MOVES = [
  { name: "Îmbrățișare", dmg: 15, color: "bg-green-500" },
  { name: "Pupic Dulce", dmg: 20, color: "bg-pink-500" },
  { name: "Ciocolată", dmg: 25, color: "bg-yellow-600" },
  { name: "Scuze", dmg: 10, color: "bg-blue-500" },
];

export const BATTLE_PHOTOS = [
  "https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=150&h=150&fit=crop",
  "https://images.unsplash.com/photo-1621600411688-4be93cd68504?w=150&h=150&fit=crop"
];