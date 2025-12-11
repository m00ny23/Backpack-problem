import { loadKnapsackInstance } from "./knapsack/loadInstance.js";
import { fitnessKnapsack } from "./knapsack/fitnessKnapsack.js";
import { runGA } from "./ga/runGA.js";
import { selectionRoulette } from "./ga/selectionRoulette.js";
import { crossoverOnePoint } from "./ga/crossoverOnePoint.js";
import { mutation } from "./ga/mutation.js";

/**
 * Pomocniczo: oblicza sumaryczną wartość i wagę dla chromosomu
 * oraz zwraca listę indeksów wybranych przedmiotów.
 *
 * To jest tylko do debugowania / ładnego logowania wyników.
 *
 * @param {number[]} chromosome
 * @param {import("./knapsack/fitnessKnapsack.js").KnapsackInstance} instance
 */
function decodeSolution(chromosome, instance) {
  const { items, capacity } = instance;

  let totalValue = 0;
  let totalWeight = 0;
  const chosenItems = [];

  const n = Math.min(chromosome.length, items.length);

  for (let i = 0; i < n; i++) {
    if (chromosome[i] === 1) {
      totalValue += items[i].value;
      totalWeight += items[i].weight;
      chosenItems.push(i); // indeksy od 0
    }
  }

  return {
    totalValue,
    totalWeight,
    capacity,
    chosenItems,
  };
}

async function main() {
  // Domyślny plik (ścieżka względna względem katalogu z package.json)
  const defaultFile = "data/backpacks/low-dimensional/f1_l-d_kp_10_269.txt";

  // Jeśli podasz ścieżkę jako argument w CLI, użyjemy jej zamiast domyślnej
  const filePath = process.argv[2] ?? defaultFile;

  console.log(`Ładowanie instancji plecaka z pliku: ${filePath}`);

  const instance = await loadKnapsackInstance(filePath);

  console.log(
    `Załadowano instancję: n = ${instance.itemCount}, capacity = ${instance.capacity}`
  );

  // Parametry algorytmu genetycznego
  const populationSize = 100;
  const numGenerations = 200;
  const crossoverRate = 0.8;
  const mutationRate = 0.02;
  const elitismCount = 2;

  console.log("Parametry GA:");
  console.log(`  populationSize = ${populationSize}`);
  console.log(`  numGenerations = ${numGenerations}`);
  console.log(`  crossoverRate  = ${crossoverRate}`);
  console.log(`  mutationRate   = ${mutationRate}`);
  console.log(`  elitismCount   = ${elitismCount}`);
  console.log();

  // Funkcja przystosowania związana z konkretną instancją plecaka
  const fitnessFn = (chromosome) => fitnessKnapsack(chromosome, instance);

  // Uruchomienie algorytmu genetycznego
  const result = runGA({
    populationSize,
    numGenerations,
    chromosomeLength: instance.itemCount,
    fitnessFn,
    selectionFn: selectionRoulette,
    crossoverFn: crossoverOnePoint,
    mutationFn: mutation,
    crossoverRate,
    mutationRate,
    elitismCount,
  });

  // Raport z wyników
  console.log("=== Wyniki algorytmu genetycznego ===");
  console.log(
    `Najlepsza wartość funkcji przystosowania: ${result.bestFitness}`
  );
  console.log(`Chromosom najlepszego osobnika:`);
  console.log(result.bestIndividual.chromosome.join(""));

  const decoded = decodeSolution(result.bestIndividual.chromosome, instance);
  console.log();
  console.log("Dekodowane rozwiązanie:");
  console.log(`  Suma wartości        : ${decoded.totalValue}`);
  console.log(
    `  Suma wag (waga plecaka): ${decoded.totalWeight} (pojemność = ${decoded.capacity})`
  );
  console.log(`  Liczba wybranych przedmiotów: ${decoded.chosenItems.length}`);
  console.log(
    `  Indeksy wybranych przedmiotów (0-based): ${decoded.chosenItems.join(
      ", "
    )}`
  );

  console.log();
  console.log(
    "Historia najlepszej wartości w kolejnych pokoleniach (fragment):"
  );
  const showLast = 10;
  const hist = result.bestFitnessHistory;
  const start = Math.max(0, hist.length - showLast);
  for (let i = start; i < hist.length; i++) {
    console.log(`  Pokolenie ${i}: ${hist[i]}`);
  }
}

// Uruchom main, obsłuż ewentualne błędy
main().catch((err) => {
  console.error("Błąd podczas wykonywania programu:");
  console.error(err);
  process.exit(1);
});
