// src/experiments.js

import { CONFIG } from "./config.js";
import { runGA } from "./ga/runGA.js";
import { fitnessKnapsack } from "./knapsack/fitnessKnapsack.js";
import { decodeKnapsackSolution } from "./knapsack/solutionUtils.js";
import {
  makeFeasibleChromosomeFn,
  makeRepairFn,
} from "./knapsack/gaSupport.js";

/**
 * Pomocnicza funkcja – wyciąga nazwę pliku i kategorię zbioru
 * (low-dimensional / large_scale / high-dimensional / unknown) na podstawie ścieżki.
 *
 * @param {string} datasetPath
 * @param {import("./knapsack/fitnessKnapsack.js").KnapsackInstance} instance
 */
function buildDatasetMeta(datasetPath, instance) {
  const parts = datasetPath.split(/[/\\]/);
  const fileName = parts[parts.length - 1] || datasetPath;
  const baseName = fileName.replace(/\.[^.]+$/, "");

  let category = "unknown";
  if (datasetPath.includes("low-dimensional")) {
    category = "low-dimensional";
  } else if (datasetPath.includes("large_scale")) {
    category = "large_scale";
  } else if (datasetPath.includes("high-dimensional")) {
    category = "high-dimensional";
  }

  return {
    instancePath: datasetPath,
    fileName,
    baseName,
    category,
    itemCount: instance.itemCount,
    capacity: instance.capacity,
    optimum: null, // można uzupełnić ręcznie w JSON / Pythonie
  };
}

/**
 * Uruchamia pojedynczy eksperyment GA dla zadanej konfiguracji operatorów
 * i parametrów, zwracając komplet danych potrzebnych do wykresów.
 */
function runSingleGARun({
  instance,
  selectionKey,
  selectionFn,
  crossoverKey,
  crossoverFn,
  mutationFn,
  mutationRate,
  crossoverRate,
  populationSize,
  numGenerations,
  elitismCount,
  createChromosomeFn,
  repairFn,
}) {
  const fitnessFn = (chromosome) => fitnessKnapsack(chromosome, instance);

  const result = runGA({
    populationSize,
    numGenerations,
    chromosomeLength: instance.itemCount,
    fitnessFn,
    selectionFn,
    crossoverFn,
    mutationFn,
    crossoverRate,
    mutationRate,
    elitismCount,
    createChromosomeFn,
    repairFn,
  });

  const decoded = decodeKnapsackSolution(
    result.bestIndividual.chromosome,
    instance
  );

  return {
    selection: selectionKey,
    crossover: crossoverKey,
    mutationRate,
    crossoverRate,
    bestFitnessHistory: result.bestFitnessHistory,
    finalBestFitness: result.bestFitness,
    finalBestSolution: {
      chromosome: result.bestIndividual.chromosome,
      totalValue: decoded.totalValue,
      totalWeight: decoded.totalWeight,
      chosenItemIndices: decoded.chosenItems,
    },
  };
}

/**
 * Uruchamia wszystkie wymagane eksperymenty (3.5, 4.5, 5.0)
 * dla danej instancji plecaka.
 *
 * Zwraca obiekt, który zostanie zapisany do JSON.
 *
 * @param {import("./knapsack/fitnessKnapsack.js").KnapsackInstance} instance
 * @param {string} datasetPath
 */
export function runAllExperiments(instance, datasetPath) {
  const datasetMeta = buildDatasetMeta(datasetPath, instance);

  const {
    populationSize,
    numGenerations,
    mutationRate,
    crossoverRate,
    elitismCount,
  } = CONFIG.ga;

  const mutationFn = CONFIG.operators.mutationFn;
  const selectionStrategies = CONFIG.strategies.selection;
  const crossoverStrategies = CONFIG.strategies.crossover;

  // NOWOŚĆ: specjalna inicjalizacja i naprawa dla plecaka
  const createChromosomeFn = makeFeasibleChromosomeFn(instance);
  const repairFn = makeRepairFn(instance);

  // --- Ustawienia siatki parametrów dla części 3.5 ---
  const mutationRatesGrid = [0.005, 0.02, 0.05];
  const crossoverRatesGrid = [0.6, 0.8, 0.95];

  /** @type {any[]} */
  const experiments = [];

  // ====== 1) Ocena 3.5: różne współczynniki mutacji i krzyżowania ======

  {
    const groupRuns = [];

    for (const mRate of mutationRatesGrid) {
      for (const cRate of crossoverRatesGrid) {
        const runResult = runSingleGARun({
          instance,
          selectionKey: "roulette",
          selectionFn: selectionStrategies.roulette,
          crossoverKey: "onePoint",
          crossoverFn: crossoverStrategies.onePoint,
          mutationFn,
          mutationRate: mRate,
          crossoverRate: cRate,
          populationSize,
          numGenerations,
          elitismCount,
          createChromosomeFn,
          repairFn,
        });

        groupRuns.push({
          id: `mut_${mRate}_cross_${cRate}`,
          ...runResult,
        });
      }
    }

    experiments.push({
      group: "mutation_crossover_grid_3.5",
      description:
        "Wykresy dla różnych współczynników mutacji i krzyżowania (selekcja ruletkowa, krzyżowanie jednopunktowe).",
      baseParameters: {
        populationSize,
        numGenerations,
        elitismCount,
      },
      grid: {
        mutationRates: mutationRatesGrid,
        crossoverRates: crossoverRatesGrid,
      },
      runs: groupRuns,
    });
  }

  // ====== 2) Ocena 4.5: selekcja rankingowa vs ruletkowa ======

  {
    const groupRuns = [];

    const selections = [
      { key: "roulette", fn: selectionStrategies.roulette },
      { key: "ranking", fn: selectionStrategies.ranking },
    ];

    for (const sel of selections) {
      const runResult = runSingleGARun({
        instance,
        selectionKey: sel.key,
        selectionFn: sel.fn,
        crossoverKey: "onePoint",
        crossoverFn: crossoverStrategies.onePoint,
        mutationFn,
        mutationRate,
        crossoverRate,
        populationSize,
        numGenerations,
        elitismCount,
        createChromosomeFn,
        repairFn,
      });

      groupRuns.push({
        id: `selection_${sel.key}`,
        ...runResult,
      });
    }

    experiments.push({
      group: "selection_comparison_4.5",
      description:
        "Wykresy porównujące selekcję rankingową oraz ruletkową (stałe p_mut, p_cross, krzyżowanie jednopunktowe).",
      baseParameters: {
        populationSize,
        numGenerations,
        elitismCount,
        mutationRate,
        crossoverRate,
        crossover: "onePoint",
      },
      runs: groupRuns,
    });
  }

  // ====== 3) Ocena 4.5: krzyżowanie jedno- i dwupunktowe ======

  {
    const groupRuns = [];

    const crossovers = [
      { key: "onePoint", fn: crossoverStrategies.onePoint },
      { key: "twoPoint", fn: crossoverStrategies.twoPoint },
    ];

    for (const cross of crossovers) {
      const runResult = runSingleGARun({
        instance,
        selectionKey: "roulette",
        selectionFn: selectionStrategies.roulette,
        crossoverKey: cross.key,
        crossoverFn: cross.fn,
        mutationFn,
        mutationRate,
        crossoverRate,
        populationSize,
        numGenerations,
        elitismCount,
        createChromosomeFn,
        repairFn,
      });

      groupRuns.push({
        id: `crossover_${cross.key}`,
        ...runResult,
      });
    }

    experiments.push({
      group: "crossover_comparison_4.5",
      description:
        "Wykresy porównujące krzyżowanie jednopunktowe i dwupunktowe (selekcja ruletkowa, stałe p_mut, p_cross).",
      baseParameters: {
        populationSize,
        numGenerations,
        elitismCount,
        mutationRate,
        crossoverRate,
        selection: "roulette",
      },
      runs: groupRuns,
    });
  }

  // ====== 4) Ocena 5.0: selekcja rankingowa, ruletkowa oraz turniejowa ======

  {
    const groupRuns = [];

    const selections = [
      { key: "roulette", fn: selectionStrategies.roulette },
      { key: "ranking", fn: selectionStrategies.ranking },
      { key: "tournament_3", fn: selectionStrategies.tournament3 },
    ];

    for (const sel of selections) {
      const runResult = runSingleGARun({
        instance,
        selectionKey: sel.key,
        selectionFn: sel.fn,
        crossoverKey: "onePoint",
        crossoverFn: crossoverStrategies.onePoint,
        mutationFn,
        mutationRate,
        crossoverRate,
        populationSize,
        numGenerations,
        elitismCount,
        createChromosomeFn,
        repairFn,
      });

      groupRuns.push({
        id: `selection_${sel.key}`,
        ...runResult,
      });
    }

    experiments.push({
      group: "selection_comparison_5.0",
      description:
        "Wykresy porównujące selekcję rankingową, ruletkową oraz turniejową (stałe p_mut, p_cross, krzyżowanie jednopunktowe).",
      baseParameters: {
        populationSize,
        numGenerations,
        elitismCount,
        mutationRate,
        crossoverRate,
        crossover: "onePoint",
      },
      runs: groupRuns,
    });
  }

  // ====== Podsumowanie globalne (najlepszy ze wszystkich uruchomień) ======

  let globalBest = null;

  for (const group of experiments) {
    for (const run of group.runs) {
      if (!globalBest || run.finalBestFitness > globalBest.finalBestFitness) {
        globalBest = {
          group: group.group,
          runId: run.id,
          selection: run.selection,
          crossover: run.crossover,
          mutationRate: run.mutationRate,
          crossoverRate: run.crossoverRate,
          finalBestFitness: run.finalBestFitness,
          finalBestSolution: run.finalBestSolution,
        };
      }
    }
  }

  return {
    dataset: datasetMeta,
    gaDefaults: {
      populationSize,
      numGenerations,
      elitismCount,
      baseMutationRate: mutationRate,
      baseCrossoverRate: crossoverRate,
    },
    experimentDesign: {
      mutationRatesGrid,
      crossoverRatesGrid,
    },
    experiments,
    summary: {
      globalBest,
    },
  };
}
