/**
 * File: src/utils/random.js
 *
 * Purpose:
 *   Provide utility functions for random number generation and random
 *   operations on arrays, so that randomness is handled consistently
 *   across the project.
 *
 * Inputs:
 *   - Function parameters depending on the utility:
 *       - numeric ranges for integer/float generation,
 *       - arrays for sampling or shuffling.
 *
 * Processing:
 *   - Implement helpers such as:
 *       - `randomFloat(min, max)`:
 *           returns a random floating-point number in [min, max).
 *       - `randomInt(min, max)`:
 *           returns a random integer in [min, max] or [min, max),
 *           depending on the chosen convention, documented in the function.
 *       - `randomChoice(array)`:
 *           returns a random element from the given array.
 *       - `shuffle(array)`:
 *           returns a shuffled copy of the array or shuffles it in-place.
 *
 * Outputs:
 *   - Exports these random utility functions so other modules (selection,
 *     crossover, mutation, etc.) can use them instead of duplicating logic.
 */
