#!/usr/bin/env python3
"""Create a planned building block stub.

Usage:
    python scripts/new_block.py TYPE SLUG "Title" [--domain DOMAIN] [--scope SCOPE]

Example:
    python scripts/new_block.py capability identity-verification "Identity Verification"

This writes _blocks/capability.identity-verification.md with status 'planned'.
The body holds an outline of the type's sections, from _data/block_types.yml,
inside a Liquid comment so the planned page doesn't show empty headings.
When you start writing, remove the comment lines, fill in each section, delete
the optional ones you don't need, and change the status to 'draft'. Then run
scripts/validate_content.py.
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
{{% comment %}} Outline for a {type} block. When you start writing, delete this line
and the "endcomment" line at the end. Sections marked (optional) can be removed.

{outline}
{{% endcomment %}}
"""

# Example front matter for sections that show structured fields.
FIELD_EXAMPLES = {
    "attributes": "attributes:\n  - name: Identifier\n    description: What it holds.",
    "trigger": "trigger: What starts the process.",
    "steps": (
        "steps:\n  - id: first-step\n    title: First step\n    role: Who leads it\n"
        "    description: What happens.\n    uses: [capability.example]\n"
        "    decisions:\n      - decision: What is decided\n        accountable: Who decides\n"
        "        records: What they record"
    ),
    "outcome": "outcome: What the process has produced when it ends.",
    "operations": (
        "operations:\n  - id: create\n    title: Create\n    description: What the operation does.\n"
        "    automation: with-review   # allowed | with-review | people-only\n"
        "    takes: [What it needs]          # optional\n"
        "    returns: [What it gives back]   # optional\n"
        "    authority: Who may do it, if narrower than the usual access check.   # optional"
    ),
    "states": "states:\n  - id: open\n    name: Open\n    description: What this state means.",
    "transitions": "transitions:\n  - { from: open, to: closed, via: close }",
    "every_operation": "every_operation:\n  - Something true of every operation, such as recording who did it.",
    "events": (
        "events:\n  - id: created\n    name: Something created\n    description: When it's announced.\n"
        "    raised_by: create   # an operation id; leave out for events like a deadline passing"
    ),
    "measures": "measures:\n  - id: a-measure\n    name: A measure\n    description: What it shows.",
    "personas": (
        "personas:\n  - name: Who uses it\n    summary: Who they are, and what they need.\n"
        "    ideas:\n      - Something the experience could include for them."
    ),
    "channels": "channels:\n  - name: Web\n    description: How it's used there.",
    "principles": "principles:\n  - A commitment the experience keeps, such as meeting WCAG 2.2 AA.",
    "participants": (
        "participants:\n  - name: A role\n    type: capability   # the kind of block that usually plays it, or person or agent\n"
        "    description: Its part in the pattern."
    ),
    "approach": "approach:\n  - title: First step\n    description: What happens.",
    "use_when": "use_when:\n  - A situation where the pattern fits.",
    "avoid_when": "avoid_when:\n  - A situation where it doesn't.",
    "obligations": (
        "obligations:\n  - id: first-obligation\n    level: must   # must | must-not | should\n"
        "    statement: Do something, starting with a verb."
    ),
    "waivers": "waivers:\n  - title: An exception\n    description: When it applies.\n    approved_by: Who approves it",
    "checks": "checks:\n  - title: First step\n    description: What the control does.",
    "evidence": "evidence:\n  - name: A log\n    description: What it records.",
    "tests": "tests:\n  - title: A situation to try.\n    expected: The result that shows the control works.",
    "maturity": (
        "maturity:\n  - level: Basic\n    description: What it looks like.\n"
        "    questions:\n      - A question that shows whether you're at this level?\n"
        "  - level: Established\n    description: What it looks like.\n"
        "    questions:\n      - A question that shows whether you're at this level?\n"
        "  - level: Advanced\n    description: What it looks like.\n"
        "    questions:\n      - A question that shows whether you're at this level?"
    ),
    "requirements": (
        "requirements:\n  - id: first-requirement\n    title: A short name\n"
        "    statement: What a solution has to do.\n    category: functional   # functional | nfr | constraint\n"
        "    steps: [first-step]       # leave out for the whole process\n"
        "    capabilities: [capability.example]"
    ),
    "exceptions": (
        "exceptions:\n  - title: What leaves the usual path\n    description: What happens then.\n"
        "    continues_at: first-step"
    ),
}


def outline(type_name: str, registry: dict) -> str:
    """The type's sections as Markdown headings, each with its writing prompt."""
    shared = registry.get("block_sections") or {}
    skipped = set((registry.get("omit_sections") or {}).get(type_name) or [])
    sections = [
        s
        for s in (shared.get("before") or [])
        + ((registry.get("type_sections") or {}).get(type_name) or [])
        + (shared.get("after") or [])
        if s["heading"] not in skipped
    ]
    parts = []
    for section in sections:
        optional = "" if section.get("required") else " (optional)"
        lines = [f"## {section['heading']}", "", f"<!-- {section.get('prompt', '')}{optional} -->"]
        names = section.get("fields") or []
        if names and section.get("include"):
            examples = "\n".join(FIELD_EXAMPLES.get(name, name + ": []") for name in names)
            lines += [
                "",
                f"{{% include {section['include']} %}}",
                "",
                f"<!-- Add to the front matter:\n{examples}\n-->",
            ]
        parts.append("\n".join(lines))
    kinds = (registry.get("kinds") or {}).get(type_name)
    if kinds:
        parts.insert(0, f"<!-- Add `kind:` to the front matter: {', '.join(kinds)}. -->")
    return "\n\n".join(parts)


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

    registry = load("block_types.yml")
    types = registry["types"]
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
            outline=outline(args.type, registry),
        ),
        encoding="utf-8",
    )
    print(f"Created {path.relative_to(ROOT).as_posix()} (id: {block_id}).")
    return 0


if __name__ == "__main__":
    sys.exit(main())
