/**
 * Jednopunktowy operator krzyżowania.
 *
 * Dla dwóch rodziców o długości L:
 *  - losujemy punkt k z zakresu [1, L-1],
 *  - dziecko1 = [p1[0..k-1], p2[k..L-1]]
 *  - dziecko2 = [p2[0..k-1], p1[k..L-1]]
 *
 * Jeśli chromosom ma długość < 2, zwracamy tylko kopie rodziców.
 *
 * @param {number[]} parent1
 * @param {number[]} parent2
 * @returns {[number[], number[]]} para chromosomów potomnych
 */
export function crossoverOnePoint(parent1, parent2) {
  const length = Math.min(parent1.length, parent2.length);

  // brak sensownego punktu krzyżowania -> tylko kopiujemy
  if (length < 2) {
    return [[...parent1], [...parent2]];
  }

  const point = 1 + Math.floor(Math.random() * (length - 1));

  const child1 = [...parent1.slice(0, point), ...parent2.slice(point, length)];

  const child2 = [...parent2.slice(0, point), ...parent1.slice(point, length)];

  return [child1, child2];
}
