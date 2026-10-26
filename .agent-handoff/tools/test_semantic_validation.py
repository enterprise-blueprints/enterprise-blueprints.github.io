"""Tiny no-framework negative check. Agent must replace/add unit tests in monorepo."""
from pathlib import Path
from tempfile import TemporaryDirectory
import json
from validate_example import validate_package, DEFAULT_PACKAGE

def run():
    assert not validate_package(DEFAULT_PACKAGE)
    original=json.loads(DEFAULT_PACKAGE.read_text())
    with TemporaryDirectory() as d:
        dest=Path(d)/'bad.json'
        bad=json.loads(json.dumps(original))
        bad['relations'][0]['to']='eb:mission:non-existent'
        dest.write_text(json.dumps(bad))
        assert any('unknown to endpoint' in e for e in validate_package(dest))
        bad=json.loads(json.dumps(original))
        bad['elements'].append(bad['elements'][0])
        dest.write_text(json.dumps(bad))
        assert any('Duplicate element IDs' in e for e in validate_package(dest))
        bad=json.loads(json.dumps(original))
        bad['sources'].append(bad['sources'][0])
        dest.write_text(json.dumps(bad))
        assert any('Duplicate source IDs' in e for e in validate_package(dest))
    print('OK: valid fixture passes; dangling references and duplicate IDs fail')
if __name__=='__main__': run()
