/**
 * @typedef {Object} Individual
 * @property {number[]} chromosome
 * @property {number} fitness
 */

/**
 * @param {Individual[]} population
 * @returns {Individual}
 */
export function selectionRoulette(population) {
  if (!population || population.length === 0) {
    throw new Error(
      "Populacja jest pusta – nie można wykonać selekcji ruletkowej."
    );
  }

  const fitnesses = population.map((ind) => Math.max(0, ind.fitness));
  const totalFitness = fitnesses.reduce((sum, f) => sum + f, 0);

  if (totalFitness <= 0) {
    const randomIndex = Math.floor(Math.random() * population.length);
    return population[randomIndex];
  }

  const r = Math.random() * totalFitness;
  let cumulative = 0;

  for (let i = 0; i < population.length; i++) {
    cumulative += fitnesses[i];
    if (cumulative >= r) {
      return population[i];
    }
  }

  return population[population.length - 1];
}
