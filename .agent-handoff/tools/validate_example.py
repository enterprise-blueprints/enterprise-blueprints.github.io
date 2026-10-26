"""Validate EBPKG 0.1 JSON Schema + semantic references. Requires jsonschema>=4."""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA = ROOT / 'schemas' / 'blueprint-package.schema.json'
DEFAULT_PACKAGE = ROOT / 'examples' / 'federal-oig' / 'blueprint.json'

def validate_package(package_path: Path) -> list[str]:
    data = json.loads(package_path.read_text(encoding='utf-8'))
    schema = json.loads(SCHEMA.read_text(encoding='utf-8'))
    errs = [f"schema at {'.'.join(str(i) for i in e.path) or '<root>'}: {e.message}" for e in Draft202012Validator(schema, format_checker=FormatChecker()).iter_errors(data)]
    if errs:
        return errs
    ids = [e['id'] for e in data['elements']]
    if len(ids) != len(set(ids)):
        errs.append('Duplicate element IDs')
    rels = [r['id'] for r in data['relations']]
    if len(rels) != len(set(rels)):
        errs.append('Duplicate relationship IDs')
    element_ids = set(ids)
    source_ids = {s['id'] for s in data.get('sources', [])}
    if len(source_ids) != len(data.get('sources', [])):
        errs.append('Duplicate source IDs')
    for e in data['elements']:
        for src in e.get('sourceIds', []):
            if src not in source_ids:
                errs.append(f"Element {e['id']} references unknown source {src}")
        if e.get('replacedBy') and e['replacedBy'] not in element_ids:
            errs.append(f"Element {e['id']} has unknown replacement {e['replacedBy']}")
    for r in data['relations']:
        for endpoint in ('from', 'to'):
            if r[endpoint] not in element_ids:
                errs.append(f"Relation {r['id']} has unknown {endpoint} endpoint {r[endpoint]}")
        for src in r.get('sourceIds', []):
            if src not in source_ids:
                errs.append(f"Relation {r['id']} references unknown source {src}")
    for a in data.get('assessments', []):
        qs = [q['id'] for q in a['questions']]
        if len(set(qs)) != len(qs): errs.append(f"Assessment {a['id']} duplicate question IDs")
        for q in a['questions']:
            options = {x['value'] for x in q.get('options', [])}
            for m in q.get('candidateMappings', []):
                if m['elementId'] not in element_ids: errs.append(f"Question {q['id']} unknown element {m['elementId']}")
                if m['answerValue'] not in options: errs.append(f"Question {q['id']} unmapped answer option {m['answerValue']}")
    for p in data.get('playbooks', []):
        a_ids = [a['id'] for a in p['activities']]
        if len(set(a_ids)) != len(a_ids): errs.append(f"Playbook {p['id']} duplicate activities")
    # Decomposition cycles are forbidden; other dependency edges may legitimately cycle.
    adj = {}
    for rel in data['relations']:
        if rel['predicate'] == 'decomposes_into': adj.setdefault(rel['from'], []).append(rel['to'])
    state = {}
    def visit(node):
        if state.get(node) == 1:
            errs.append(f'Decomposition cycle involving {node}')
            return
        if state.get(node) == 2: return
        state[node] = 1
        for nxt in adj.get(node, []): visit(nxt)
        state[node] = 2
    for node in list(adj): visit(node)
    return errs

if __name__ == '__main__':
    p = argparse.ArgumentParser(description=__doc__)
    p.add_argument('package', nargs='?', type=Path, default=DEFAULT_PACKAGE)
    args = p.parse_args()
    errors = validate_package(args.package)
    if errors:
        for error in errors: print('INVALID:',error,file=sys.stderr)
        sys.exit(1)
    data = json.loads(args.package.read_text(encoding='utf-8'))
    print(f"VALID: {data['packageId']} v{data['version']} | {len(data['elements'])} elements, {len(data['relations'])} relations, {len(data.get('assessments',[]))} assessments, {len(data.get('playbooks',[]))} playbooks")
