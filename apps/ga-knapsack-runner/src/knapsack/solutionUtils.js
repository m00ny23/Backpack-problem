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
 * Dekoduje chromosom binarny jako rozwiązanie problemu plecakowego:
 *  - liczy sumaryczną wartość,
 *  - liczy sumaryczną wagę,
 *  - zbiera indeksy wybranych przedmiotów.
 *
 * @param {number[]} chromosome
 * @param {KnapsackInstance} instance
 */
export function decodeKnapsackSolution(chromosome, instance) {
  const { items, capacity } = instance;

  let totalValue = 0;
  let totalWeight = 0;
  const chosenItems = [];

  const n = Math.min(chromosome.length, items.length);

  for (let i = 0; i < n; i++) {
    if (chromosome[i] === 1) {
      totalValue += items[i].value;
      totalWeight += items[i].weight;
      chosenItems.push(i); // indeksy od 0
    }
  }

  return {
    totalValue,
    totalWeight,
    capacity,
    chosenItems,
  };
}
