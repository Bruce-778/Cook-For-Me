export function easeStarsForDifficulty(difficulty: number) {
  const value = Math.max(1, Math.min(5, Math.round(difficulty)));
  return value === 5 ? 0 : 6 - value;
}
