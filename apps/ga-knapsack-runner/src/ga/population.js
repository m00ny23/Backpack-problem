/**
 * File: src/ga/population.js
 *
 * Purpose:
 *   Create and manage populations of individuals for the genetic algorithm,
 *   including initial random population generation and common helper
 *   operations on populations.
 *
 * Inputs:
 *   - populationSize:
 *       Requested number of individuals in the population.
 *   - geneCount:
 *       Number of genes per individual (typically equal to the number of items).
 *   - items:
 *       Knapsack items data (array of `{ value, weight }`).
 *   - capacity:
 *       Knapsack capacity.
 *   - fitnessFn:
 *       A function that computes fitness for a given individual.
 *
 * Processing:
 *   - Generate the initial population:
 *       - For each individual, create a random 0/1 gene array of length geneCount.
 *       - Optionally repair overweight individuals by switching some 1s to 0s
 *         until the weight constraint is satisfied.
 *       - Evaluate fitness using `fitnessFn` and store it in the individual.
 *   - Provide helper utilities, for example:
 *       - evaluating fitness for all individuals in a population,
 *       - finding the best individual (highest fitness),
 *       - cloning individuals (for elitism or safe copying).
 *
 * Outputs:
 *   - Returns a population: an array of individuals, where each individual
 *     at least contains:
 *       - genes: array<number>
 *       - fitness: number
 *   - Exposes helper functions to work with populations, which may be
 *     imported and used by `runGA.js`.
 */
