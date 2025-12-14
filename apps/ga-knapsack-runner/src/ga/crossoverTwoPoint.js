import { crossoverOnePoint } from "./crossoverOnePoint.js";

/**
 * @param {number[]} parent1
 * @param {number[]} parent2
 * @returns {[number[], number[]]}
 */
export function crossoverTwoPoint(parent1, parent2) {
  const length = Math.min(parent1.length, parent2.length);

  if (length < 3) {
    return crossoverOnePoint(parent1, parent2);
  }

  const k1 = 1 + Math.floor(Math.random() * (length - 2));
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
