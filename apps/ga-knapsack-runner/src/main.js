// apps/ga-knapscack-runner/src/main.js

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

import { loadKnapsackInstance } from "./knapsack/loadInstance.js";
import { runAllExperiments } from "./experiments.js";
import { CONFIG } from "./config.js";

// Ustalenie ścieżki do root projektu (Backpack-problem)
// __filename = .../Backpack-problem/apps/ga-knapscack-runner/src/main.js
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// rootDir = trzy poziomy wyżej: src -> ga-knapscack-runner -> apps -> Backpack-problem
const rootDir = path.resolve(__dirname, "..", "..", "..");

/**
 * Zapisuje obiekt z wynikami eksperymentów do pliku JSON
 * w katalogu "results/" w ROOTCIE projektu:
 *   Backpack-problem/results/<nazwa_zbioru>.json
 *
 * @param {string} datasetPath
 * @param {any} data
 */
async function saveResultsJson(datasetPath, data) {
  const parts = datasetPath.split(/[/\\]/);
  const fileName = parts[parts.length - 1] || "results";
  const baseName = fileName.replace(/\.[^.]+$/, "");

  const outputDir = path.join(rootDir, "results");
  await fs.mkdir(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, `${baseName}.json`);
  await fs.writeFile(outputPath, JSON.stringify(data, null, 2), "utf-8");

  console.log();
  console.log(`Dane eksperymentów zapisane do pliku: ${outputPath}`);
}

async function main() {
  const defaultFile = CONFIG.data.defaultInstancePath;
  const filePath = process.argv[2] ?? defaultFile;

  console.log(`Ładowanie instancji plecaka z pliku: ${filePath}`);

  const instance = await loadKnapsackInstance(filePath);

  console.log(
    `Załadowano instancję: n = ${instance.itemCount}, capacity = ${instance.capacity}`
  );
  console.log("Uruchamianie wszystkich eksperymentów (3.5, 4.5, 5.0)...");

  const experimentData = runAllExperiments(instance, filePath);

  // Krótkie podsumowanie w konsoli
  const globalBest = experimentData.summary.globalBest;
  if (globalBest) {
    console.log();
    console.log(
      "=== Podsumowanie globalne (najlepszy ze wszystkich uruchomień) ==="
    );
    console.log(`  Grupa eksperymentów : ${globalBest.group}`);
    console.log(`  Id uruchomienia     : ${globalBest.runId}`);
    console.log(`  Selekcja            : ${globalBest.selection}`);
    console.log(`  Krzyżowanie         : ${globalBest.crossover}`);
    console.log(`  p_mut               : ${globalBest.mutationRate}`);
    console.log(`  p_cross             : ${globalBest.crossoverRate}`);
    console.log(`  Najlepszy fitness   : ${globalBest.finalBestFitness}`);
    console.log(
      `  Suma wartości       : ${globalBest.finalBestSolution.totalValue}`
    );
    console.log(
      `  Suma wag (plecak)   : ${globalBest.finalBestSolution.totalWeight} (capacity = ${instance.capacity})`
    );
    console.log(
      `  Liczba przedmiotów  : ${globalBest.finalBestSolution.chosenItemIndices.length}`
    );
  }

  await saveResultsJson(filePath, experimentData);
}

// Uruchom main, obsłuż ewentualne błędy
main().catch((err) => {
  console.error("Błąd podczas wykonywania programu:");
  console.error(err);
  process.exit(1);
});
