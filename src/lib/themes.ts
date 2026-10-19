// Pick the mood by changing HERO_MOOD below: "deep" | "balanced" | "fresh"
export const HERO_MOODS = {
  // Dark, calm green with little photo (what you have now)
  deep: ["rgba(31,94,74,0.82)", "rgba(47,125,98,0.70)"],
  // Brighter green, photo clearly visible
  balanced: ["rgba(20,110,80,0.74)", "rgba(40,160,115,0.42)"],
  // Lightest and freshest, photo shows the most
  fresh: ["rgba(79, 172, 139, 0.7)", "rgba(60,200,140,0.28)"],
} as const;

export const HERO_MOOD: keyof typeof HERO_MOODS = "balanced";

// Strong tint on one side keeps white text readable, and the light side lets the photo show through
export function heroBackground(angle = 135) {
  const [strong, light] = HERO_MOODS[HERO_MOOD];
  return `linear-gradient(${angle}deg, ${strong}, ${light}), url('/images/hero.jpg'), linear-gradient(${angle}deg, #1f5e4a, #2f7d62)`;
}