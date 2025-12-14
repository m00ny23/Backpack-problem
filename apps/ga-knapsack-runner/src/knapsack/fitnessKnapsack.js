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
 * @param {number[]} chromosome
 * @param {KnapsackInstance} instance
 * @returns {number}
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
