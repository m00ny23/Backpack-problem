/**
 * File: src/main.js
 *
 * Purpose:
 *   Entry point of the application. Wires together the knapsack problem
 *   instance, genetic algorithm configuration and GA engine, then runs
 *   the evolution and prints the final result.
 *
 * Inputs:
 *   - Configuration imported from `src/config.js` (population size,
 *     number of generations, crossover/mutation rates, etc.).
 *   - Path to the knapsack instance file (either from `config.js`
 *     or from command-line arguments, depending on implementation).
 *   - GA components imported from:
 *       - `src/knapsack/loadInstance.js`
 *       - `src/knapsack/fitnessKnapsack.js`
 *       - `src/ga/runGA.js`
 *       - `src/ga/selection*.js`
 *       - `src/ga/crossover*.js`
 *       - `src/ga/mutation.js`
 *
 * Processing:
 *   - Read configuration and resolve which selection / crossover operator
 *     will be used for this run.
 *   - Load knapsack instance from a text file using `loadInstance`.
 *   - Call `runGA` with:
 *       - problem data (items, capacity),
 *       - GA parameters (population size, max generations, etc.),
 *       - chosen fitness, selection, crossover and mutation functions.
 *   - Handle any runtime errors (e.g., file not found, invalid arguments).
 *
 * Outputs:
 *   - Logs the best solution found by the GA (chromosome, total value,
 *     total weight, final fitness) to the console or another output channel.
 *   - Optionally returns the best individual (for tests or further processing).
 */
