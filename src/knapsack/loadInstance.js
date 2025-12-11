import fs from "fs/promises";

/**
 * @typedef {Object} KnapsackItem
 * @property {number} value  - wartość (profit) przedmiotu
 * @property {number} weight - waga przedmiotu
 */

/**
 * @typedef {Object} KnapsackInstance
 * @property {number} itemCount        - liczba przedmiotów (n)
 * @property {number} capacity         - pojemność plecaka
 * @property {KnapsackItem[]} items    - tablica przedmiotów
 */

/**
 * Wczytuje instancję problemu plecakowego z pliku tekstowego.
 *
 * Oczekiwany format:
 *
 *  n capacity
 *  value_1 weight_1
 *  ...
 *  value_n weight_n
 *
 * @param {string} filePath - ścieżka do pliku z danymi (np. "data/backpacks low-dimensional/f1_l-d_kp_10_269.txt")
 * @returns {Promise<KnapsackInstance>}
 */
export async function loadKnapsackInstance(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");

  // Podział na linie, usunięcie pustych
  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error(
      `Plik "${filePath}" jest pusty lub zawiera tylko puste linie.`
    );
  }

  // Pierwsza linia: n capacity
  const [firstLine, ...itemLines] = lines;
  const [nStr, capacityStr] = firstLine.split(/\s+/);

  const itemCount = Number.parseInt(nStr, 10);
  const capacity = Number.parseInt(capacityStr, 10);

  if (!Number.isFinite(itemCount) || !Number.isFinite(capacity)) {
    throw new Error(
      `Niepoprawny nagłówek w pliku "${filePath}". Oczekiwano: "n capacity", np. "10 269". Odczytano: "${firstLine}".`
    );
  }

  /** @type {KnapsackItem[]} */
  const items = [];

  for (let i = 0; i < itemLines.length; i++) {
    const line = itemLines[i];
    const [valueStr, weightStr] = line.split(/\s+/);

    if (valueStr === undefined || weightStr === undefined) {
      throw new Error(
        `Niepoprawny format w linii ${
          i + 2
        } pliku "${filePath}". Oczekiwano: "value weight". Odczytano: "${line}".`
      );
    }

    const value = Number.parseInt(valueStr, 10);
    const weight = Number.parseInt(weightStr, 10);

    if (!Number.isFinite(value) || !Number.isFinite(weight)) {
      throw new Error(
        `Niepoprawne dane liczbowe w linii ${
          i + 2
        } pliku "${filePath}". Odczytano: "${line}".`
      );
    }

    items.push({ value, weight });
  }

  if (items.length !== itemCount) {
    // Można też tylko ostrzec i przyjąć min(n, items.length), ale błąd jest bardziej bezpieczny.
    throw new Error(
      `Zadeklarowana liczba przedmiotów to ${itemCount}, ale znaleziono ${items.length} linii z przedmiotami w pliku "${filePath}".`
    );
  }

  return {
    itemCount,
    capacity,
    items,
  };
}
