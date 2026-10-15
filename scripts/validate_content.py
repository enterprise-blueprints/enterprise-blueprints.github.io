#!/usr/bin/env python3
"""Validate Enterprise Blueprints content against the registries in _data/.

Usage:
    python scripts/validate_content.py            # validate the repository
    python scripts/validate_content.py --strict   # treat warnings as errors
    python scripts/validate_content.py --root DIR # validate another checkout

The script exits with status 1 when it finds errors, so CI stops before the
site is built or deployed.
"""

from __future__ import annotations

import argparse
import difflib
import re
import sys
from dataclasses import dataclass, field
from pathlib import Path

try:
    import yaml
except ImportError:  # pragma: no cover - depends on the environment
    sys.exit(
        "PyYAML is required. Install it with: pip install -r requirements-dev.txt"
    )


ID_PATTERN = re.compile(r"^[a-z][a-z0-9]*\.[a-z0-9]+(?:-[a-z0-9]+)*$")
SLUG_PATTERN = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")

BLOCK_REQUIRED = ["id", "type", "title", "summary", "status", "domain", "scope"]
BLOCK_OPTIONAL = ["relationships", "layout"]

MISSION_REQUIRED = ["id", "title", "summary", "status", "components"]
MISSION_OPTIONAL = [
    "domains",
    "outcomes",
    "lifecycle",
    "lifecycle_note",
    "roles",
    "use_cases",
    "layout",
]

IMPLEMENTATION_REQUIRED = ["id", "title", "summary", "status", "relationships"]
IMPLEMENTATION_OPTIONAL = ["technology", "layout"]

RELATIONSHIP_KEYS = {"type", "target", "note"}
COMPONENT_KEYS = {"ref", "purpose", "stage", "notes"}
STAGE_KEYS = {"id", "title", "summary"}
ROLE_KEYS = {"name", "description"}
USE_CASE_KEYS = {"title", "description"}

# Keys that would break ID-based linking or stable URLs if authors set them.
FORBIDDEN_KEYS = {
    "slug": "the filename is the record's slug; Jekyll uses it to resolve IDs",
    "permalink": "URLs are generated from the ID so links stay stable",
}

REQUIRED_RELATIONSHIP_FIELDS = ["label", "inverse_label", "sources", "targets", "description"]


@dataclass
class Record:
    kind: str  # "block", "mission", or "implementation"
    path: Path
    rel_path: str
    data: dict
    body: str


@dataclass
class Report:
    errors: list[str] = field(default_factory=list)
    warnings: list[str] = field(default_factory=list)
    counts: dict[str, int] = field(default_factory=dict)

    def error(self, where: str, message: str) -> None:
        self.errors.append(f"{where}: {message}")

    def warn(self, where: str, message: str) -> None:
        self.warnings.append(f"{where}: {message}")


def suggest(value: object, options) -> str:
    """Return a ' Did you mean ...?' hint for a likely typo, or ''."""
    if not isinstance(value, str):
        return ""
    matches = difflib.get_close_matches(value, list(options), n=1, cutoff=0.6)
    return f" Did you mean '{matches[0]}'?" if matches else ""


def missing_hint(ref: str, blocks_by_id: dict, block_files: dict) -> str:
    """Explain why a referenced block ID doesn't resolve."""
    if ref in block_files:
        return (
            f" The file {block_files[ref]} exists, but its own id is missing or "
            "different, so fix that file first."
        )
    return " Create the block (a 'planned' stub is fine) or fix the ID." + suggest(ref, blocks_by_id)


def is_blank(value: object) -> bool:
    return value is None or (isinstance(value, str) and not value.strip())


def split_front_matter(text: str) -> tuple[str, str] | None:
    """Split a Jekyll document into (front matter, body)."""
    text = text.lstrip("﻿")
    match = re.match(r"^---[ \t]*\r?\n(.*?)\r?\n---[ \t]*(?:\r?\n|$)(.*)$", text, re.S)
    if not match:
        return None
    return match.group(1), match.group(2)


def load_yaml_file(path: Path, report: Report, root: Path):
    where = path.relative_to(root).as_posix()
    if not path.exists():
        report.error(where, "registry file is missing.")
        return None
    try:
        return yaml.safe_load(path.read_text(encoding="utf-8"))
    except yaml.YAMLError as exc:
        report.error(where, f"is not valid YAML: {exc}")
        return None


def load_records(root: Path, folder: str, kind: str, report: Report) -> list[Record]:
    records = []
    directory = root / folder
    if not directory.exists():
        return records
    for path in sorted(directory.glob("*.md")):
        rel = path.relative_to(root).as_posix()
        parts = split_front_matter(path.read_text(encoding="utf-8"))
        if parts is None:
            report.error(rel, "has no YAML front matter. Start the file with a '---' block.")
            continue
        try:
            data = yaml.safe_load(parts[0]) or {}
        except yaml.YAMLError as exc:
            report.error(rel, f"front matter is not valid YAML: {exc}")
            continue
        if not isinstance(data, dict):
            report.error(rel, "front matter must be a mapping of field names to values.")
            continue
        records.append(Record(kind, path, rel, data, parts[1]))
    return records


# --------------------------------------------------------------------------
# Registries
# --------------------------------------------------------------------------

@dataclass
class Registries:
    block_types: dict
    groups: list
    relationship_types: dict
    statuses: dict
    scopes: dict
    domains: dict


def load_registries(root: Path, report: Report) -> Registries | None:
    data_dir = root / "_data"
    block_types_file = load_yaml_file(data_dir / "block_types.yml", report, root)
    relationship_types = load_yaml_file(data_dir / "relationship_types.yml", report, root)
    statuses = load_yaml_file(data_dir / "statuses.yml", report, root)
    scopes = load_yaml_file(data_dir / "scopes.yml", report, root)
    domains = load_yaml_file(data_dir / "domains.yml", report, root)
    if report.errors:
        return None

    where = "_data/block_types.yml"
    if not isinstance(block_types_file, dict) or not isinstance(block_types_file.get("types"), dict):
        report.error(where, "must contain a 'types' mapping.")
        return None
    types = block_types_file["types"]
    groups = block_types_file.get("groups") or []
    grouped = []
    for group in groups:
        for type_name in group.get("types") or []:
            if type_name not in types:
                report.error(where, f"group '{group.get('id')}' lists unknown type '{type_name}'.")
            grouped.append(type_name)
    for type_name, definition in types.items():
        if not SLUG_PATTERN.match(str(type_name)) or "-" in str(type_name):
            report.error(where, f"type '{type_name}' must be a lowercase word (it is used as the ID prefix).")
        if grouped.count(type_name) != 1:
            report.error(where, f"type '{type_name}' must appear in exactly one group.")
        for required in ("label", "group", "description"):
            if is_blank((definition or {}).get(required)):
                report.error(where, f"type '{type_name}' is missing '{required}'.")

    where = "_data/relationship_types.yml"
    if not isinstance(relationship_types, dict):
        report.error(where, "must be a mapping of relationship type names to definitions.")
        return None
    endpoint_kinds = set(types) | {"implementation"}
    for name, definition in relationship_types.items():
        definition = definition or {}
        for required in REQUIRED_RELATIONSHIP_FIELDS:
            if required not in definition:
                report.error(where, f"relationship '{name}' is missing '{required}'.")
        for end in ("sources", "targets"):
            value = definition.get(end)
            if value == "any":
                continue
            if not isinstance(value, list) or not value:
                report.error(where, f"relationship '{name}' must list its {end} or use 'any'.")
                continue
            for type_name in value:
                if type_name not in endpoint_kinds:
                    report.error(
                        where,
                        f"relationship '{name}' {end} include unknown type '{type_name}'."
                        + suggest(type_name, endpoint_kinds),
                    )

    for file_name, registry in (("statuses", statuses), ("scopes", scopes), ("domains", domains)):
        if not isinstance(registry, dict) or not registry:
            report.error(f"_data/{file_name}.yml", "must be a non-empty mapping.")

    if report.errors:
        return None
    return Registries(types, groups, relationship_types, statuses, scopes, domains)


# --------------------------------------------------------------------------
# Record checks
# --------------------------------------------------------------------------

def check_fields(record: Record, required, optional, report: Report) -> None:
    for key in required:
        if key not in record.data or is_blank(record.data[key]):
            if key == "components" and record.data.get("status") == "planned":
                continue
            report.error(record.rel_path, f"missing required field '{key}'.")
    known = set(required) | set(optional)
    for key in record.data:
        if key in FORBIDDEN_KEYS:
            report.error(record.rel_path, f"do not set '{key}': {FORBIDDEN_KEYS[key]}.")
        elif key not in known:
            report.warn(
                record.rel_path,
                f"unknown field '{key}' will be ignored." + suggest(key, known),
            )


def check_choice(record: Record, key: str, registry: dict, registry_file: str, report: Report) -> None:
    value = record.data.get(key)
    if is_blank(value):
        return
    if value not in registry:
        allowed = ", ".join(registry)
        report.error(
            record.rel_path,
            f"{key} '{value}' is not defined in _data/{registry_file}. "
            f"Allowed: {allowed}." + suggest(value, registry),
        )


def check_identity(record: Record, expected_id: str | None, report: Report) -> None:
    """Check the ID format and that the filename matches it."""
    record_id = record.data.get("id")
    if is_blank(record_id):
        return
    if not isinstance(record_id, str) or not ID_PATTERN.match(record_id):
        report.error(
            record.rel_path,
            f"id '{record_id}' must look like 'prefix.lowercase-words' "
            "(for example 'capability.case-management').",
        )
        return
    if expected_id and record_id != expected_id:
        report.error(
            record.rel_path,
            f"id '{record_id}' does not match the filename. Rename the file or "
            f"change the id so they agree (expected id '{expected_id}').",
        )


def check_body(record: Record, report: Report) -> None:
    body = record.body.strip()
    status = record.data.get("status")
    if not body and status in ("draft", "published"):
        report.error(
            record.rel_path,
            f"a {status} record needs body content. Use status 'planned' for stubs.",
        )
    if re.match(r"^#\s", body):
        report.warn(
            record.rel_path,
            "the body starts with a top-level '# ' heading; the layout already shows the title.",
        )


def endpoint_allowed(allowed, type_name: str) -> bool:
    return allowed == "any" or type_name in (allowed or [])


def describe_allowed(allowed) -> str:
    return "any block type" if allowed == "any" else ", ".join(allowed)


def check_relationships(
    record: Record,
    source_type: str | None,
    blocks_by_id: dict[str, Record],
    all_ids: set[str],
    registries: Registries,
    report: Report,
    block_files: dict[str, str],
) -> None:
    relationships = record.data.get("relationships")
    if relationships is None:
        return
    if not isinstance(relationships, list):
        report.error(record.rel_path, "'relationships' must be a list of {type, target} entries.")
        return

    seen = set()
    for index, rel in enumerate(relationships, start=1):
        where = f"{record.rel_path}: relationship #{index}"
        if not isinstance(rel, dict):
            report.error(where, "must be a mapping with 'type' and 'target'.")
            continue
        for key in rel:
            if key not in RELATIONSHIP_KEYS:
                report.warn(where, f"unknown field '{key}' will be ignored." + suggest(key, RELATIONSHIP_KEYS))
        rel_type, target = rel.get("type"), rel.get("target")
        if is_blank(rel_type):
            report.error(where, "is missing 'type'.")
            continue
        if is_blank(target):
            report.error(where, f"({rel_type}) is missing 'target'.")
            continue
        label = f"{rel_type} -> {target}"

        definition = registries.relationship_types.get(rel_type)
        if definition is None:
            report.error(
                where,
                f"({label}) uses unknown relationship type '{rel_type}'. "
                "Define it in _data/relationship_types.yml first."
                + suggest(rel_type, registries.relationship_types),
            )
            continue

        if target not in blocks_by_id:
            if target in all_ids:
                report.error(where, f"({label}) targets '{target}', which is not a building block.")
            else:
                report.error(
                    where,
                    f"({label}) targets ID '{target}', which does not exist."
                    + missing_hint(target, blocks_by_id, block_files),
                )
            continue

        if target == record.data.get("id"):
            report.error(where, f"({label}) points at the record itself.")
            continue

        if (rel_type, target) in seen:
            report.error(where, f"({label}) is listed more than once.")
        seen.add((rel_type, target))

        target_type = blocks_by_id[target].data.get("type")
        if source_type and not endpoint_allowed(definition.get("sources"), source_type):
            report.error(
                where,
                f"({label}) is not allowed from type '{source_type}'. "
                f"'{rel_type}' sources must be: {describe_allowed(definition.get('sources'))}.",
            )
        if target_type and not endpoint_allowed(definition.get("targets"), target_type):
            report.error(
                where,
                f"({label}) cannot target type '{target_type}'. "
                f"'{rel_type}' targets must be: {describe_allowed(definition.get('targets'))}.",
            )
        if definition.get("same_type") and source_type and target_type and source_type != target_type:
            report.error(
                where,
                f"({label}) must connect two records of the same type, "
                f"but links a '{source_type}' to a '{target_type}'.",
            )


def check_mission(
    record: Record,
    blocks_by_id: dict[str, Record],
    registries: Registries,
    report: Report,
    block_files: dict[str, str],
) -> None:
    data = record.data
    rel = record.rel_path

    domains = data.get("domains")
    if domains is not None:
        if not isinstance(domains, list):
            report.error(rel, "'domains' must be a list.")
        else:
            for domain in domains:
                if domain not in registries.domains:
                    report.error(
                        rel,
                        f"domain '{domain}' is not defined in _data/domains.yml."
                        + suggest(domain, registries.domains),
                    )

    outcomes = data.get("outcomes")
    if outcomes is not None and (
        not isinstance(outcomes, list) or not all(isinstance(o, str) for o in outcomes)
    ):
        report.error(rel, "'outcomes' must be a list of short sentences.")

    for key, allowed_keys, required in (
        ("roles", ROLE_KEYS, "name"),
        ("use_cases", USE_CASE_KEYS, "title"),
    ):
        entries = data.get(key)
        if entries is None:
            continue
        if not isinstance(entries, list):
            report.error(rel, f"'{key}' must be a list.")
            continue
        for index, entry in enumerate(entries, start=1):
            if not isinstance(entry, dict) or is_blank(entry.get(required)):
                report.error(rel, f"{key} #{index} needs a '{required}'.")
                continue
            for entry_key in entry:
                if entry_key not in allowed_keys:
                    report.warn(rel, f"{key} #{index} has unknown field '{entry_key}'.")

    stage_ids = []
    lifecycle = data.get("lifecycle")
    if lifecycle is not None:
        if not isinstance(lifecycle, list):
            report.error(rel, "'lifecycle' must be a list of stages.")
        else:
            for index, stage in enumerate(lifecycle, start=1):
                if not isinstance(stage, dict) or is_blank(stage.get("id")) or is_blank(stage.get("title")):
                    report.error(rel, f"lifecycle stage #{index} needs an 'id' and a 'title'.")
                    continue
                if not SLUG_PATTERN.match(str(stage["id"])):
                    report.error(rel, f"lifecycle stage id '{stage['id']}' must be lowercase words joined by hyphens.")
                if stage["id"] in stage_ids:
                    report.error(rel, f"lifecycle stage id '{stage['id']}' is used more than once.")
                stage_ids.append(stage["id"])
                for key in stage:
                    if key not in STAGE_KEYS:
                        report.warn(rel, f"lifecycle stage '{stage['id']}' has unknown field '{key}'.")

    components = data.get("components")
    if components is None:
        return
    if not isinstance(components, list):
        report.error(rel, "'components' must be a list of {ref, purpose} entries.")
        return

    seen: dict[str, list] = {}
    for index, component in enumerate(components, start=1):
        where = f"{rel}: component #{index}"
        if not isinstance(component, dict):
            report.error(where, "must be a mapping with 'ref' and 'purpose'.")
            continue
        for key in component:
            if key not in COMPONENT_KEYS:
                report.warn(where, f"unknown field '{key}' will be ignored." + suggest(key, COMPONENT_KEYS))
        ref = component.get("ref")
        if is_blank(ref):
            report.error(where, "is missing 'ref' (the ID of a building block).")
            continue
        where = f"{where} ({ref})"
        if ref not in blocks_by_id:
            report.error(
                where,
                f"references ID '{ref}', which does not exist."
                + missing_hint(ref, blocks_by_id, block_files),
            )
        if is_blank(component.get("purpose")):
            report.error(where, "is missing 'purpose': say how the block serves this mission.")
        stage = component.get("stage")
        if stage is not None:
            if not stage_ids:
                report.error(where, f"sets stage '{stage}', but the mission defines no 'lifecycle'.")
            elif stage not in stage_ids:
                report.error(
                    where,
                    f"stage '{stage}' is not one of this mission's lifecycle stages "
                    f"({', '.join(stage_ids)})." + suggest(stage, stage_ids),
                )
        seen.setdefault(ref, []).append(stage)

    for ref, stages in seen.items():
        if len(stages) < 2:
            continue
        if None in stages or len(set(stages)) != len(stages):
            report.error(
                rel,
                f"'{ref}' is listed {len(stages)} times. List each block once, or, if it "
                "really plays a different part at different stages, give every entry a "
                "distinct 'stage'.",
            )


# --------------------------------------------------------------------------
# Main
# --------------------------------------------------------------------------

def validate(root: Path) -> Report:
    report = Report()
    registries = load_registries(root, report)
    if registries is None:
        return report

    blocks = load_records(root, "_blocks", "block", report)
    missions = load_records(root, "_missions", "mission", report)
    implementations = load_records(root, "_implementations", "implementation", report)
    report.counts = {
        "blocks": len(blocks),
        "missions": len(missions),
        "implementation guides": len(implementations),
    }

    # IDs must be unique across every record family.
    ids: dict[str, str] = {}
    for record in blocks + missions + implementations:
        record_id = record.data.get("id")
        if isinstance(record_id, str) and record_id:
            if record_id in ids:
                report.error(record.rel_path, f"duplicate id '{record_id}' (also used by {ids[record_id]}).")
            else:
                ids[record_id] = record.rel_path

    blocks_by_id = {
        b.data["id"]: b for b in blocks if isinstance(b.data.get("id"), str) and ids.get(b.data["id"]) == b.rel_path
    }

    block_files = {b.path.stem: b.rel_path for b in blocks}

    for block in blocks:
        check_fields(block, BLOCK_REQUIRED, BLOCK_OPTIONAL, report)
        check_choice(block, "status", registries.statuses, "statuses.yml", report)
        check_choice(block, "scope", registries.scopes, "scopes.yml", report)
        check_choice(block, "domain", registries.domains, "domains.yml", report)
        block_type = block.data.get("type")
        if not is_blank(block_type) and block_type not in registries.block_types:
            report.error(
                block.rel_path,
                f"unknown block type '{block_type}'. Allowed: {', '.join(registries.block_types)}."
                + suggest(block_type, registries.block_types),
            )
            block_type = None
        check_identity(block, block.path.stem, report)
        record_id = block.data.get("id")
        if block_type and isinstance(record_id, str) and not record_id.startswith(f"{block_type}."):
            report.error(block.rel_path, f"id '{record_id}' must start with its type: '{block_type}.'.")
        check_body(block, report)
        check_relationships(block, block_type, blocks_by_id, set(ids), registries, report, block_files)

    for mission in missions:
        check_fields(mission, MISSION_REQUIRED, MISSION_OPTIONAL, report)
        check_choice(mission, "status", registries.statuses, "statuses.yml", report)
        check_identity(mission, f"mission.{mission.path.stem}", report)
        check_body(mission, report)
        check_mission(mission, blocks_by_id, registries, report, block_files)

    for guide in implementations:
        check_fields(guide, IMPLEMENTATION_REQUIRED, IMPLEMENTATION_OPTIONAL, report)
        check_choice(guide, "status", registries.statuses, "statuses.yml", report)
        check_identity(guide, f"implementation.{guide.path.stem}", report)
        check_body(guide, report)
        check_relationships(guide, "implementation", blocks_by_id, set(ids), registries, report, block_files)

    check_inline_refs(root, blocks + missions + implementations, blocks_by_id, set(ids), report)
    return report


INLINE_REF = re.compile(r"\{%-?\s*include\s+(block-ref|ref)\.html\s+id\s*=\s*[\"']([^\"']+)[\"']")


def check_inline_refs(root: Path, records, blocks_by_id, all_ids: set[str], report: Report) -> None:
    """Check IDs used with `{% include ref.html id="..." %}` in prose."""
    sources = [(r.rel_path, r.body) for r in records]
    for page in sorted(list(root.glob("*.md")) + list(root.glob("*.html"))):
        if page.name in ("README.md", "CONTRIBUTING.md") or page.name.startswith("enterprise-blueprints-"):
            continue
        sources.append((page.relative_to(root).as_posix(), page.read_text(encoding="utf-8")))
    for rel, text in sources:
        for include, ref in INLINE_REF.findall(text):
            if "{{" in ref:
                continue  # a Liquid variable, resolved by the template itself
            known = blocks_by_id if include == "block-ref" else all_ids
            if ref not in known:
                report.error(
                    rel,
                    f"inline {include}.html link points to ID '{ref}', which does not exist."
                    + suggest(ref, known),
                )


def main(argv=None) -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument(
        "--root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="repository root (defaults to the parent of this script's folder)",
    )
    parser.add_argument("--strict", action="store_true", help="treat warnings as errors")
    args = parser.parse_args(argv)

    report = validate(args.root.resolve())
    for message in report.errors:
        print(f"ERROR    {message}")
    for message in report.warnings:
        print(f"WARNING  {message}")

    counted = ", ".join(f"{count} {name}" for name, count in report.counts.items())
    failed = bool(report.errors) or (args.strict and bool(report.warnings))
    outcome = "FAILED" if failed else "OK"
    print(
        f"\n{outcome}: checked {counted or 'nothing'}; "
        f"{len(report.errors)} error(s), {len(report.warnings)} warning(s)."
    )
    return 1 if failed else 0


if __name__ == "__main__":
    sys.exit(main())
