
from __future__ import annotations

import argparse
import json
import math
import os
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple

import matplotlib.pyplot as plt
from matplotlib.patches import Rectangle


# ----------------------------
# Helpers: format + safety
# ----------------------------

def safe_filename(s: str) -> str:
    s = s.strip()
    s = re.sub(r"\s+", "_", s)
    s = re.sub(r"[^A-Za-z0-9._-]+", "-", s)
    s = re.sub(r"-{2,}", "-", s)
    return s[:200] if len(s) > 200 else s


def load_json(path: Path) -> Dict[str, Any]:
    with path.open("r", encoding="utf-8") as f:
        return json.load(f)


def ensure_dir(path: Path) -> None:
    path.mkdir(parents=True, exist_ok=True)


def is_number(x: Any) -> bool:
    return isinstance(x, (int, float)) and not (isinstance(x, float) and (math.isnan(x) or math.isinf(x)))

def fmt_num(v: float) -> str:
    if abs(v - round(v)) < 1e-9:
        return str(int(round(v)))
    return f"{v:g}"

def compute_series_stats(y: List[float], declared_num_generations: Optional[int]) -> Tuple[float, int, int]:
    best = max(y)
    idx_best = next((i for i, val in enumerate(y) if val == best), 0)

    iterations_executed = max(0, len(y) - 1)
    generation_best = idx_best

    return best, generation_best, iterations_executed


def add_stats_block(
    fig: Any,
    series_lines: List[Tuple["Series", Any]],
    reserved_bottom: float,
    declared_num_generations: Optional[int],
) -> List[Any]:
    n = len(series_lines)
    if n == 0:
        return []

    y_pad = 0.01
    y0 = y_pad
    y1 = max(y0 + 0.02, reserved_bottom - y_pad)

    avail = max(0.02, y1 - y0)
    row_h = avail / n

    sq = min(0.018, row_h * 0.7)
    x_sq = 0.02
    x_text = x_sq + sq + 0.01
    fs = 9 if n <= 8 else 8

    artists: List[Any] = []

    for idx, (s, line) in enumerate(series_lines):
        y_center = y1 - (idx + 0.5) * row_h
        y_sq = y_center - sq / 2

        rect = Rectangle(
            (x_sq, y_sq),
            sq,
            sq,
            transform=fig.transFigure,
            facecolor=line.get_color(),
            edgecolor="none",
        )
        fig.patches.append(rect)
        artists.append(rect)

        best, gen_best, gens = compute_series_stats(s.y, declared_num_generations)
        text = (
            f"{s.label} — "
            f"Najlepszy fitness: {fmt_num(best)}, "
            f"Generacja: {gen_best}, "
            f"Ilość generacji: {gens}"
        )
        t = fig.text(x_text, y_center, text, ha="left", va="center", fontsize=fs)
        artists.append(t)

    return artists


# ----------------------------
# Data models
# ----------------------------

@dataclass
class Series:
    label: str
    y: List[float]


@dataclass
class DatasetMeta:
    base_name: str
    category: str
    item_count: Optional[int]
    capacity: Optional[int]
    num_generations: Optional[int]


# ----------------------------
# Extraction logic (JSON -> series)
# ----------------------------

GROUP_TITLES = {
    "mutation_crossover_grid_3.5": "Ocena 3.5 — różne współczynniki mutacji i krzyżowania",
    "selection_comparison_4.5": "Ocena 4.5 — porównanie selekcji (rankingowa vs ruletkowa)",
    "crossover_comparison_4.5": "Ocena 4.5 — porównanie krzyżowania (1- vs 2-punktowe)",
    "selection_comparison_5.0": "Ocena 5.0 — porównanie selekcji (rankingowa/ruletkowa/turniejowa)",
}

GROUP_ORDER = [
    "mutation_crossover_grid_3.5",
    "selection_comparison_4.5",
    "crossover_comparison_4.5",
    "selection_comparison_5.0",
]


def extract_dataset_meta(data: Dict[str, Any]) -> DatasetMeta:
    ds = data.get("dataset", {}) or {}
    gd = data.get("gaDefaults", {}) or {}

    base_name = str(ds.get("baseName", ds.get("name", "dataset")))

    category = str(ds.get("category", "unknown"))
    item_count = ds.get("itemCount", ds.get("n", None))
    capacity = ds.get("capacity", None)

    num_generations = gd.get("numGenerations", gd.get("maxGenerations", None))

    try:
        if item_count is not None:
            item_count = int(item_count)
    except Exception:
        item_count = None

    try:
        if capacity is not None:
            capacity = int(capacity)
    except Exception:
        capacity = None

    try:
        if num_generations is not None:
            num_generations = int(num_generations)
    except Exception:
        num_generations = None

    return DatasetMeta(
        base_name=base_name,
        category=category,
        item_count=item_count,
        capacity=capacity,
        num_generations=num_generations,
    )


def build_run_label(group: str, run: Dict[str, Any]) -> str:
    selection = run.get("selection")
    crossover = run.get("crossover")
    mut = run.get("mutationRate")
    cross = run.get("crossoverRate")
    rid = run.get("id")

    def fmt_rate(x: Any) -> Optional[str]:
        if is_number(x):
            return f"{float(x):g}"
        return None

    mut_s = fmt_rate(mut)
    cross_s = fmt_rate(cross)

    if group == "mutation_crossover_grid_3.5":
        parts = []
        if mut_s is not None:
            parts.append(f"mut={mut_s}")
        if cross_s is not None:
            parts.append(f"cross={cross_s}")
        if selection:
            parts.append(str(selection))
        if crossover:
            parts.append(str(crossover))
        if parts:
            return ", ".join(parts)
        return str(rid) if rid else "run"

    if group in ("selection_comparison_4.5", "selection_comparison_5.0"):
        if selection:
            return str(selection)
        return str(rid) if rid else "run"

    if group == "crossover_comparison_4.5":
        if crossover:
            return str(crossover)
        return str(rid) if rid else "run"

    parts = []
    if selection:
        parts.append(f"sel={selection}")
    if crossover:
        parts.append(f"cx={crossover}")
    if mut_s is not None:
        parts.append(f"mut={mut_s}")
    if cross_s is not None:
        parts.append(f"cross={cross_s}")
    if not parts and rid:
        parts.append(str(rid))
    return ", ".join(parts) if parts else "run"


def extract_series_from_experiment(exp: Dict[str, Any]) -> List[Series]:
    group = str(exp.get("group", "unknown"))
    runs = exp.get("runs", []) or []
    series_list: List[Series] = []

    for run in runs:
        y = run.get("bestFitnessHistory")
        if not isinstance(y, list) or len(y) == 0:
            continue

        y_clean: List[float] = []
        for v in y:
            if is_number(v):
                y_clean.append(float(v))
            else:
                break

        if len(y_clean) == 0:
            continue

        label = build_run_label(group, run)
        series_list.append(Series(label=label, y=y_clean))

    if group == "mutation_crossover_grid_3.5":
        def sort_key(s: Series) -> Tuple[float, float, str]:
            mut = float("inf")
            cross = float("inf")
            m = re.search(r"mut=([0-9.]+)", s.label)
            c = re.search(r"cross=([0-9.]+)", s.label)
            if m:
                try: mut = float(m.group(1))
                except Exception: pass
            if c:
                try: cross = float(c.group(1))
                except Exception: pass
            return (mut, cross, s.label)
        series_list.sort(key=sort_key)
    else:
        series_list.sort(key=lambda s: s.label)

    return series_list


# ----------------------------
# Plotting
# ----------------------------

def make_title(meta: DatasetMeta, group: str, exp: Dict[str, Any]) -> str:
    ds_bits = [meta.base_name]
    if meta.category:
        ds_bits.append(f"[{meta.category}]")
    if meta.item_count is not None and meta.capacity is not None:
        ds_bits.append(f"n={meta.item_count}, cap={meta.capacity}")

    main = " ".join(ds_bits)
    group_title = GROUP_TITLES.get(group, group)

    desc = exp.get("description")
    if isinstance(desc, str) and desc.strip():
        return f"{main}\n{group_title}\n{desc.strip()}"
    return f"{main}\n{group_title}"


def plot_experiment(
    meta: DatasetMeta,
    exp: Dict[str, Any],
    out_path_base: Path,
    out_format: str = "png",
) -> Optional[List[Path]]:
    group = str(exp.get("group", "unknown"))
    series_list = extract_series_from_experiment(exp)
    if not series_list:
        return None

    declared_num_generations: Optional[int] = meta.num_generations
    bp = exp.get("baseParameters", {}) or {}
    if is_number(bp.get("numGenerations")):
        try:
            declared_num_generations = int(bp.get("numGenerations"))
        except Exception:
            pass

    fig, ax = plt.subplots(figsize=(12, 7))

    series_lines: List[Tuple[Series, Any]] = []
    for s in series_list:
        x = list(range(len(s.y)))
        (line,) = ax.plot(x, s.y, label=s.label)
        series_lines.append((s, line))

    ax.set_title(make_title(meta, group, exp))
    ax.set_xlabel("Iteracja")
    ax.set_ylabel("Najlepsza wartość fitness (best osobnik)")
    ax.grid(True, alpha=0.3)

    if len(series_list) <= 8:
        ax.legend()
    else:
        ax.legend(fontsize=8, ncol=2)

    bottom = min(0.48, 0.12 + 0.022 * len(series_lines))
    fig.tight_layout(rect=(0, bottom, 1, 1))

    extra_artists = add_stats_block(
        fig,
        series_lines=series_lines,
        reserved_bottom=bottom,
        declared_num_generations=declared_num_generations,
    )

    saved: List[Path] = []
    if out_format in ("png", "both"):
        p = out_path_base.with_suffix(".png")
        fig.savefig(p, dpi=150, bbox_inches="tight", bbox_extra_artists=extra_artists)
        saved.append(p)
    if out_format in ("pdf", "both"):
        p = out_path_base.with_suffix(".pdf")
        fig.savefig(p, bbox_inches="tight", bbox_extra_artists=extra_artists)
        saved.append(p)

    plt.close(fig)
    return saved


# ----------------------------
# Main
# ----------------------------

def find_json_files(in_dir: Path, recursive: bool) -> List[Path]:
    if recursive:
        files = sorted(in_dir.rglob("*.json"))
    else:
        files = sorted(in_dir.glob("*.json"))
    return [p for p in files if p.is_file()]


def pick_experiments_in_order(experiments: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    buckets: Dict[str, List[Dict[str, Any]]] = {}
    for exp in experiments:
        g = str(exp.get("group", "unknown"))
        buckets.setdefault(g, []).append(exp)

    ordered: List[Dict[str, Any]] = []
    for g in GROUP_ORDER:
        for exp in buckets.pop(g, []):
            ordered.append(exp)

    for g in sorted(buckets.keys()):
        ordered.extend(buckets[g])

    return ordered


def main() -> int:
    parser = argparse.ArgumentParser(description="Generuj wykresy fitness vs iteracja z JSON-ów (GA/knapsack).")
    parser.add_argument("--in", dest="in_dir", default=".", help="Katalog z plikami JSON (domyślnie: .)")
    parser.add_argument("--out", dest="out_dir", default="./plots", help="Katalog wyjściowy na wykresy (domyślnie: ./plots)")
    parser.add_argument("--format", choices=["png", "pdf", "both"], default="png", help="Format wyjściowy wykresów")
    parser.add_argument("--recursive", action="store_true", help="Szukaj JSON-ów rekurencyjnie")
    parser.add_argument("--include-unknown-groups", action="store_true",
                        help="Rysuj także nieznane group (domyślnie: tak, ale w nazwie pliku będzie group)")
    args = parser.parse_args()

    in_dir = Path(args.in_dir).resolve()
    out_dir = Path(args.out_dir).resolve()
    ensure_dir(out_dir)

    json_files = find_json_files(in_dir, args.recursive)
    if not json_files:
        print(f"[WARN] Nie znaleziono żadnych plików .json w: {in_dir}")
        return 1

    total_plots = 0

    for jf in json_files:
        try:
            data = load_json(jf)
        except Exception as e:
            print(f"[ERROR] Nie mogę wczytać JSON: {jf} ({e})")
            continue

        meta = extract_dataset_meta(data)

        experiments = data.get("experiments", []) or []
        if not isinstance(experiments, list) or len(experiments) == 0:
            print(f"[WARN] Brak 'experiments' w pliku: {jf.name}")
            continue

        experiments = pick_experiments_in_order(experiments)

        for exp in experiments:
            group = str(exp.get("group", "unknown"))

            if (group not in GROUP_TITLES) and (not args.include_unknown_groups):
                continue

            base = safe_filename(meta.base_name)
            grp = safe_filename(group)

            out_base = out_dir / f"{base}__{grp}"
            saved = plot_experiment(meta, exp, out_base, out_format=args.format)
            if saved:
                total_plots += 1
                for p in saved:
                    print(f"[OK] Zapisano: {p}")

    if total_plots == 0:
        print("[WARN] Nie wygenerowano żadnych wykresów (sprawdź strukturę JSON i bestFitnessHistory).")
        return 2

    print(f"[DONE] Wygenerowano wykresy: {total_plots}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
