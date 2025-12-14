/**
 * @typedef {Object} Individual
 * @property {number[]} chromosome
 * @property {number} fitness

/**
 * @callback FitnessFn
 * @param {number[]} chromosome
 * @returns {number}
 */

/**
 * @callback SelectionFn
 * @param {Individual[]} population
 * @returns {Individual}
 */

/**
 * @callback CrossoverFn
 * @param {number[]} parent1
 * @param {number[]} parent2
 * @returns {[number[], number[]]}
 */

/**
 * @callback MutationFn
 * @param {number[]} chromosome
 * @param {number} mutationRate
 * @returns {number[]}
 */

/**
 * @callback CreateChromosomeFn
 * @param {number} chromosomeLength
 * @returns {number[]}
 */

/**
 * @callback RepairFn
 * @param {number[]} chromosome
 * @returns {number[]}
 */

/**
 * @typedef {Object} GAOptions
 * @property {number} populationSize
 * @property {number} numGenerations
 * @property {number} chromosomeLength
 * @property {FitnessFn} fitnessFn
 * @property {SelectionFn} selectionFn
 * @property {CrossoverFn} crossoverFn
 * @property {MutationFn} mutationFn
 * @property {number} [crossoverRate=0.8]
 * @property {number} [mutationRate=0.01]
 * @property {number} [elitismCount=1]
 * @property {CreateChromosomeFn} [createChromosomeFn]
 * @property {RepairFn} [repairFn]
 */

/**
 * @typedef {Object} GARunResult
 * @property {Individual} bestIndividual
 * @property {number} bestFitness
 * @property {number[]} bestFitnessHistory
 * @property {Individual[]} finalPopulation
 * @property {number} generationsRun
 */

/**
 * @param {number} length
 * @returns {number[]}
 */
function createRandomChromosome(length) {
  const chromosome = new Array(length);
  for (let i = 0; i < length; i++) {
    chromosome[i] = Math.random() < 0.5 ? 0 : 1;
  }
  return chromosome;
}

/**
 * @param {number} populationSize
 * @param {number} chromosomeLength
 * @param {FitnessFn} fitnessFn
 * @param {CreateChromosomeFn | undefined} createChromosomeFn
 * @param {RepairFn | undefined} repairFn
 * @returns {Individual[]}
 */
function createInitialPopulation(
  populationSize,
  chromosomeLength,
  fitnessFn,
  createChromosomeFn,
  repairFn
) {
  const population = [];

  for (let i = 0; i < populationSize; i++) {
    let chromosome;
    if (typeof createChromosomeFn === "function") {
      chromosome = createChromosomeFn(chromosomeLength);
    } else {
      chromosome = createRandomChromosome(chromosomeLength);
    }

    if (typeof repairFn === "function") {
      chromosome = repairFn(chromosome);
    }

    const fitness = fitnessFn(chromosome);
    population.push({ chromosome, fitness });
  }

  return population;
}

/**
 * @param {Individual[]} population
 * @param {FitnessFn} fitnessFn
 */
function evaluatePopulation(population, fitnessFn) {
  for (const individual of population) {
    individual.fitness = fitnessFn(individual.chromosome);
  }
}

/**
 * @param {Individual[]} population
 * @returns {Individual}
 */
function findBestIndividual(population) {
  if (population.length === 0) {
    throw new Error(
      "Populacja jest pusta – nie można znaleźć najlepszego osobnika."
    );
  }

  let best = population[0];

  for (let i = 1; i < population.length; i++) {
    if (population[i].fitness > best.fitness) {
      best = population[i];
    }
  }

  return {
    chromosome: [...best.chromosome],
    fitness: best.fitness,
  };
}

/**
 * @param {GAOptions} options
 * @returns {GARunResult}
 */
export function runGA(options) {
  const {
    populationSize,
    numGenerations,
    chromosomeLength,
    fitnessFn,
    selectionFn,
    crossoverFn,
    mutationFn,
    crossoverRate = 0.8,
    mutationRate = 0.01,
    elitismCount = 1,
    createChromosomeFn,
    repairFn,
    maxStallGenerations = null,
  } = options;

  if (populationSize <= 0) {
    throw new Error("populationSize musi być dodatnie.");
  }
  if (numGenerations <= 0) {
    throw new Error("numGenerations musi być dodatnie.");
  }
  if (chromosomeLength <= 0) {
    throw new Error("chromosomeLength musi być dodatnie.");
  }

  let population = createInitialPopulation(
    populationSize,
    chromosomeLength,
    fitnessFn,
    createChromosomeFn,
    repairFn
  );

  let globalBest = findBestIndividual(population);
  const bestFitnessHistory = [globalBest.fitness];

  let stallCounter = 0;
  let generationsRun = 0;

  for (let generation = 1; generation <= numGenerations; generation++) {
    /** @type {Individual[]} */
    const newPopulation = [];

    if (elitismCount > 0) {
      const sorted = [...population].sort((a, b) => b.fitness - a.fitness);

      for (let i = 0; i < elitismCount && i < sorted.length; i++) {
        const elite = sorted[i];
        newPopulation.push({
          chromosome: [...elite.chromosome],
          fitness: elite.fitness,
        });
      }
    }

    while (newPopulation.length < populationSize) {
      const parent1 = selectionFn(population);
      const parent2 = selectionFn(population);

      let childChromosome1 = [...parent1.chromosome];
      let childChromosome2 = [...parent2.chromosome];

      if (Math.random() < crossoverRate) {
        const [offspring1, offspring2] = crossoverFn(
          childChromosome1,
          childChromosome2
        );
        childChromosome1 = offspring1;
        childChromosome2 = offspring2;
      }

      childChromosome1 = mutationFn(childChromosome1, mutationRate);
      childChromosome2 = mutationFn(childChromosome2, mutationRate);

      if (typeof repairFn === "function") {
        childChromosome1 = repairFn(childChromosome1);
        childChromosome2 = repairFn(childChromosome2);
      }

      newPopulation.push({
        chromosome: childChromosome1,
        fitness: 0,
      });

      if (newPopulation.length < populationSize) {
        newPopulation.push({
          chromosome: childChromosome2,
          fitness: 0,
        });
      }
    }

    population = newPopulation;

    evaluatePopulation(population, fitnessFn);
    const currentBest = findBestIndividual(population);

    if (currentBest.fitness > globalBest.fitness) {
      globalBest = {
        chromosome: [...currentBest.chromosome],
        fitness: currentBest.fitness,
      };
      stallCounter = 0;
    } else {
      stallCounter += 1;
    }

    bestFitnessHistory.push(globalBest.fitness);
    generationsRun = generation;

    if (
      maxStallGenerations !== null &&
      maxStallGenerations > 0 &&
      stallCounter >= maxStallGenerations
    ) {
      break;
    }
  }

  return {
    bestIndividual: globalBest,
    bestFitness: globalBest.fitness,
    bestFitnessHistory,
    finalPopulation: population,
    generationsRun,
  };
}
