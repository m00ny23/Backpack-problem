/**
 * File: src/knapsack/fitnessKnapsack.js
 *
 * Purpose:
 *   Provide the fitness function for the 0-1 knapsack problem, used
 *   by the genetic algorithm to evaluate how good a given individual is.
 *
 * Inputs:
 *   - individual:
 *       An object representing a single solution candidate, expected to contain:
 *         - genes: an array of 0/1 values (one bit per item).
 *   - items:
 *       An array of `{ value, weight }` objects describing each item.
 *   - capacity:
 *       A number representing the maximum allowed total weight.
 *
 * Processing:
 *   - Compute totalWeight = sum(weights of all selected items).
 *   - Compute totalValue = sum(values of all selected items).
 *   - If totalWeight exceeds capacity:
 *       - assign a fitness of 0 (or a very small penalty value).
 *   - Otherwise:
 *       - assign a strictly positive fitness increasing with totalValue.
 *       - Optionally, slightly reward better usage of capacity
 *         (e.g., lower remaining free capacity).
 *
 * Outputs:
 *   - Returns a non-negative numeric fitness score:
 *       - higher value => better solution.
 */
