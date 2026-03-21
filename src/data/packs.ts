import type { ExercisePack, Exercise } from "@/types";

export const exercisePacks: ExercisePack[] = [
  {
    id: "r-starter",
    name: "R Sound Starter",
    description:
      "Master the tricky R sound with fun words like rabbit, carrot, and star. The most common sound kids work on!",
    soundTarget: "/r/",
    price: 0,
    exerciseCount: 15,
    levels: ["word"],
    positions: ["initial", "medial", "final"],
    isFree: true,
    color: "#ef4444",
    icon: "🐰",
  },
  {
    id: "s-starter",
    name: "S Sound Starter",
    description:
      "Practice the S sound with silly words like snake, castle, and bus. Great for lisps!",
    soundTarget: "/s/",
    price: 0,
    exerciseCount: 15,
    levels: ["word"],
    positions: ["initial", "medial", "final"],
    isFree: true,
    color: "#22c55e",
    icon: "🐍",
  },
  {
    id: "r-advanced",
    name: "R Sound Pro Pack",
    description:
      "Level up your R sound with phrases and sentences. Includes R-blends like 'tree', 'green', and 'truck'.",
    soundTarget: "/r/",
    price: 499,
    exerciseCount: 40,
    levels: ["word", "phrase", "sentence"],
    positions: ["initial", "medial", "final"],
    isFree: false,
    color: "#ef4444",
    icon: "🚀",
  },
  {
    id: "s-advanced",
    name: "S Sound Pro Pack",
    description:
      "Advanced S practice with S-blends like 'stop', 'smile', and 'snow'. Phrases and sentences included.",
    soundTarget: "/s/",
    price: 499,
    exerciseCount: 40,
    levels: ["word", "phrase", "sentence"],
    positions: ["initial", "medial", "final"],
    isFree: false,
    color: "#22c55e",
    icon: "⭐",
  },
  {
    id: "l-starter",
    name: "L Sound Starter",
    description:
      "Practice the L sound with lovely words like lion, balloon, and bell.",
    soundTarget: "/l/",
    price: 499,
    exerciseCount: 30,
    levels: ["word", "phrase"],
    positions: ["initial", "medial", "final"],
    isFree: false,
    color: "#3b82f6",
    icon: "🦁",
  },
  {
    id: "th-starter",
    name: "TH Sound Pack",
    description:
      "Tongue-out fun! Practice both voiced and voiceless TH with words like 'thumb', 'feather', and 'bath'.",
    soundTarget: "/th/",
    price: 499,
    exerciseCount: 30,
    levels: ["word", "phrase"],
    positions: ["initial", "medial", "final"],
    isFree: false,
    color: "#a855f7",
    icon: "👅",
  },
  {
    id: "sh-starter",
    name: "SH Sound Pack",
    description:
      "Shhhh! Practice the SH sound with words like 'ship', 'fishing', and 'brush'.",
    soundTarget: "/sh/",
    price: 499,
    exerciseCount: 30,
    levels: ["word", "phrase"],
    positions: ["initial", "medial", "final"],
    isFree: false,
    color: "#f59e0b",
    icon: "🚢",
  },
];

export const exercises: Exercise[] = [
  // === R STARTER (FREE) ===
  // Initial /r/
  { id: "r-s-01", packId: "r-starter", soundTarget: "/r/", position: "initial", level: "word", prompt: "Say: rabbit", targetWord: "rabbit", hint: "Curl your tongue back — don't let it touch the roof of your mouth!", imageUrl: "/images/rabbit.svg" },
  { id: "r-s-02", packId: "r-starter", soundTarget: "/r/", position: "initial", level: "word", prompt: "Say: rain", targetWord: "rain", hint: "Start with your tongue pulled back, then let the sound flow out." },
  { id: "r-s-03", packId: "r-starter", soundTarget: "/r/", position: "initial", level: "word", prompt: "Say: red", targetWord: "red", hint: "Curl your tongue back like you're growling — rrrred!" },
  { id: "r-s-04", packId: "r-starter", soundTarget: "/r/", position: "initial", level: "word", prompt: "Say: robot", targetWord: "robot", hint: "Think of a robot voice — strong R at the start!" },
  { id: "r-s-05", packId: "r-starter", soundTarget: "/r/", position: "initial", level: "word", prompt: "Say: rocket", targetWord: "rocket", hint: "Blast off! Strong R sound, tongue curled back." },
  // Medial /r/
  { id: "r-s-06", packId: "r-starter", soundTarget: "/r/", position: "medial", level: "word", prompt: "Say: carrot", targetWord: "carrot", hint: "The R is in the middle — keep your tongue curled for that middle part." },
  { id: "r-s-07", packId: "r-starter", soundTarget: "/r/", position: "medial", level: "word", prompt: "Say: parrot", targetWord: "parrot", hint: "Like the bird! Hold the R sound nice and strong in the middle." },
  { id: "r-s-08", packId: "r-starter", soundTarget: "/r/", position: "medial", level: "word", prompt: "Say: orange", targetWord: "orange", hint: "The R sneaks in after the O — curl that tongue!" },
  { id: "r-s-09", packId: "r-starter", soundTarget: "/r/", position: "medial", level: "word", prompt: "Say: berry", targetWord: "berry", hint: "Yummy! Hold the R nice and strong in the middle." },
  { id: "r-s-10", packId: "r-starter", soundTarget: "/r/", position: "medial", level: "word", prompt: "Say: fairy", targetWord: "fairy", hint: "A magical word! Let the R sound ring out." },
  // Final /r/
  { id: "r-s-11", packId: "r-starter", soundTarget: "/r/", position: "final", level: "word", prompt: "Say: star", targetWord: "star", hint: "End with your tongue curled back — starrr!" },
  { id: "r-s-12", packId: "r-starter", soundTarget: "/r/", position: "final", level: "word", prompt: "Say: car", targetWord: "car", hint: "Vroom! Hold that R at the end — carrr!" },
  { id: "r-s-13", packId: "r-starter", soundTarget: "/r/", position: "final", level: "word", prompt: "Say: door", targetWord: "door", hint: "Open the door to a great R sound at the end!" },
  { id: "r-s-14", packId: "r-starter", soundTarget: "/r/", position: "final", level: "word", prompt: "Say: tiger", targetWord: "tiger", hint: "Roar like a tiger! Strong R at the end." },
  { id: "r-s-15", packId: "r-starter", soundTarget: "/r/", position: "final", level: "word", prompt: "Say: dinosaur", targetWord: "dinosaur", hint: "A big word for a big R sound at the end!" },

  // === S STARTER (FREE) ===
  // Initial /s/
  { id: "s-s-01", packId: "s-starter", soundTarget: "/s/", position: "initial", level: "word", prompt: "Say: snake", targetWord: "snake", hint: "Hissss! Keep your tongue behind your top teeth." },
  { id: "s-s-02", packId: "s-starter", soundTarget: "/s/", position: "initial", level: "word", prompt: "Say: sun", targetWord: "sun", hint: "Smile and let the air flow over your tongue — ssssun!" },
  { id: "s-s-03", packId: "s-starter", soundTarget: "/s/", position: "initial", level: "word", prompt: "Say: sock", targetWord: "sock", hint: "Keep your teeth close together and blow air through — sssock!" },
  { id: "s-s-04", packId: "s-starter", soundTarget: "/s/", position: "initial", level: "word", prompt: "Say: seven", targetWord: "seven", hint: "Keep the S nice and sharp — tongue behind your teeth!" },
  { id: "s-s-05", packId: "s-starter", soundTarget: "/s/", position: "initial", level: "word", prompt: "Say: silly", targetWord: "silly", hint: "Be silly! Strong S at the start." },
  // Medial /s/
  { id: "s-s-06", packId: "s-starter", soundTarget: "/s/", position: "medial", level: "word", prompt: "Say: castle", targetWord: "castle", hint: "The S hides in the middle — keep it crisp!" },
  { id: "s-s-07", packId: "s-starter", soundTarget: "/s/", position: "medial", level: "word", prompt: "Say: missing", targetWord: "missing", hint: "Double S in the middle — ssss!" },
  { id: "s-s-08", packId: "s-starter", soundTarget: "/s/", position: "medial", level: "word", prompt: "Say: icy", targetWord: "icy", hint: "Brrr! The S sound is cold and crisp in the middle." },
  { id: "s-s-09", packId: "s-starter", soundTarget: "/s/", position: "medial", level: "word", prompt: "Say: messy", targetWord: "messy", hint: "Keep that middle S clean even if the word isn't!" },
  { id: "s-s-10", packId: "s-starter", soundTarget: "/s/", position: "medial", level: "word", prompt: "Say: dinosaur", targetWord: "dinosaur", hint: "The S sneaks in — can you find it?" },
  // Final /s/
  { id: "s-s-11", packId: "s-starter", soundTarget: "/s/", position: "final", level: "word", prompt: "Say: bus", targetWord: "bus", hint: "End with a strong hiss — busss!" },
  { id: "s-s-12", packId: "s-starter", soundTarget: "/s/", position: "final", level: "word", prompt: "Say: house", targetWord: "house", hint: "The S at the end should be crisp and clear." },
  { id: "s-s-13", packId: "s-starter", soundTarget: "/s/", position: "final", level: "word", prompt: "Say: ice", targetWord: "ice", hint: "Nice and icy — hold that S at the end!" },
  { id: "s-s-14", packId: "s-starter", soundTarget: "/s/", position: "final", level: "word", prompt: "Say: dress", targetWord: "dress", hint: "End with a sharp S — tongue behind your teeth!" },
  { id: "s-s-15", packId: "s-starter", soundTarget: "/s/", position: "final", level: "word", prompt: "Say: mouse", targetWord: "mouse", hint: "Quiet as a mouse — but make that S loud!" },
];

export function getPackExercises(packId: string): Exercise[] {
  return exercises.filter((e) => e.packId === packId);
}

export function getFreePacks(): ExercisePack[] {
  return exercisePacks.filter((p) => p.isFree);
}

export function getPaidPacks(): ExercisePack[] {
  return exercisePacks.filter((p) => !p.isFree);
}
