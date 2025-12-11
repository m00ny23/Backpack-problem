/**
 * File: src/ga/mutation.js
 *
 * Purpose:
 *   Implement mutation for binary chromosomes. Mutation introduces random
 *   changes into individuals by flipping some bits, providing new genetic
 *   material and helping the GA explore the search space.
 *
 * Inputs:
 *   - individual:
 *       Individual object with a `genes` array consisting of 0/1 values.
 *   - mutationRate:
 *       Probability of mutating a single gene.
 *
 * Processing:
 *   - For each gene in the individual's `genes` array:
 *       - draw a random number in (0, 1),
 *       - if the draw is less than `mutationRate`, flip the bit:
 *           - if gene is 0, change to 1,
 *           - if gene is 1, change to 0.
 *   - Mutation typically operates in-place on the given individual.
 *   - Fitness is not recalculated here; it will be recomputed by the GA
 *     after mutation is applied.
 *
 * Outputs:
 *   - Returns the mutated individual (or modifies it in-place and optionally
 *     returns the same reference).
 */
