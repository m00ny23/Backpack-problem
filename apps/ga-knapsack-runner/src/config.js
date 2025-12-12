// src/config.js

import { selectionRoulette } from "./ga/selectionRoulette.js";
import { selectionRanking } from "./ga/selectionRanking.js";
import { createTournamentSelection } from "./ga/selectionTournament.js";
import { crossoverOnePoint } from "./ga/crossoverOnePoint.js";
import { crossoverTwoPoint } from "./ga/crossoverTwoPoint.js";
import { mutation } from "./ga/mutation.js";

// Dostępne strategie selekcji (do eksperymentów)
const selectionStrategies = {
  roulette: selectionRoulette,
  ranking: selectionRanking,
  tournament3: createTournamentSelection(3),
};

// Dostępne strategie krzyżowania (do eksperymentów)
const crossoverStrategies = {
  onePoint: crossoverOnePoint,
  twoPoint: crossoverTwoPoint,
};

/**
 * Główny obiekt konfiguracji aplikacji.
 *
 * Wszystkie ważne parametry (ścieżki, parametry GA, wybór operatorów)
 * ustawiasz w jednym miejscu.
 */
export const CONFIG = {
  data: {
    /**
     * Domyślna ścieżka do pliku z instancją problemu plecakowego.
     * Ścieżka jest liczona względem katalogu z package.json
     * (czyli root projektu, np. D:\Programming\AG\Backpack-problem).
     */
    defaultInstancePath: "data/backpacks/low-dimensional/f1_l-d_kp_10_269.txt",
  },

  ga: {
    /**
     * Rozmiar populacji (liczba osobników w każdym pokoleniu).
     */
    populationSize: 300,

    /**
     * Liczba pokoleń (iteracji algorytmu genetycznego).
     */
    numGenerations: 2000,

    /**
     * Prawdopodobieństwo krzyżowania (0..1).
     * Typowy zakres: 0.5 - 1.0
     */
    crossoverRate: 0.8,

    /**
     * Prawdopodobieństwo mutacji pojedynczego genu (0..1).
     * Typowy zakres: 0.0 - 0.1
     */
    mutationRate: 0.001,

    /**
     * Liczba najlepszych osobników, które kopiujemy bez zmian
     * do kolejnej populacji (elitaryzm).
     */
    elitismCount: 2,
  },

  operators: {
    /**
     * AKTUALNIE AKTYWNA FUNKCJA SELEKCJI
     *
     * Do porównań:
     *  - selekcja ruletkowa   -> selectionStrategies.roulette
     *  - selekcja rankingowa  -> selectionStrategies.ranking
     *  - selekcja turniejowa  -> selectionStrategies.tournament3
     */
    selectionFn: selectionStrategies.roulette,

    /**
     * AKTUALNIE AKTYWNA FUNKCJA KRZYŻOWANIA
     *
     * Do porównań:
     *  - krzyżowanie jednopunktowe -> crossoverStrategies.onePoint
     *  - krzyżowanie dwupunktowe   -> crossoverStrategies.twoPoint
     */
    crossoverFn: crossoverStrategies.onePoint,

    /**
     * Funkcja mutacji – binarna zmiana bitów 0/1.
     */
    mutationFn: mutation,
  },

  /**
   * Zbiór wszystkich strategii, wygodny przy eksperymentach.
   * Możesz tego użyć np. w osobnym skrypcie eksperymentalnym.
   */
  strategies: {
    selection: selectionStrategies,
    crossover: crossoverStrategies,
  },

  logging: {
    /**
     * Ile ostatnich wartości z historii najlepszego fitnessu
     * wypisać w konsoli po zakończeniu algorytmu.
     */
    bestHistoryLastN: 10,
  },
};
