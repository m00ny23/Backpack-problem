/**
 * File: src/ga/selectionRanking.js
 *
 * Purpose:
 *   Implement ranking selection for the genetic algorithm. Individuals
 *   are sorted by fitness and assigned selection probabilities based
 *   on their rank rather than their absolute fitness values.
 *
 * Inputs:
 *   - population:
 *       Array of individuals with numeric `fitness` property.
 *   - selectionCount:
 *       Number of individuals to select for the mating pool.
 *   - params (optional):
 *       Object describing how probabilities depend on rank
 *       (e.g., linear ranking parameter).
 *
 * Processing:
 *   - Sort the population by fitness in descending order (best first).
 *   - Assign each individual a rank (1 for best, 2 for second-best, etc.).
 *   - Compute selection probabilities from ranks, for example using
 *     a chosen linear or other ranking formula.
 *   - Build cumulative probabilities over the ranked individuals.
 *   - Repeat until `selectionCount` individuals are chosen:
 *       - draw a random number in (0, 1),
 *       - select an individual according to the cumulative distribution.
 *
 * Outputs:
 *   - Returns an array of individuals chosen as parents according to
 *     ranking selection.
 */
