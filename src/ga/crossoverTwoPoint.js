/**
 * File: src/ga/crossoverTwoPoint.js
 *
 * Purpose:
 *   Implement two-point crossover for binary chromosomes. Two crossover
 *   points are selected and the gene segment between them is swapped
 *   between parents to produce offspring.
 *
 * Inputs:
 *   - parent1:
 *       Individual object with `genes` array for the first parent.
 *   - parent2:
 *       Individual object with `genes` array for the second parent.
 *   - crossoverRate:
 *       Probability of applying crossover.
 *
 * Processing:
 *   - Draw a random number in (0, 1).
 *   - If the draw is greater than `crossoverRate`:
 *       - return two offspring as simple copies of the parents.
 *   - Else:
 *       - randomly select two distinct cut points within the gene index range.
 *       - ensure cut1 < cut2 (swap if needed).
 *       - build child1 genes from:
 *           - parent1 genes before cut1,
 *           - parent2 genes between cut1 and cut2,
 *           - parent1 genes after cut2.
 *       - build child2 in the symmetric way (swap parent roles).
 *   - Fitness of children is not computed here.
 *
 * Outputs:
 *   - Returns two offspring individuals with newly constructed gene arrays.
 */
