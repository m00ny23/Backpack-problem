/**
 * File: src/config.js
 *
 * Purpose:
 *   Central place for all configurable parameters of the genetic algorithm
 *   and knapsack problem run. Makes it easy to tweak settings without
 *   modifying the main logic.
 *
 * Inputs:
 *   - No runtime inputs. This file defines constants / configuration values
 *     that can be edited by the developer or read by other modules.
 *
 * Processing:
 *   - Declare an object containing configuration parameters, for example:
 *       - populationSize
 *       - maxGenerations
 *       - crossoverRate
 *       - mutationRate
 *       - elitismCount
 *       - default selection type ("roulette", "ranking", "tournament")
 *       - default crossover type ("onePoint", "twoPoint")
 *       - default path to the knapsack data file
 *   - Optionally allow overrides, e.g. from environment variables
 *     or command-line arguments (depending on design).
 *
 * Outputs:
 *   - Exports a configuration object used by `main.js` and potentially
 *     by `runGA.js` or other modules.
 */
