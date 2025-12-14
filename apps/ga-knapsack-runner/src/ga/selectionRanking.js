/**
 * @typedef {Object} Individual
 * @property {number[]} chromosome
 * @property {number} fitness
 */

/**
 * @param {Individual[]} population
 * @returns {Individual}
 */
export function selectionRanking(population) {
  if (!population || population.length === 0) {
    throw new Error(
      "Populacja jest pusta – nie można wykonać selekcji rankingowej."
    );
  }

  const sorted = [...population].sort((a, b) => a.fitness - b.fitness);
  const n = sorted.length;

  const totalRank = (n * (n + 1)) / 2;

  const r = Math.random() * totalRank;
  let cumulative = 0;

  for (let i = 0; i < n; i++) {
    const rank = i + 1;
    cumulative += rank;
    if (cumulative >= r) {
      return sorted[i];
    }
  }

  return sorted[n - 1];
}
