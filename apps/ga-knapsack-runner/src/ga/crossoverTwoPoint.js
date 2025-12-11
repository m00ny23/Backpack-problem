import { crossoverOnePoint } from "./crossoverOnePoint.js";

/**
 * Dwupunktowy operator krzyżowania.
 *
 * Dla dwóch rodziców o długości L:
 *  - losujemy dwa punkty k1, k2 (1 <= k1 < k2 <= L-1),
 *  - w przedziale [k1, k2) wymieniamy fragmenty chromosomów.
 *
 * Jeśli długość < 3, zamiast kombinować używamy krzyżowania jednopunktowego.
 *
 * @param {number[]} parent1
 * @param {number[]} parent2
 * @returns {[number[], number[]]} para chromosomów potomnych
 */
export function crossoverTwoPoint(parent1, parent2) {
  const length = Math.min(parent1.length, parent2.length);

  if (length < 3) {
    // brak miejsca na dwa różne punkty -> fallback na jedno punkt
    return crossoverOnePoint(parent1, parent2);
  }

  // k1 w [1, length - 2]
  const k1 = 1 + Math.floor(Math.random() * (length - 2));
  // k2 w [k1 + 1, length - 1]
  const k2 = k1 + 1 + Math.floor(Math.random() * (length - k1 - 1));

  const child1 = [
    ...parent1.slice(0, k1),
    ...parent2.slice(k1, k2),
    ...parent1.slice(k2, length),
  ];

  const child2 = [
    ...parent2.slice(0, k1),
    ...parent1.slice(k1, k2),
    ...parent2.slice(k2, length),
  ];

  return [child1, child2];
}
