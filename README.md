# Projekt: Algorytm genetyczny dla problemu plecakowego

Projekt składa się z dwóch głównych części:

1. **Aplikacja JS (Node)** – uruchamia algorytm genetyczny dla problemu plecakowego i zapisuje wyniki eksperymentów do plików JSON.  
   Lokalizacja: `apps/ga-knapscack-runner/`
2. **Aplikacja Python** – odczytuje pliki JSON z wynikami i generuje wykresy (matplotlib).  
   Lokalizacja: `apps/chart-generator/`


Użycie chart-generator:

W apps/chart-generator/:

.venv\Scripts\activate
pip install matplotlib
python plots.py --in ../../results --out ./plots