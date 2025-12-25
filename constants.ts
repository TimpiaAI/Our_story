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
    question: "Ce îmi place să fac cel mai mult?",
    options: ["Să stau pe laptop", "Să merg la sală", "Să mănânc", "Să fac de mâncare"],
    correctAnswer: -1, // Hidden answer - none of these, real answer is "Să stau cu tine"
    hiddenAnswer: "Să stau cu tine! 💕",
    wrongMessage: "Haha, te-am păcălit! Răspunsul corect era ascuns!"
  },
  {
    id: 2,
    question: "Unde a fost primul nostru date?",
    options: ["Pe deal", "Pe cetate", "Nu știu, dar erau cartofi cu prea mult piper 🌶️"],
    correctAnswer: 2,
    wrongMessage: "Greșit!"
  },
  {
    id: 3,
    question: "Dacă ar fi să mă descrii, cum m-ai descrie?",
    options: [], // Special drag-and-drop question
    correctAnswer: -2, // Special type indicator
    wrongMessage: "Încearcă din nou!",
    isDragDrop: true,
    goodWords: ["Frumos", "Deștept", "Cel mai bun"],
    badWords: ["Urât", "Prost", "Enervant", "Leneș", "Ciudat"]
  }
];

export const TIMELINE_EVENTS = [
  // Childhood photos - intro
  {
    date: "Cândva...",
    title: "Antonia Micuță",
    icon: "👶",
    image: "/imagini/personal/timeline/antonia_micuta.png",
    desc: "O prințesă mică care avea să-mi fure inima.",
    isPause: false
  },
  {
    date: "Cândva...",
    title: "Ovidiu Micuț",
    icon: "👶",
    image: "/imagini/personal/timeline/ovidiu_micut.png",
    desc: "Un băiețel care nu știa ce-l așteaptă.",
    isPause: false
  },
  // Cronologic 2024
  {
    date: "28 Mai 2024",
    title: "Prima Poză Împreună",
    icon: "📸",
    image: "/imagini/personal/timeline/prima_poza_28mai2024.png",
    desc: "Ziua în care totul a început oficial.",
    isPause: false
  },
  {
    date: "7 Iunie 2024",
    title: "Prima Floare",
    icon: "🌸",
    image: "/imagini/personal/timeline/prima_floare_7_iunie.png",
    desc: "Prima floare pentru cea mai frumoasă floare.",
    isPause: false
  },
  {
    date: "26 Iulie 2024",
    title: "Prima Dată la Ch9",
    icon: "🎉",
    image: "/imagini/personal/timeline/firsttimeatch9_26iulie_2024.png",
    desc: "Aventuri noi, amintiri noi.",
    isPause: false
  },
  {
    date: "4 August 2024",
    title: "După Capace",
    icon: "🎯",
    image: "/imagini/personal/timeline/dupacapace_4august_2024.png",
    desc: "",
    isPause: false
  },
  {
    date: "24 August 2024",
    title: "Drumeție",
    icon: "🥾",
    image: "/imagini/personal/timeline/drumetie_24august2024.png",
    desc: "",
    isPause: false
  },
  {
    date: "23 Noiembrie 2024",
    title: "16 Anișori",
    icon: "🎂",
    image: "/imagini/personal/timeline/16anisori_23nov_2024.png",
    desc: "La mulți ani, prințesa mea!",
    isPause: false
  },
  {
    date: "31 Decembrie 2024",
    title: "Primul Revelion",
    icon: "🎆",
    image: "/imagini/personal/timeline/primul_revelion_31.12.2024.png",
    desc: "Primul An Nou împreună. Primul din multe!",
    isPause: false
  },
  // 2025
  {
    date: "14 Martie 2025",
    title: "#StopDroguri",
    icon: "💪",
    image: "/imagini/personal/timeline/stopdroguri_14_mar_2025.png",
    desc: "",
    isPause: false
  },
  {
    date: "5 Aprilie 2025",
    title: "Alba Iulia",
    icon: "🏰",
    image: "/imagini/personal/timeline/5_aprilie_2025_alba_iulia.png",
    desc: "",
    isPause: false
  },
  {
    date: "23 Aprilie 2025",
    title: "Sighișoara",
    icon: "🏯",
    image: "/imagini/personal/timeline/sighisoara_23_aprilie_2025.png",
    desc: "",
    isPause: false
  },
  // PAUZA 2 - Masă
  {
    date: "...",
    title: "PAUZĂ DE MASĂ!",
    icon: "🍽️",
    image: "/imagini/personal/timeline/pauza2_pauza_de_masa.png",
    desc: "Mâncăm ceva?",
    isPause: true,
    pauseMusic: "/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (10).mp3"
  },
  {
    date: "28 Mai 2025",
    title: "1 AN ÎMPREUNĂ! - Sibiu",
    icon: "🎊",
    image: "/imagini/personal/timeline/28_mai_2025_SBIIU.png",
    desc: "",
    isPause: false
  },
  {
    date: "5 Iulie 2025",
    title: "Mamaia",
    icon: "🏖️",
    image: "/imagini/personal/timeline/mamaia_5_iulie_2025.png",
    desc: "",
    isPause: false
  },
  {
    date: "30 August 2025",
    title: "Corfu Town",
    icon: "🇬🇷",
    image: "/imagini/personal/timeline/corfu_town_30_august_2025.png",
    desc: "",
    isPause: false
  },
  {
    date: "23 Noiembrie 2025",
    title: "17 Anișori",
    icon: "🎂",
    image: "/imagini/personal/timeline/17anisori_23nov_2025.png",
    desc: "La mulți ani din nou, iubirea mea!",
    isPause: false
  },
  {
    date: "12 Decembrie 2025",
    title: "Sushi Maki",
    icon: "🍣",
    image: "/imagini/personal/timeline/sushi_maki_12.12.2025.png",
    desc: "Sushi date cu tine.",
    isPause: false
  },
  {
    date: "Decembrie 2025",
    title: "Aici Erai Fericită",
    icon: "😊",
    image: "/imagini/personal/timeline/aici_erai_fericita_dec_2025.png",
    desc: "Fericirea ta e fericirea mea.",
    isPause: false
  },
  {
    date: "Decembrie 2025",
    title: "Ultima Poză (Deocamdată)",
    icon: "💪",
    image: "/imagini/personal/timeline/spate_puternic_dec_2025_ultima_poza.png",
    desc: "Spate mare!",
    isPause: false
  }
];

// 6 personal photos for memory game (each appears twice for matching)
export const MEMORY_CARDS = [
  { id: 1, content: "/imagini/personal/timeline/prima_poza_28mai2024.png", type: 'prima' },
  { id: 2, content: "/imagini/personal/timeline/prima_poza_28mai2024.png", type: 'prima' },
  { id: 3, content: "/imagini/personal/timeline/prima_floare_7_iunie.png", type: 'floare' },
  { id: 4, content: "/imagini/personal/timeline/prima_floare_7_iunie.png", type: 'floare' },
  { id: 5, content: "/imagini/personal/timeline/drumetie_24august2024.png", type: 'drumetie' },
  { id: 6, content: "/imagini/personal/timeline/drumetie_24august2024.png", type: 'drumetie' },
  { id: 7, content: "/imagini/personal/timeline/primul_revelion_31.12.2024.png", type: 'revelion' },
  { id: 8, content: "/imagini/personal/timeline/primul_revelion_31.12.2024.png", type: 'revelion' },
  { id: 9, content: "/imagini/personal/timeline/5_aprilie_2025_alba_iulia.png", type: 'alba' },
  { id: 10, content: "/imagini/personal/timeline/5_aprilie_2025_alba_iulia.png", type: 'alba' },
  { id: 11, content: "/imagini/personal/timeline/corfu_town_30_august_2025.png", type: 'corfu' },
  { id: 12, content: "/imagini/personal/timeline/corfu_town_30_august_2025.png", type: 'corfu' },
];

export const BATTLE_MOVES = [
  { name: "Îmbrățișare", dmg: 15, color: "bg-green-500" },
  { name: "Pupic Dulce", dmg: 20, color: "bg-pink-500" },
  { name: "Ciocolată", dmg: 25, color: "bg-yellow-600" },
  { name: "Scuze", dmg: 10, color: "bg-blue-500" },
];

// Personal photos for boss fight scene
export const BATTLE_PHOTOS = [
  "/imagini/personal/timeline/prima_poza_28mai2024.png",
  "/imagini/personal/timeline/16anisori_23nov_2024.png",
  "/imagini/personal/timeline/28_mai_2025_SBIIU.png",
  "/imagini/personal/timeline/mamaia_5_iulie_2025.png",
  "/imagini/personal/timeline/17anisori_23nov_2025.png",
  "/imagini/personal/timeline/aici_erai_fericita_dec_2025.png"
];