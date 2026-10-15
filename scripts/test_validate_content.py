"""Tests for validate_content.py.

Run with:  python -m unittest discover -s scripts -p "test_*.py"

Each test copies the real registries into a temporary folder, writes a few
records, and checks that the validator reports (or doesn't report) the
expected problem.
"""

from __future__ import annotations

import shutil
import tempfile
import textwrap
import unittest
from pathlib import Path

import validate_content

REPO = Path(__file__).resolve().parent.parent

CASE = """\
---
id: information.case
type: information
title: Case
summary: A matter.
status: published
scope: shared
domain: cross-cutting
---
A definition.
"""

CASE_MANAGEMENT = """\
---
id: capability.case-management
type: capability
title: Case Management
summary: Manage cases.
status: published
scope: shared
domain: cross-cutting
relationships:
  - type: manages
    target: information.case
---
A definition.
"""

MISSION = """\
---
id: mission.example
title: Example
summary: An example mission.
status: draft
lifecycle:
  - id: intake
    title: Intake
components:
  - ref: capability.case-management
    purpose: Track cases.
    stage: intake
---
Mission body.
"""


class ValidatorTestCase(unittest.TestCase):
    def setUp(self):
        self.root = Path(tempfile.mkdtemp())
        shutil.copytree(REPO / "_data", self.root / "_data")
        for folder in ("_blocks", "_missions", "_implementations"):
            (self.root / folder).mkdir()
        self.write("_blocks/information.case.md", CASE)
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT)
        self.write("_missions/example.md", MISSION)

    def tearDown(self):
        shutil.rmtree(self.root)

    def write(self, rel: str, text: str) -> None:
        (self.root / rel).write_text(textwrap.dedent(text), encoding="utf-8")

    def errors(self) -> str:
        return "\n".join(validate_content.validate(self.root).errors)

    def assertFails(self, *fragments: str) -> None:
        errors = self.errors()
        self.assertTrue(errors, "expected validation errors, got none")
        for fragment in fragments:
            self.assertIn(fragment, errors)


class RepositoryContent(unittest.TestCase):
    def test_repository_content_is_valid(self):
        report = validate_content.validate(REPO)
        self.assertEqual(report.errors, [], "\n".join(report.errors))


class ValidContent(ValidatorTestCase):
    def test_minimal_fixture_is_valid(self):
        self.assertEqual(self.errors(), "")

    def test_two_missions_may_reference_the_same_block(self):
        self.write("_missions/second.md", MISSION.replace("mission.example", "mission.second"))
        self.assertEqual(self.errors(), "")

    def test_planned_stub_can_be_referenced(self):
        self.write("_blocks/information.document.md", """\
            ---
            id: information.document
            type: information
            title: Document
            summary: Recorded content.
            status: planned
            scope: shared
            domain: cross-cutting
            ---
            """)
        self.write("_blocks/information.case.md", CASE.replace(
            "domain: cross-cutting\n",
            "domain: cross-cutting\nrelationships:\n  - type: references\n    target: information.document\n",
        ))
        self.assertEqual(self.errors(), "")


class IdentityErrors(ValidatorTestCase):
    def test_missing_id(self):
        self.write("_blocks/information.case.md", CASE.replace("id: information.case\n", ""))
        self.assertFails("information.case.md: missing required field 'id'")

    def test_duplicate_id(self):
        self.write("_missions/copy.md", MISSION.replace("mission.example", "capability.case-management"))
        self.assertFails("duplicate id 'capability.case-management'")

    def test_filename_must_match_id(self):
        self.write("_blocks/information.case.md", CASE.replace("id: information.case", "id: information.matter"))
        self.assertFails("does not match the filename")

    def test_id_prefix_must_match_type(self):
        self.write("_blocks/information.case.md", CASE.replace("type: information", "type: capability"))
        self.assertFails("must start with its type: 'capability.'")

    def test_missing_required_field(self):
        self.write("_blocks/information.case.md", CASE.replace("summary: A matter.\n", ""))
        self.assertFails("missing required field 'summary'")

    def test_unknown_block_type(self):
        self.write("_blocks/information.case.md", CASE.replace("type: information", "type: informaton"))
        self.assertFails("unknown block type 'informaton'", "Did you mean 'information'?")

    def test_unknown_status(self):
        self.write("_blocks/information.case.md", CASE.replace("status: published", "status: final"))
        self.assertFails("status 'final' is not defined")


class RelationshipErrors(ValidatorTestCase):
    def test_unknown_relationship_type(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("type: manages", "type: related_to"))
        self.assertFails("unknown relationship type 'related_to'")

    def test_reference_to_missing_id(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("target: information.case", "target: information.cas"))
        self.assertFails("targets ID 'information.cas', which does not exist", "Did you mean 'information.case'?")

    def test_invalid_source_type(self):
        # `manages` is only allowed from a capability, not from a process.
        self.write("_blocks/process.example.md", CASE_MANAGEMENT
                   .replace("capability.case-management", "process.example")
                   .replace("type: capability", "type: process"))
        self.assertFails("(manages -> information.case) is not allowed from type 'process'")

    def test_invalid_target_type(self):
        # `manages` must target information, not a capability.
        self.write("_blocks/capability.other.md", CASE_MANAGEMENT
                   .replace("capability.case-management", "capability.other")
                   .replace("target: information.case", "target: capability.case-management"))
        self.assertFails("cannot target type 'capability'")

    def test_same_type_rule(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("type: manages", "type: specializes"))
        self.assertFails("must connect two records of the same type")

    def test_relationship_missing_target(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("    target: information.case\n", ""))
        self.assertFails("(manages) is missing 'target'")

    def test_duplicate_relationship(self):
        text = CASE_MANAGEMENT.replace(
            "    target: information.case\n",
            "    target: information.case\n  - type: manages\n    target: information.case\n",
        )
        self.write("_blocks/capability.case-management.md", text)
        self.assertFails("is listed more than once")


class MissionErrors(ValidatorTestCase):
    def test_component_reference_to_missing_id(self):
        self.write("_missions/example.md", MISSION.replace("ref: capability.case-management", "ref: capability.case-managment"))
        self.assertFails("references ID 'capability.case-managment', which does not exist")

    def test_component_needs_purpose(self):
        self.write("_missions/example.md", MISSION.replace("    purpose: Track cases.\n", ""))
        self.assertFails("is missing 'purpose'")

    def test_unknown_stage(self):
        self.write("_missions/example.md", MISSION.replace("stage: intake", "stage: closure"))
        self.assertFails("stage 'closure' is not one of this mission's lifecycle stages")

    def test_duplicate_component(self):
        self.write("_missions/example.md", MISSION.replace(
            "    stage: intake\n",
            "    stage: intake\n  - ref: capability.case-management\n    purpose: Again.\n    stage: intake\n",
        ))
        self.assertFails("'capability.case-management' is listed 2 times")

    def test_same_block_at_different_stages_is_allowed(self):
        self.write("_missions/example.md", MISSION.replace(
            "  - id: intake\n    title: Intake\n",
            "  - id: intake\n    title: Intake\n  - id: closure\n    title: Closure\n",
        ).replace(
            "    stage: intake\n",
            "    stage: intake\n  - ref: capability.case-management\n    purpose: Close cases.\n    stage: closure\n",
        ))
        self.assertEqual(self.errors(), "")

    def test_inline_reference_to_missing_id(self):
        self.write("_missions/example.md", MISSION + '\nSee {% include ref.html id="capability.nothing" %}.\n')
        self.assertFails("inline ref.html link points to ID 'capability.nothing'")


class ImplementationRules(ValidatorTestCase):
    GUIDE = """\
    ---
    id: implementation.example
    title: Example guide
    summary: How a product realizes case management.
    status: draft
    technology: Example product
    relationships:
      - type: realizes
        target: capability.case-management
    ---
    Guide body.
    """

    def test_guide_may_realize_a_block(self):
        self.write("_implementations/example.md", self.GUIDE)
        self.assertEqual(self.errors(), "")

    def test_block_may_not_use_realizes(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("type: manages", "type: realizes"))
        self.assertFails("is not allowed from type 'capability'")


if __name__ == "__main__":
    unittest.main()
