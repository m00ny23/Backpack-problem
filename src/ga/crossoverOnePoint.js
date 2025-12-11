/**
 * File: src/ga/crossoverOnePoint.js
 *
 * Purpose:
 *   Implement one-point crossover for binary chromosomes. Two parent
 *   individuals produce two offspring by exchanging gene segments
 *   at a single crossover point.
 *
 * Inputs:
 *   - parent1:
 *       Individual object with `genes` array representing the first parent.
 *   - parent2:
 *       Individual object with `genes` array representing the second parent.
 *   - crossoverRate:
 *       Probability of applying crossover. If crossover does not occur,
 *       offspring are simple copies of the parents.
 *
 * Processing:
 *   - Draw a random number in (0, 1).
 *   - If the draw is greater than `crossoverRate`:
 *       - return two offspring that are clones of `parent1` and `parent2`.
 *   - Else:
 *       - randomly select a crossover index between 1 and genes.length - 1.
 *       - create child1 by taking genes:
 *           - from parent1 up to crossover index,
 *           - from parent2 from crossover index to end.
 *       - create child2 similarly, with parent roles swapped.
 *   - Offspring fitness values are not computed here; they will be evaluated
 *     later by the GA engine.
 *
 * Outputs:
 *   - Returns an array or object containing two new individuals
 *     (child1 and child2) with their respective `genes` arrays set.
 */
