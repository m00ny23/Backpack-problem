# Projekt: Algorytm genetyczny dla problemu plecakowego

Projekt składa się z dwóch głównych części:

1. **Aplikacja JS (Node)** – uruchamia algorytm genetyczny dla problemu plecakowego i zapisuje wyniki eksperymentów do plików JSON.  
   Lokalizacja: `apps/ga-knapscack-runner/`
2. **Aplikacja Python** – odczytuje pliki JSON z wynikami i generuje wykresy (matplotlib).  
   Lokalizacja: `apps/chart-generator/`

Wspólne katalogi:

- `data/` – zbiory danych do problemu plecakowego (low-dimensional, large_scale),
- `results/` – wyniki eksperymentów w formacie JSON (z JS) oraz ewentualnie wykresy (PNG) z Pythona.

---

## Wymagania wstępne

- Node.js (zalecane 18+)
- Python 3.10+ (lub podobna wersja 3.x)
- Dostęp do konsoli (PowerShell / CMD / bash)

---

## 1. Uruchamianie algorytmu genetycznego (JS)

### 1.1. Instalacja zależności

```bash
cd apps/ga-knapscack-runner
npm install
````

Zakładamy, że w `apps/ga-knapscack-runner/package.json` jest skrypt:

```json
"scripts": {
  "start": "node src/main.js"
}
```

### 1.2. Uruchamianie dla konkretnego zbioru danych

Algorytm uruchamiasz podając ścieżkę do pliku z danymi (względem **roota projektu** lub z katalogu runnera, w zależności od tego jak wywołujesz):

Przykład – zbiór low-dimensional:

```bash
cd apps/ga-knapscack-runner

# przykład dla jednego zbioru
node src/main.js "../../data/backpacks/low-dimensional/f3_l-d_kp_4_20.txt"
```

Przykład – zbiór large_scale:

```bash
cd apps/ga-knapscack-runner

node src/main.js "../../data/backpacks/large_scale/XY_example.txt"
```

> Do części eksperymentalnej należy uruchomić program **6 razy**:
>
> * 4 razy dla różnych zbiorów `low-dimensional`,
> * 2 razy dla zbiorów `large_scale`.

### 1.3. Gdzie trafiają wyniki?

Kod runnera jest skonfigurowany tak, aby **zawsze** zapisywać wyniki do katalogu:

```text
Backpack-problem/results/
```

Dla pliku danych:

```text
data/backpacks/low-dimensional/f3_l-d_kp_4_20.txt
```

powstanie plik:

```text
results/f3_l-d_kp_4_20.json
```

Każdy taki JSON zawiera **komplet informacji** do wygenerowania wszystkich wykresów z opisu zadania:

* 3.5 – siatka różnych współczynników mutacji i krzyżowania,
* 4.5 – porównania selekcji (rankingowa vs ruletkowa) oraz krzyżowania (jedno- vs dwupunktowe),
* 5.0 – porównanie selekcji rankingowej, ruletkowej i turniejowej.

---

## 2. Generowanie wykresów (Python)

Aplikacja w Pythonie będzie używać plików JSON z katalogu `results/`.

### 2.1. Instalacja zależności Pythona

```bash
cd apps/chart-generator

# (opcjonalnie) utwórz i aktywuj virtualenv
# python -m venv venv
# Windows: venv\Scripts\activate
# Linux/macOS: source venv/bin/activate

pip install -r requirements.txt
```

Plik `requirements.txt`:

```txt
matplotlib
pandas
numpy
```

### 2.2. Uruchamianie skryptu do wykresów

Zakładamy, że w `apps/chart-generator` utworzysz skrypt, np. `plots.py`, który:

* wczytuje JSON-y z `../results/`,
* generuje wykresy dla wszystkich grup eksperymentów (3.5, 4.5, 5.0),
* zapisuje wykresy np. jako pliki PNG do `results/` lub `apps/chart-generator/plots/`.

Przykładowe wywołanie:

```bash
cd apps/chart-generator
python plots.py
```

Wewnątrz `plots.py` będziesz mógł np.:

* iterować po `results/*.json`,
* dla każdego pliku rysować:

  * wykres z siatki mutacja/krzyżowanie,
  * wykresy porównujące selekcje,
  * wykresy porównujące krzyżowania.

---

## 3. Zmiana parametrów algorytmu

Parametry algorytmu genetycznego (rozmiar populacji, liczba pokoleń, domyślne `p_mut`, `p_cross`, typ selekcji / krzyżowania) znajdują się w pliku:

```text
apps/ga-knapscack-runner/src/config.js
```

Możesz tam zmieniać m.in.:

* `populationSize`
* `numGenerations`
* `mutationRate`
* `crossoverRate`
* domyślne operatory:

  * selekcja: ruletkowa / rankingowa / turniejowa,
  * krzyżowanie: jedno- / dwupunktowe.

Do eksperymentów, które zapisują się w JSON, zestaw sensownych wartości jest już ustawiony – nie trzeba nic zmieniać ręcznie, wyniki dla wszystkich wymaganych przypadków generują się automatycznie.

---

## 4. Szybki skrót „krok po kroku”

1. **Uruchom eksperymenty dla każdego zbioru danych (JS):**

   ```bash
   cd apps/ga-knapscack-runner
   node src/main.js "../../data/backpacks/low-dimensional/f1_l-d_kp_10_269.txt"
   # powtórz dla pozostałych 3 low-dimensional i 2 large_scale
   ```

2. **Sprawdź, że w `Backpack-problem/results/` powstały odpowiednie pliki `.json`.**

3. **Uruchom generowanie wykresów (Python):**

   ```bash
   cd apps/chart-generator
   pip install -r requirements.txt
   python plots.py
   ```

4. **Wklej wygenerowane wykresy do sprawozdania** i porównaj z podanym optimum (wartość optimum możesz dopisać ręcznie w opisie lub wykorzystać w Pythonie, jeśli masz je w dodatkowym pliku/zmiennej).

```
::contentReference[oaicite:0]{index=0}
```
