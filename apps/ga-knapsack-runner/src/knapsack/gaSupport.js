// src/knapsack/gaSupport.js

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
 * Tworzy funkcję generującą losowy, dopuszczalny chromosom
 * dla zadanej instancji plecaka.
 *
 * Strategia:
 *  - zaczynamy od samych zer,
 *  - bierzemy losową permutację indeksów przedmiotów,
 *  - po kolei próbujemy je dodać, jeśli się jeszcze mieszczą w plecaku
 *    (i z pewnym prawdopodobieństwem, żeby zachować różnorodność).
 *
 * Dzięki temu każdy osobnik spełnia ograniczenie wagi.
 *
 * @param {KnapsackInstance} instance
 * @returns {(chromosomeLength: number) => number[]} funkcja tworząca chromosom
 */
export function makeFeasibleChromosomeFn(instance) {
  const { itemCount, items, capacity } = instance;

  return function createFeasibleChromosome(chromosomeLength) {
    const n = Math.min(chromosomeLength, itemCount);
    const chromosome = new Array(chromosomeLength).fill(0);

    let remainingCapacity = capacity;

    // indeksy 0..n-1
    const indices = [];
    for (let i = 0; i < n; i++) {
      indices.push(i);
    }

    // tasowanie Fisher-Yates
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
 * Tworzy funkcję naprawiającą chromosom:
 *  - jeśli suma wag <= capacity -> zwraca chromosom (kopię),
 *  - jeśli suma wag > capacity -> usuwa kolejne przedmioty o NAJGORSZYM
 *    stosunku value/weight, aż waga spadnie poniżej capacity.
 *
 * Dzięki temu populacja pozostaje w całości dopuszczalna,
 * a funkcja przystosowania może pozostać taka, jak w zadaniu.
 *
 * @param {KnapsackInstance} instance
 * @returns {(chromosome: number[]) => number[]} funkcja naprawy chromosomu
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

    // zbierz wybrane przedmioty razem z value/weight
    const selected = [];
    for (let i = 0; i < len; i++) {
      if (repaired[i] === 1) {
        const w = items[i].weight;
        const v = items[i].value;
        const ratio = v / w;
        selected.push({ index: i, ratio });
      }
    }

    // sort rosnąco po ratio (najgorszy jako pierwszy do wyrzucenia)
    selected.sort((a, b) => a.ratio - b.ratio);

    for (const { index } of selected) {
      if (totalWeight <= capacity) break;
      repaired[index] = 0;
      totalWeight -= items[index].weight;
    }

    // awaryjnie, gdyby coś poszło nie tak (np. dziwne dane)
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
