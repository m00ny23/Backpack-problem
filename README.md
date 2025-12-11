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
```
