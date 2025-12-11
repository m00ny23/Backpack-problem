/**
 * File: src/ga/runGA.js
 *
 * Purpose:
 *   Implement the main genetic algorithm loop: initialize a population,
 *   repeatedly apply selection, crossover and mutation, evaluate new
 *   generations, and track the best solution found.
 *
 * Inputs:
 *   - params:
 *       An object containing:
 *         - populationSize
 *         - maxGenerations
 *         - crossoverRate
 *         - mutationRate
 *         - elitismCount
 *         - items (knapsack items array)
 *         - capacity (knapsack capacity)
 *         - fitnessFn (fitness function)
 *         - selectionFn (selection strategy: roulette, ranking, tournament)
 *         - crossoverFn (crossover operator: one- or two-point)
 *         - mutationFn (mutation operator)
 *
 * Processing:
 *   - Create an initial population using helper functions from `population.js`.
 *   - Evaluate fitness of all individuals.
 *   - Initialize a variable to store the best individual found so far.
 *   - For each generation from 1 to maxGenerations:
 *       - apply `selectionFn` to choose parents (mating pool),
 *       - repeatedly apply `crossoverFn` to parents to produce offspring,
 *       - apply `mutationFn` to each offspring,
 *       - compute fitness for each offspring using `fitnessFn`,
 *       - apply elitism:
 *           - copy a fixed number of best individuals from the old population
 *             directly into the new population,
 *           - fill the remaining slots with offspring,
 *       - update the "best so far" individual if a better one is found.
 *   - When the stopping condition is met (e.g., maxGenerations reached),
 *     terminate the evolution.
 *
 * Outputs:
 *   - Returns an object describing the best individual found, which may include:
 *       - genes (0/1 array),
 *       - fitness,
 *       - total value and total weight (optional),
 *       - generation at which it was found (optional).
 *   - This result is used by `main.js` to display final output.
 */
