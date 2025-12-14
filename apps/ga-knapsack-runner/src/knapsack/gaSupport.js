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
 * @param {KnapsackInstance} instance
 * @returns {(chromosomeLength: number) => number[]}
 */
export function makeFeasibleChromosomeFn(instance) {
  const { itemCount, items, capacity } = instance;

  return function createFeasibleChromosome(chromosomeLength) {
    const n = Math.min(chromosomeLength, itemCount);
    const chromosome = new Array(chromosomeLength).fill(0);

    let remainingCapacity = capacity;

    const indices = [];
    for (let i = 0; i < n; i++) {
      indices.push(i);
    }

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = indices[i];
      indices[i] = indices[j];
      indices[j] = tmp;
    }

    for (const idx of indices) {
      const item = items[idx];
      if (!item) continue;

      if (item.weight <= remainingCapacity && Math.random() < 0.5) {
        chromosome[idx] = 1;
        remainingCapacity -= item.weight;
      }
    }

    return chromosome;
  };
}

/**
 * @param {KnapsackInstance} instance
 * @returns {(chromosome: number[]) => number[]}
 */
export function makeRepairFn(instance) {
  const { items, capacity } = instance;
  const n = items.length;

  return function repairChromosome(chromosome) {
    const repaired = [...chromosome];

    let totalWeight = 0;
    const len = Math.min(repaired.length, n);

    for (let i = 0; i < len; i++) {
      if (repaired[i] === 1) {
        totalWeight += items[i].weight;
      }
    }

    if (totalWeight <= capacity) {
      return repaired;
    }

    const selected = [];
    for (let i = 0; i < len; i++) {
      if (repaired[i] === 1) {
        const w = items[i].weight;
        const v = items[i].value;
        const ratio = v / w;
        selected.push({ index: i, ratio });
      }
    }

    selected.sort((a, b) => a.ratio - b.ratio);

    for (const { index } of selected) {
      if (totalWeight <= capacity) break;
      repaired[index] = 0;
      totalWeight -= items[index].weight;
    }

    if (totalWeight > capacity) {
      const ones = [];
      for (let i = 0; i < len; i++) {
        if (repaired[i] === 1) ones.push(i);
      }
      while (totalWeight > capacity && ones.length > 0) {
        const rIndex = Math.floor(Math.random() * ones.length);
        const geneIndex = ones[rIndex];
        ones.splice(rIndex, 1);
        repaired[geneIndex] = 0;
        totalWeight -= items[geneIndex].weight;
      }
    }

    return repaired;
  };
}
