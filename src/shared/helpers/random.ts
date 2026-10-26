export function getRandomInt(min: number, max: number): number {
  return Math.floor(min + Math.random() * (max - min + 1));
}

export function getRandomFloat(min: number, max: number, digits = 1): number {
  return Number((min + Math.random() * (max - min)).toFixed(digits));
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}

export function getRandomItem<T>(items: readonly T[]): T {
  return items[getRandomInt(0, items.length - 1)];
}

export function getRandomItems<T>(items: readonly T[], count = getRandomInt(1, items.length)): T[] {
  const shuffled = [...items];

  for (let i = 0; i < count; i++) {
    const j = getRandomInt(i, shuffled.length - 1);
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, count);
}
