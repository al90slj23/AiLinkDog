#!/usr/bin/env python3
r"""
Extract row data from zm_api.sql into per-table TSV files for PostgreSQL \copy.

This script is intentionally conservative:
1. It only extracts legacy tables that already exist in the MySQL dump.
2. It does not fabricate any referral_* data.
3. It keeps raw cell text and converts SQL NULL -> \N for PostgreSQL bulk load.
4. It expects Navicat-style INSERT INTO `table` VALUES (...),(...); blocks.
"""

from __future__ import annotations

import argparse
import pathlib
import re
from typing import Dict, List


LEGACY_TABLES = {
    "abilities",
    "channels",
    "checkins",
    "custom_oauth_providers",
    "logs",
    "midjourneys",
    "models",
    "options",
    "passkey_credentials",
    "prefill_groups",
    "quota_data",
    "redemptions",
    "setups",
    "subscription_orders",
    "subscription_plans",
    "subscription_pre_consume_records",
    "tasks",
    "tokens",
    "top_ups",
    "two_fa_backup_codes",
    "two_fas",
    "user_oauth_bindings",
    "user_subscriptions",
    "users",
    "vendors",
}


INSERT_RE = re.compile(r"INSERT INTO `(?P<table>[^`]+)` VALUES (?P<values>.*?);", re.S)


def split_rows(values_block: str) -> List[str]:
    rows: List[str] = []
    depth = 0
    in_string = False
    escaped = False
    start = None

    for index, char in enumerate(values_block):
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == "'":
                in_string = False
            continue

        if char == "'":
            in_string = True
            continue

        if char == "(":
            if depth == 0:
                start = index + 1
            depth += 1
            continue

        if char == ")":
            depth -= 1
            if depth == 0 and start is not None:
                rows.append(values_block[start:index])
                start = None

    return rows


def split_columns(row_text: str) -> List[str]:
    columns: List[str] = []
    current: List[str] = []
    in_string = False
    escaped = False

    for char in row_text:
        if in_string:
            current.append(char)
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == "'":
                in_string = False
            continue

        if char == "'":
            in_string = True
            current.append(char)
            continue

        if char == ",":
            columns.append("".join(current).strip())
            current = []
            continue

        current.append(char)

    columns.append("".join(current).strip())
    return columns


def decode_value(cell: str) -> str:
    if cell.upper() == "NULL":
        return r"\N"

    if len(cell) >= 2 and cell[0] == "'" and cell[-1] == "'":
        inner = cell[1:-1]
        inner = inner.replace(r"\'", "'")
        inner = inner.replace(r"\\", "\\")
        inner = inner.replace("\r\n", "\n")
        inner = inner.replace("\n", "\n")
        inner = inner.replace("\t", "\t")
        return inner

    return cell


def extract_dump(dump_path: pathlib.Path) -> Dict[str, List[List[str]]]:
    sql = dump_path.read_text(encoding="utf-8", errors="ignore")
    extracted: Dict[str, List[List[str]]] = {}

    for match in INSERT_RE.finditer(sql):
        table = match.group("table")
        if table not in LEGACY_TABLES:
            continue
        rows = split_rows(match.group("values"))
        extracted.setdefault(table, [])
        for row in rows:
            extracted[table].append([decode_value(col) for col in split_columns(row)])

    return extracted


def write_tsv(output_dir: pathlib.Path, extracted: Dict[str, List[List[str]]]) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)
    for table, rows in extracted.items():
        target = output_dir / f"{table}.tsv"
        with target.open("w", encoding="utf-8", newline="") as fh:
            for row in rows:
                normalized = [value.replace("\t", " ") if value != r"\N" else value for value in row]
                fh.write("\t".join(normalized))
                fh.write("\n")


def main() -> None:
    parser = argparse.ArgumentParser(description="Extract legacy table rows from zm_api.sql into TSV files")
    parser.add_argument("--dump", default="zm_api.sql", help="Path to zm_api.sql")
    parser.add_argument("--out", default="tmp/zm_api_tsv", help="Directory for TSV output")
    args = parser.parse_args()

    dump_path = pathlib.Path(args.dump)
    output_dir = pathlib.Path(args.out)

    extracted = extract_dump(dump_path)
    write_tsv(output_dir, extracted)

    print(f"dump={dump_path}")
    print(f"out={output_dir}")
    for table in sorted(extracted):
        print(f"{table}\t{len(extracted[table])}")


if __name__ == "__main__":
    main()
