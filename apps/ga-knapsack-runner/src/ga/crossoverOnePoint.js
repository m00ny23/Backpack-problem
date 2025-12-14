/**
 * @param {number[]} parent1
 * @param {number[]} parent2
 * @returns {[number[], number[]]}
 */
export function crossoverOnePoint(parent1, parent2) {
  const length = Math.min(parent1.length, parent2.length);

  if (length < 2) {
    return [[...parent1], [...parent2]];
  }

  const point = 1 + Math.floor(Math.random() * (length - 1));

  const child1 = [...parent1.slice(0, point), ...parent2.slice(point, length)];

  const child2 = [...parent2.slice(0, point), ...parent1.slice(point, length)];

  return [child1, child2];
}
