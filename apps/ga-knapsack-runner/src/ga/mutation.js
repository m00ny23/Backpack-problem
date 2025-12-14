/**
 * @param {number[]} chromosome
 * @param {number} mutationRate
 * @returns {number[]}
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
