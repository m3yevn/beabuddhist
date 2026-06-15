export const categories = [
  { id: "metta", title: "Metta & Loving-Kindness", order: 1 },
  { id: "mindfulness", title: "Mindfulness", order: 2 },
  { id: "chants", title: "Pali Chants", order: 3 },
];

export const packages = [
  {
    id: "metta-sutta",
    categoryId: "metta",
    title: "Karaniya Metta Sutta",
    description: "Discourse on loving-kindness — classic Theravada chant.",
    coverEmoji: "💛",
    tracks: [
      {
        id: "t1",
        title: "Metta Sutta (chant)",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        durationSec: 180,
      },
    ],
  },
  {
    id: "breath-awareness",
    categoryId: "mindfulness",
    title: "Breath Awareness",
    description: "Guided anapanasati opening for seated practice.",
    coverEmoji: "🌬️",
    tracks: [
      {
        id: "t1",
        title: "Settling the body",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
        durationSec: 120,
      },
      {
        id: "t2",
        title: "Following the breath",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        durationSec: 150,
      },
    ],
  },
  {
    id: "refuge-precepts",
    categoryId: "chants",
    title: "Refuge & Five Precepts",
    description: "Taking refuge and precept recitation.",
    coverEmoji: "☸️",
    tracks: [
      {
        id: "t1",
        title: "Three Refuges",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        durationSec: 90,
      },
      {
        id: "t2",
        title: "Five Precepts",
        audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        durationSec: 110,
      },
    ],
  },
];
