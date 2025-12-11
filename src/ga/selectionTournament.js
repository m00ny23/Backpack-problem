/**
 * File: src/ga/selectionTournament.js
 *
 * Purpose:
 *   Implement tournament selection. Parents are chosen by repeatedly
 *   running small "tournaments" among randomly sampled individuals.
 *
 * Inputs:
 *   - population:
 *       Array of individuals with numeric `fitness` property.
 *   - selectionCount:
 *       Number of individuals to select for the mating pool.
 *   - tournamentSize:
 *       Number of individuals participating in each tournament (k).
 *
 * Processing:
 *   - Repeat until `selectionCount` individuals are selected:
 *       - randomly sample `tournamentSize` individuals from the population,
 *       - find the individual with the highest fitness among the sampled group,
 *       - add that individual (or a copy) to the mating pool.
 *   - Sampling method (with or without replacement) may be chosen depending
 *     on the desired behavior, but must be consistent within the function.
 *
 * Outputs:
 *   - Returns an array of selected individuals for the mating pool,
 *     where each entry is the winner of one tournament.
 */
