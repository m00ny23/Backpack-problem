// src/ga/runGA.js

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
 * Funkcja, która generuje nowy chromosom (np. osobnik startowy).
 *
 * @callback CreateChromosomeFn
 * @param {number} chromosomeLength
 * @returns {number[]} chromosom
 */

/**
 * Funkcja naprawiająca chromosom (np. usuwająca nadmiarowe przedmioty,
 * żeby wynik był dopuszczalny).
 *
 * @callback RepairFn
 * @param {number[]} chromosome
 * @returns {number[]} naprawiony chromosom
 */

/**
 * @typedef {Object} GAOptions
 * @property {number} populationSize        - rozmiar populacji
 * @property {number} numGenerations        - maksymalna liczba iteracji / pokoleń
 * @property {number} chromosomeLength      - długość chromosomu
 * @property {FitnessFn} fitnessFn          - funkcja przystosowania
 * @property {SelectionFn} selectionFn      - funkcja selekcji rodziców
 * @property {CrossoverFn} crossoverFn      - funkcja krzyżowania
 * @property {MutationFn} mutationFn        - funkcja mutacji
 * @property {number} [crossoverRate=0.8]   - prawdopodobieństwo krzyżowania
 * @property {number} [mutationRate=0.01]   - prawdopodobieństwo mutacji genu
 * @property {number} [elitismCount=1]      - liczba elit
 * @property {CreateChromosomeFn} [createChromosomeFn] - niestandardowa inicjalizacja
 * @property {RepairFn} [repairFn]          - opcjonalna funkcja naprawy chromosomu
 * @property {number|null} [maxStallGenerations=null] - ile kolejnych pokoleń bez poprawy
 *                                                     powoduje wczesne zatrzymanie
 */

/**
 * @typedef {Object} GARunResult
 * @property {Individual} bestIndividual    - najlepszy znaleziony osobnik (globalnie)
 * @property {number} bestFitness           - jego wartość funkcji przystosowania
 * @property {number[]} bestFitnessHistory  - historia najlepszego fitness (po każdym pokoleniu)
 * @property {Individual[]} finalPopulation - populacja z ostatniego pokolenia
 * @property {number} generationsRun        - faktyczna liczba wykonanych pokoleń
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
 * Inicjuje populację osobników.
 * Jeśli podano createChromosomeFn, używa jej do tworzenia chromosomów.
 * Jeśli podano repairFn, naprawia każdy chromosom przed obliczeniem fitness.
 *
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

  return {
    chromosome: [...best.chromosome],
    fitness: best.fitness,
  };
}

/**
 * Główny algorytm genetyczny (generacyjny, z elitaryzmem i opcjonalnym early stoppingiem).
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

  // 1. Populacja startowa
  let population = createInitialPopulation(
    populationSize,
    chromosomeLength,
    fitnessFn,
    createChromosomeFn,
    repairFn
  );

  // 2. Najlepszy osobnik (globalnie) + historia
  let globalBest = findBestIndividual(population);
  const bestFitnessHistory = [globalBest.fitness];

  let stallCounter = 0; // licznik kolejnych pokoleń bez poprawy
  let generationsRun = 0; // faktyczna liczba wykonanych pokoleń

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

      // Kopie chromosomów rodziców
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

      // Mutacja
      childChromosome1 = mutationFn(childChromosome1, mutationRate);
      childChromosome2 = mutationFn(childChromosome2, mutationRate);

      // Naprawa (np. ograniczenie wagi plecaka)
      if (typeof repairFn === "function") {
        childChromosome1 = repairFn(childChromosome1);
        childChromosome2 = repairFn(childChromosome2);
      }

      // Dodajemy dzieci do nowej populacji
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

    // 3c. Nowa populacja staje się aktualną
    population = newPopulation;

    // 3d. Ocena nowej populacji
    evaluatePopulation(population, fitnessFn);
    const currentBest = findBestIndividual(population);

    // 3e. Aktualizacja najlepszego globalnie i licznika stagnacji
    if (currentBest.fitness > globalBest.fitness) {
      globalBest = {
        chromosome: [...currentBest.chromosome],
        fitness: currentBest.fitness,
      };
      stallCounter = 0; // poprawa -> reset licznika
    } else {
      stallCounter += 1;
    }

    bestFitnessHistory.push(globalBest.fitness);
    generationsRun = generation;

    // 3f. Early stopping: jeśli zbyt długo brak poprawy, przerywamy
    if (
      maxStallGenerations !== null &&
      maxStallGenerations > 0 &&
      stallCounter >= maxStallGenerations
    ) {
      // można tutaj ewentualnie dodać console.log informacyjny,
      // ale zostawiamy to do logiki wyżej (experiments/main)
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
