/**
 * @typedef {Object} Individual
 * @property {number[]} chromosome
 * @property {number} fitness
 */

/**
 * @param {number} tournamentSize
 * @returns {(population: Individual[]) => Individual}
 */
export function createTournamentSelection(tournamentSize = 3) {
  if (!Number.isFinite(tournamentSize) || tournamentSize <= 0) {
    throw new Error("tournamentSize musi być dodatnią liczbą całkowitą.");
  }

  /**
   * @param {Individual[]} population
   * @returns {Individual}
   */
  function selectionTournament(population) {
    if (!population || population.length === 0) {
      throw new Error(
        "Populacja jest pusta – nie można wykonać selekcji turniejowej."
      );
    }

    const n = population.length;
    const k = Math.min(n, tournamentSize);

    let best = null;

    for (let i = 0; i < k; i++) {
      const idx = Math.floor(Math.random() * n);
      const candidate = population[idx];

      if (best === null || candidate.fitness > best.fitness) {
        best = candidate;
      }
    }

    return best;
  }

  return selectionTournament;
}
