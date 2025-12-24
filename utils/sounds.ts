// Sound effects utility

// All goofy sound effect files (31 total)
const GOOFY_SOUNDS = [
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (1).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (2).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (3).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (4).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (5).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (6).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (7).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (8).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (9).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (10).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (11).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (12).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (13).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (14).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (15).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (16).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (17).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (18).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (19).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (20).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (21).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (22).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (23).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (24).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (25).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (26).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (27).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (28).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net) (29).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects (mp3cut.net).mp3',
  '/sfx/random_funny_sfx/all goofy ahh sound effects.mp3',
];

// Play a random goofy sound effect (max 2 seconds)
export const playGoofySound = (volume = 0.5) => {
  const randomIndex = Math.floor(Math.random() * GOOFY_SOUNDS.length);
  const audio = new Audio(GOOFY_SOUNDS[randomIndex]);
  audio.volume = volume;
  audio.play().catch(() => {});
  // Stop after max 2 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 2000);
};

// Play button sound - 50% chance bell, 50% chance goofy
export const playButtonSound = () => {
  if (Math.random() < 0.5) {
    playGoofySound(0.5);
  } else {
    const audio = new Audio('/sfx/bell_button.mp3');
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }
};

// Standard sound effects
export const playKissSound = () => {
  const audio = new Audio('/sfx/Kiss Sound Effect.mp3');
  audio.volume = 0.7;
  audio.play().catch(() => {});
};

export const playHitSound = () => {
  // 40% chance goofy hit sound
  if (Math.random() < 0.4) {
    playGoofySound(0.8);
  } else {
    const audio = new Audio('/sfx/hit.mp3');
    audio.volume = 1.0; // Max volume
    audio.play().catch(() => {});
  }
};

// Extra loud hit sound for boss fight using Web Audio API gain
export const playHitSoundLoud = () => {
  // 40% chance goofy hit sound
  if (Math.random() < 0.4) {
    playGoofySound(1.0);
  } else {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    fetch('/sfx/hit.mp3')
      .then(response => response.arrayBuffer())
      .then(buffer => audioContext.decodeAudioData(buffer))
      .then(audioBuffer => {
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        source.buffer = audioBuffer;
        gainNode.gain.value = 3.0; // 3x louder than normal
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        source.start(0);
      })
      .catch(() => {
        // Fallback to regular audio
        const audio = new Audio('/sfx/hit.mp3');
        audio.volume = 1.0;
        audio.play().catch(() => {});
      });
  }
};

export const playDaSauNuSound = () => {
  const audio = new Audio('/sfx/da_sau_nu.mp3');
  audio.volume = 1.0;
  audio.play().catch(() => {});
};

export const playDaSound = () => {
  const audio = new Audio('/sfx/da.mp3');
  audio.volume = 1.0;
  audio.play().catch(() => {});
};

export const playKOSound = () => {
  const audio = new Audio('/sfx/KO.mp3');
  audio.volume = 0.8;
  audio.play().catch(() => {});
};

export const playCorrectSound = () => {
  const audio = new Audio('/sfx/correct.mp3');
  audio.volume = 0.6;
  audio.play().catch(() => {});
};

export const playAngrySound = () => {
  const audio = new Audio('/sfx/angrh.mp3');
  audio.volume = 1.0;
  audio.play().catch(() => {});
};

export const playAwwSound = () => {
  const audio = new Audio('/sfx/aww.mp3');
  audio.volume = 1.0;
  audio.play().catch(() => {});
};

export const playClappingSound = () => {
  const audio = new Audio('/sfx/calpping.mp3');
  audio.volume = 1.0; // Max volume
  audio.play().catch(() => {});
  // Stop after 3 seconds
  setTimeout(() => {
    audio.pause();
    audio.currentTime = 0;
  }, 3000);
};

export const playWrongSound = () => {
  // Always play goofy sound for wrong answers
  playGoofySound(0.6);
  // Also play the wrong sound after a tiny delay
  setTimeout(() => {
    const audio = new Audio('/sfx/wrong.mp3');
    audio.volume = 0.4;
    audio.play().catch(() => {});
  }, 200);
};
