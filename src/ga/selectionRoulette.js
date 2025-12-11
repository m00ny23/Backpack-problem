/**
 * @typedef {Object} Individual
 * @property {number[]} chromosome
 * @property {number} fitness
 */

/**
 * Selekcja ruletkowa (proporcjonalna do fitness).
 *
 * Idea:
 *  - obliczamy sumę fitnessów,
 *  - losujemy liczbę r z [0, suma),
 *  - przechodzimy po populacji sumując fitness,
 *    pierwszy osobnik, dla którego suma >= r, zostaje wybrany.
 *
 * Jeśli wszystkie fitnessy są <= 0, wybieramy osobnika losowego.
 *
 * @param {Individual[]} population
 * @returns {Individual}
 */
export function selectionRoulette(population) {
  if (!population || population.length === 0) {
    throw new Error(
      "Populacja jest pusta – nie można wykonać selekcji ruletkowej."
    );
  }

  // Fitness może być teoretycznie ujemny; dla bezpieczeństwa bierzemy max(fitness, 0)
  const fitnesses = population.map((ind) => Math.max(0, ind.fitness));
  const totalFitness = fitnesses.reduce((sum, f) => sum + f, 0);

  // Brak informacji selekcyjnej (same zera) -> losowy osobnik
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

  // Na wszelki wypadek (zaokrąglenia) zwracamy ostatniego
  return population[population.length - 1];
}
