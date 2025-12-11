/**
 * @typedef {Object} Individual
 * @property {number[]} chromosome
 * @property {number} fitness
 */

/**
 * Selekcja rankingowa.
 *
 * 1. Sortujemy osobniki rosnąco po fitness (najgorszy -> najlepszy).
 * 2. Nadajemy rangi 1..N (1 = najgorszy, N = najlepszy).
 * 3. Prawdopodobieństwo wyboru ∝ randze (N ma największe).
 *
 * Dzięki temu selekcja zależy tylko od porządku, a nie od konkretnych
 * wartości fitness – presja selekcyjna jest stabilniejsza niż w ruletce.
 *
 * @param {Individual[]} population
 * @returns {Individual}
 */
export function selectionRanking(population) {
  if (!population || population.length === 0) {
    throw new Error(
      "Populacja jest pusta – nie można wykonać selekcji rankingowej."
    );
  }

  // sort rosnąco: najgorszy -> najlepszy
  const sorted = [...population].sort((a, b) => a.fitness - b.fitness);
  const n = sorted.length;

  // rangi 1..n (1 = najgorszy, n = najlepszy)
  const totalRank = (n * (n + 1)) / 2;

  // standardowa "ruletka" po rangach
  const r = Math.random() * totalRank;
  let cumulative = 0;

  for (let i = 0; i < n; i++) {
    const rank = i + 1;
    cumulative += rank;
    if (cumulative >= r) {
      return sorted[i];
    }
  }

  // zabezpieczenie na wypadek zaokrągleń
  return sorted[n - 1];
}
