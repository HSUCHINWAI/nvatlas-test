#!/usr/bin/env python3
"""Verify the published NVAtlas data contract and corpus totals."""

from __future__ import annotations

import csv
import json
import math
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
JSON_PATH = ROOT / "corpus.json"
CSV_PATH = ROOT / "NVAtlas-corpus.csv"

CATEGORY_COUNTS = {
    "direct": 334,
    "modulation": 70,
    "specification": 55,
    "stative": 27,
    "weak": 14,
}
REQUIRED_FIELDS = ["source_text", "target_text", "source", "category", "human_checked"]


def main() -> None:
    payload = json.loads(JSON_PATH.read_text(encoding="utf-8"))
    rows = payload["entries"]
    metadata = payload["metadata"]

    assert len(rows) == 500, len(rows)
    assert metadata["entries"] == 500
    assert metadata["unique_pairs"] == 492
    assert metadata["source_verified"] == 500
    assert metadata["spot_checked"] == 50
    assert metadata["spot_check_seed"] == 2026
    assert len({row["id"] for row in rows}) == 500

    for row in rows:
        for field in REQUIRED_FIELDS:
            assert row.get(field) not in (None, ""), (row["id"], field)
        assert row["category"] in CATEGORY_COUNTS, row["category"]
        assert row["human_checked"] in {"yes", "no"}

    assert Counter(row["category"] for row in rows) == Counter(CATEGORY_COUNTS)
    assert sum(CATEGORY_COUNTS.values()) == 500
    assert len({(row["source_text"], row["target_text"]) for row in rows}) == 492
    assert sum(row["duplicate"] for row in rows) == 15
    assert sum(1 for row in rows if row["human_checked"] == "yes") == 50
    assert len({row["key_term"] for row in rows}) == 195
    assert len({row["target_verb"] for row in rows}) == 277

    xs = [row["english_chars"] for row in rows]
    ys = [row["chinese_chars"] for row in rows]
    mx = sum(xs) / len(xs)
    my = sum(ys) / len(ys)
    r = sum((x - mx) * (y - my) for x, y in zip(xs, ys)) / math.sqrt(
        sum((x - mx) ** 2 for x in xs) * sum((y - my) ** 2 for y in ys)
    )
    assert abs(r - 0.673945063822322) < 1e-9

    with CSV_PATH.open(encoding="utf-8-sig", newline="") as handle:
        csv_rows = list(csv.DictReader(handle))
    assert len(csv_rows) == 500, len(csv_rows)
    for field in REQUIRED_FIELDS + ["id", "source_id", "unit", "key_term", "target_verb"]:
        assert field in csv_rows[0], field
    assert [int(row["id"]) for row in csv_rows] == sorted(int(row["id"]) for row in csv_rows)
    assert {row["id"] for row in csv_rows} == {str(row["id"]) for row in rows}

    print("PASS: 500 entries; 492 unique pairs; 50 source-assisted checks")
    print("PASS: category totals", dict(CATEGORY_COUNTS), "sum to 500")
    print("PASS: required fields present in JSON and NVAtlas-corpus.csv")
    print(f"PASS: Pearson length correlation r = {r:.3f}")


if __name__ == "__main__":
    main()
