/**
 * File: src/knapsack/loadInstance.js
 *
 * Purpose:
 *   Load a 0-1 knapsack problem instance from a text file
 *   in the specified "low-dimensional" format.
 *
 * Inputs:
 *   - A path or handle to a text file containing the knapsack instance.
 *   - Expected format:
 *       Line 1:  "<n> <C>"
 *                n  - number of items
 *                C  - knapsack capacity
 *       Next n lines: "<value_i> <weight_i>"
 *                value_i  - profit/value of item i
 *                weight_i - weight of item i
 *
 * Processing:
 *   - Read the entire file as text.
 *   - Parse the first line to extract:
 *       - number of items (n)
 *       - capacity (C)
 *   - For each of the next n lines:
 *       - split the line into value and weight
 *       - convert them to numbers
 *       - store as `{ value, weight }` in an array.
 *   - Optionally validate:
 *       - correct number of item lines,
 *       - non-negative weights and values,
 *       - sensible capacity.
 *
 * Outputs:
 *   - Returns an object describing the instance, e.g.:
 *       {
 *         capacity: <number>,
 *         items: [ { value: <number>, weight: <number> }, ... ]
 *       }
 *   - Optionally also returns `itemCount` (n), which should match
 *     `items.length`.
 */
