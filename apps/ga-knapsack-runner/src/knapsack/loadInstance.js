import fs from "fs/promises";

/**
 * @typedef {Object} KnapsackItem
 * @property {number} value
 * @property {number} weight
 */

/**
 * @typedef {Object} KnapsackInstance
 * @property {number} itemCount
 * @property {number} capacity
 * @property {KnapsackItem[]} items
 */

/**
 * @param {string} filePath
 * @returns {Promise<KnapsackInstance>}
 */
export async function loadKnapsackInstance(filePath) {
  const raw = await fs.readFile(filePath, "utf-8");

  const lines = raw
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  if (lines.length === 0) {
    throw new Error(
      `Plik "${filePath}" jest pusty lub zawiera tylko puste linie.`
    );
  }

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
