/**
 * @typedef {Object} Individual
 * @property {number[]} chromosome - binarny chromosom (0/1)
 * @property {number} fitness      - wartość funkcji przystosowania
 */

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
 * @returns {[number[], number[]]} - para chromosomów potomnych
 */

/**
 * @callback MutationFn
 * @param {number[]} chromosome
 * @param {number} mutationRate
 * @returns {number[]} - zmutowany chromosom
 */

/**
 * @typedef {Object} GAOptions
 * @property {number} populationSize        - rozmiar populacji
 * @property {number} numGenerations        - liczba iteracji / pokoleń
 * @property {number} chromosomeLength      - długość chromosomu (dla plecaka = liczba przedmiotów)
 * @property {FitnessFn} fitnessFn          - funkcja przystosowania
 * @property {SelectionFn} selectionFn      - funkcja selekcji rodziców
 * @property {CrossoverFn} crossoverFn      - funkcja krzyżowania (jedno- lub dwupunktowego)
 * @property {MutationFn} mutationFn        - funkcja mutacji (binarnej)
 * @property {number} [crossoverRate=0.8]   - prawdopodobieństwo krzyżowania (0..1)
 * @property {number} [mutationRate=0.01]   - prawdopodobieństwo mutacji pojedynczego genu (0..1)
 * @property {number} [elitismCount=1]      - ile najlepszych osobników kopiujemy bez zmian do następnej populacji
 */

/**
 * @typedef {Object} GARunResult
 * @property {Individual} bestIndividual    - najlepszy znaleziony osobnik (globalnie)
 * @property {number} bestFitness           - jego wartość funkcji przystosowania
 * @property {number[]} bestFitnessHistory  - historia najlepszej wartości (po każdym pokoleniu)
 * @property {Individual[]} finalPopulation - populacja z ostatniego pokolenia
 */

/**
 * Tworzy losowy chromosom binarny.
 *
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
 * Inicjuje losową populację osobników.
 *
 * @param {number} populationSize
 * @param {number} chromosomeLength
 * @param {FitnessFn} fitnessFn
 * @returns {Individual[]}
 */
function createInitialPopulation(populationSize, chromosomeLength, fitnessFn) {
  const population = [];

  for (let i = 0; i < populationSize; i++) {
    const chromosome = createRandomChromosome(chromosomeLength);
    const fitness = fitnessFn(chromosome);
    population.push({ chromosome, fitness });
  }

  return population;
}

/**
 * Przelicza wartości funkcji przystosowania dla całej populacji.
 *
 * @param {Individual[]} population
 * @param {FitnessFn} fitnessFn
 */
function evaluatePopulation(population, fitnessFn) {
  for (const individual of population) {
    individual.fitness = fitnessFn(individual.chromosome);
  }
}

/**
 * Zwraca kopię najlepszego osobnika w populacji.
 *
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

  // Zwracamy kopię, żeby późniejsze modyfikacje populacji nie psuły najlepszego osobnika
  return {
    chromosome: [...best.chromosome],
    fitness: best.fitness,
  };
}

/**
 * Główny algorytm genetyczny (generacyjny, z elitaryzmem).
 *
 * Jest w pełni ogólny – nie zależy od problemu (plecak/whatever),
 * wymaga tylko binarnego kodowania i podanych operatorów.
 *
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

  // 1. Populacja startowa
  let population = createInitialPopulation(
    populationSize,
    chromosomeLength,
    fitnessFn
  );

  // 2. Najlepszy osobnik (globalnie) + historia
  let globalBest = findBestIndividual(population);
  const bestFitnessHistory = [globalBest.fitness];

  // 3. Główna pętla ewolucji
  for (let generation = 1; generation <= numGenerations; generation++) {
    /** @type {Individual[]} */
    const newPopulation = [];

    // 3a. Elitaryzm – kopiujemy najlepszych z poprzedniej populacji
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

    // 3b. Tworzenie reszty nowej populacji poprzez selekcję, krzyżowanie i mutację
    while (newPopulation.length < populationSize) {
      // Selekcja dwóch rodziców
      const parent1 = selectionFn(population);
      const parent2 = selectionFn(population);

      // Kopie chromosomów rodziców (żeby ich nie modyfikować)
      let childChromosome1 = [...parent1.chromosome];
      let childChromosome2 = [...parent2.chromosome];

      // Krzyżowanie z zadanym prawdopodobieństwem
      if (Math.random() < crossoverRate) {
        const [offspring1, offspring2] = crossoverFn(
          childChromosome1,
          childChromosome2
        );
        childChromosome1 = offspring1;
        childChromosome2 = offspring2;
      }

      // Mutacja (funkcja mutacji sama decyduje, które geny zmienić na podstawie mutationRate)
      childChromosome1 = mutationFn(childChromosome1, mutationRate);
      childChromosome2 = mutationFn(childChromosome2, mutationRate);

      // Dodajemy dzieci do nowej populacji
      newPopulation.push({
        chromosome: childChromosome1,
        fitness: 0, // policzymy za chwilę
      });

      if (newPopulation.length < populationSize) {
        newPopulation.push({
          chromosome: childChromosome2,
          fitness: 0,
        });
      }
    }

    // 3c. Nowa populacja staje się aktualną
    population = newPopulation;

    // 3d. Ocena nowej populacji
    evaluatePopulation(population, fitnessFn);
    const currentBest = findBestIndividual(population);

    // Aktualizacja najlepszego globalnie
    if (currentBest.fitness > globalBest.fitness) {
      globalBest = {
        chromosome: [...currentBest.chromosome],
        fitness: currentBest.fitness,
      };
    }

    bestFitnessHistory.push(globalBest.fitness);
  }

  return {
    bestIndividual: globalBest,
    bestFitness: globalBest.fitness,
    bestFitnessHistory,
    finalPopulation: population,
  };
}
