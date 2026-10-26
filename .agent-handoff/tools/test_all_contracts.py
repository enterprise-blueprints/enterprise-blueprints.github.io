"""Validate the R1 package, its catalog and semantic integrity (positive and negative)."""
from pathlib import Path
import hashlib, json
from jsonschema import Draft202012Validator, FormatChecker
from validate_example import validate_package
from test_semantic_validation import run as run_negative
ROOT=Path(__file__).resolve().parents[1]
P=ROOT/'examples/federal-oig/blueprint.json'

def check():
    schema=json.loads((ROOT/'schemas/blueprint-package.schema.json').read_text())
    data=json.loads(P.read_text())
    errors=list(Draft202012Validator(schema,format_checker=FormatChecker()).iter_errors(data))
    assert not errors, f'Active OIG fixture schema errors: {errors}'
    assert len(data['elements'])==7, 'Expected exactly 1 mission + 5 capabilities + 1 pattern'
    assert len(data['relations'])==7, 'Expected exactly 7 relations'
    assert not validate_package(P), 'OIG fixture semantic validation failed'
    assert {e['type'] for e in data['elements']} == {'mission','capability','implementationPattern'}
    assert all(not e['id'].startswith(('eb:mission:va','eb:capability:va')) for e in data['elements'])
    print('PASS R1 OIG canonical taxonomy and schema')
    catalog=json.loads((ROOT/'examples/catalog.json').read_text())
    assert len(catalog['packages'])==1
    assert catalog['packages'][0]['sha256']==hashlib.sha256(P.read_bytes()).hexdigest(), 'catalog checksum mismatch'
    assert catalog['packages'][0]['packageId']==data['packageId']
    print('PASS active catalog integrity')
    run_negative()
    print('PASS all R1 contract checks')
if __name__=='__main__': check()
