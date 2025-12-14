import { selectionRoulette } from "./ga/selectionRoulette.js";
import { selectionRanking } from "./ga/selectionRanking.js";
import { createTournamentSelection } from "./ga/selectionTournament.js";
import { crossoverOnePoint } from "./ga/crossoverOnePoint.js";
import { crossoverTwoPoint } from "./ga/crossoverTwoPoint.js";
import { mutation } from "./ga/mutation.js";

const selectionStrategies = {
  roulette: selectionRoulette,
  ranking: selectionRanking,
  tournament3: createTournamentSelection(3),
};

const crossoverStrategies = {
  onePoint: crossoverOnePoint,
  twoPoint: crossoverTwoPoint,
};

export const CONFIG = {
  data: {
    defaultInstancePath: "data/backpacks/low-dimensional/f1_l-d_kp_10_269.txt",
  },

  ga: {
    populationSize: 600,

    numGenerations: 4000,

    crossoverRate: 0.8,

    mutationRate: 0.0005,

    elitismCount: 4,

    maxStallGenerations: 400,
  },

  operators: {
    selectionFn: selectionStrategies.roulette,

    crossoverFn: crossoverStrategies.onePoint,

    mutationFn: mutation,
  },

  strategies: {
    selection: selectionStrategies,
    crossover: crossoverStrategies,
  },

  logging: {
    bestHistoryLastN: 10,
  },
};
