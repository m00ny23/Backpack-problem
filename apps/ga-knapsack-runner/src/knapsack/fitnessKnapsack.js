/**
 * @typedef {Object} KnapsackItem
 * @property {number} value
 * @property {number} weight
 */

/**
 * @typedef {Object} KnapsackInstance
 * @property {number} itemCount
 * @property {number} capacity
 * @property {KnapsackItem[]} items
 */

/**
 * Funkcja przystosowania dla dyskretnego problemu plecakowego.
 *
 * Zasada:
 *  - jeśli suma wag <= pojemność plecaka -> fitness = suma wartości,
 *  - jeśli suma wag > pojemność           -> fitness = 0 (osobnik nieważny).
 *
 * @param {number[]} chromosome           - binarny chromosom (0/1)
 * @param {KnapsackInstance} instance     - opis problemu
 * @returns {number}                      - wartość funkcji przystosowania
 */
export function fitnessKnapsack(chromosome, instance) {
  const { items, capacity } = instance;

  let totalValue = 0;
  let totalWeight = 0;

  const n = Math.min(chromosome.length, items.length);

  for (let i = 0; i < n; i++) {
    const gene = chromosome[i];
    if (gene === 1) {
      totalValue += items[i].value;
      totalWeight += items[i].weight;
    }
  }

  if (totalWeight > capacity) {
    return 0;
  }

  return totalValue;
}
