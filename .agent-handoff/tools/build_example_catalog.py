"""Build the example public catalog from the active OIG package and its byte-level checksum."""
from pathlib import Path
from datetime import date
import hashlib, json
root=Path(__file__).resolve().parents[1]
p=root/'examples/federal-oig/blueprint.json'
data=json.loads(p.read_text(encoding='utf-8'))
catalog={'schemaVersion':'0.1.0','generatedAt':data['publishedAt'],'packages':[{'packageId':data['packageId'],'version':data['version'],'title':data['title'],'license':data['license'],'href':f"packages/federal-oig/{data['version']}/blueprint.json",'sha256':hashlib.sha256(p.read_bytes()).hexdigest()}]}
(root/'examples/catalog.json').write_text(json.dumps(catalog,indent=2)+'\n',encoding='utf-8')
print('Wrote OIG catalog:',catalog['packages'][0]['sha256'])
