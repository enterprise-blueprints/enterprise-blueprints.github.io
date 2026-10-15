#!/usr/bin/env python3
"""Create a planned building block stub.

Usage:
    python scripts/new_block.py TYPE SLUG "Title" [--domain DOMAIN] [--scope SCOPE]

Example:
    python scripts/new_block.py capability identity-verification "Identity Verification"

This writes _blocks/capability.identity-verification.md with status 'planned'.
Fill in the summary, relationships, and definition, then change the status to
'draft' and run scripts/validate_content.py.
"""

from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

import yaml

ROOT = Path(__file__).resolve().parent.parent

TEMPLATE = """\
---
id: {id}
type: {type}
title: {title}
summary: TODO — one sentence that says what this block is.
status: planned
scope: {scope}
domain: {domain}
relationships: []
# relationships:
#   - type: {example_rel}
#     target: {example_target}
---
"""

EXAMPLES = {
    "entity": ("references", "entity.document"),
    "capability": ("manages", "entity.case"),
    "process": ("uses", "capability.case-management"),
    "experience": ("supports", "process.investigation-lifecycle"),
    "policy": ("specializes", "policy.restricted-case-access"),
    "control": ("enforces", "policy.restricted-case-access"),
    "pattern": ("applies_to", "process.investigation-lifecycle"),
}


def load(name: str) -> dict:
    return yaml.safe_load((ROOT / "_data" / name).read_text(encoding="utf-8"))


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description="Create a planned building block stub.")
    parser.add_argument("type", help="block type, such as capability or policy")
    parser.add_argument("slug", help="lowercase words joined by hyphens, such as identity-verification")
    parser.add_argument("title", help="the block's readable name")
    parser.add_argument("--domain", default="cross-cutting")
    parser.add_argument("--scope", default="shared")
    args = parser.parse_args(argv)

    types = load("block_types.yml")["types"]
    if args.type not in types:
        print(f"Unknown type '{args.type}'. Choose one of: {', '.join(types)}.")
        return 1
    if not re.match(r"^[a-z0-9]+(?:-[a-z0-9]+)*$", args.slug):
        print("The slug must be lowercase letters and numbers joined by hyphens.")
        return 1
    if args.domain not in load("domains.yml"):
        print(f"Unknown domain '{args.domain}'. Add it to _data/domains.yml first.")
        return 1
    if args.scope not in load("scopes.yml"):
        print(f"Unknown scope '{args.scope}'. Choose one of: {', '.join(load('scopes.yml'))}.")
        return 1

    block_id = f"{args.type}.{args.slug}"
    path = ROOT / "_blocks" / f"{block_id}.md"
    if path.exists():
        print(f"{path.relative_to(ROOT).as_posix()} already exists.")
        return 1

    rel, target = EXAMPLES.get(args.type, ("part_of", f"{args.type}.example"))
    path.write_text(
        TEMPLATE.format(
            id=block_id,
            type=args.type,
            title=args.title,
            scope=args.scope,
            domain=args.domain,
            example_rel=rel,
            example_target=target,
        ),
        encoding="utf-8",
    )
    print(f"Created {path.relative_to(ROOT).as_posix()} (id: {block_id}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
