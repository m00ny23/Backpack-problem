/**
 * Mutacja bitowa chromosomu binarnego.
 *
 * Dla każdego genu:
 *  - z prawdopodobieństwem mutationRate bit jest odwracany (0 -> 1, 1 -> 0).
 *
 * @param {number[]} chromosome
 * @param {number} mutationRate  - prawdopodobieństwo mutacji pojedynczego genu (0..1)
 * @returns {number[]} nowy, zmutowany chromosom
 */
export function mutation(chromosome, mutationRate) {
  const mutated = [...chromosome];

  for (let i = 0; i < mutated.length; i++) {
    if (Math.random() < mutationRate) {
      mutated[i] = mutated[i] === 1 ? 0 : 1;
    }
  }

  return mutated;
}
