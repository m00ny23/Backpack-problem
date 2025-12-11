/**
 * File: src/ga/selectionRoulette.js
 *
 * Purpose:
 *   Implement roulette-wheel selection (fitness-proportional selection)
 *   for choosing parents from a population based on their fitness.
 *
 * Inputs:
 *   - population:
 *       Array of individuals, each with at least a numeric `fitness` property.
 *   - selectionCount:
 *       Number of individuals to select for the mating pool (typically equal
 *       to population size or another required count).
 *
 * Processing:
 *   - Compute the total sum of fitness values in the population.
 *   - For each individual, compute a selection probability:
 *         p_i = fitness_i / totalFitness.
 *   - Build a cumulative probability array (roulette wheel).
 *   - Repeat until `selectionCount` individuals are chosen:
 *       - draw a random number in (0, 1),
 *       - find the first individual whose cumulative probability is >= draw,
 *       - add that individual (or a copy) to the mating pool.
 *   - If totalFitness is zero (e.g., all individuals have fitness 0),
 *     fall back to a uniform random selection among all individuals.
 *
 * Outputs:
 *   - Returns an array of selected individuals (mating pool),
 *     possibly containing duplicates (better individuals may be picked
 *     multiple times).
 */
