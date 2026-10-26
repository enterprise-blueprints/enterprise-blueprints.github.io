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
id: entity.case
type: entity
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
    target: entity.case
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
        # The registries, without the real mission models and question sets: they belong to real missions.
        shutil.copytree(REPO / "_data", self.root / "_data", ignore=shutil.ignore_patterns("mission_models", "question_bank"))
        for folder in ("_blocks", "_missions", "_implementations"):
            (self.root / folder).mkdir()
        self.write("_blocks/entity.case.md", CASE)
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
        self.write("_blocks/entity.document.md", """\
            ---
            id: entity.document
            type: entity
            title: Document
            summary: Recorded content.
            status: planned
            scope: shared
            domain: cross-cutting
            ---
            """)
        self.write("_blocks/entity.case.md", CASE.replace(
            "domain: cross-cutting\n",
            "domain: cross-cutting\nrelationships:\n  - type: references\n    target: entity.document\n",
        ))
        self.assertEqual(self.errors(), "")


class IdentityErrors(ValidatorTestCase):
    def test_missing_id(self):
        self.write("_blocks/entity.case.md", CASE.replace("id: entity.case\n", ""))
        self.assertFails("entity.case.md: missing required field 'id'")

    def test_duplicate_id(self):
        self.write("_missions/copy.md", MISSION.replace("mission.example", "capability.case-management"))
        self.assertFails("duplicate id 'capability.case-management'")

    def test_filename_must_match_id(self):
        self.write("_blocks/entity.case.md", CASE.replace("id: entity.case", "id: entity.matter"))
        self.assertFails("does not match the filename")

    def test_id_prefix_must_match_type(self):
        self.write("_blocks/entity.case.md", CASE.replace("type: entity", "type: capability"))
        self.assertFails("must start with its type: 'capability.'")

    def test_missing_required_field(self):
        self.write("_blocks/entity.case.md", CASE.replace("summary: A matter.\n", ""))
        self.assertFails("missing required field 'summary'")

    def test_unknown_block_type(self):
        self.write("_blocks/entity.case.md", CASE.replace("type: entity", "type: entiy"))
        self.assertFails("unknown block type 'entiy'", "Did you mean 'entity'?")

    def test_unknown_status(self):
        self.write("_blocks/entity.case.md", CASE.replace("status: published", "status: final"))
        self.assertFails("status 'final' is not defined")


class RelationshipErrors(ValidatorTestCase):
    def test_unknown_relationship_type(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("type: manages", "type: related_to"))
        self.assertFails("unknown relationship type 'related_to'")

    def test_reference_to_missing_id(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("target: entity.case", "target: entity.cas"))
        self.assertFails("targets ID 'entity.cas', which does not exist", "Did you mean 'entity.case'?")

    def test_invalid_source_type(self):
        # `manages` is only allowed from a capability, not from a process.
        self.write("_blocks/process.example.md", CASE_MANAGEMENT
                   .replace("capability.case-management", "process.example")
                   .replace("type: capability", "type: process"))
        self.assertFails("(manages -> entity.case) is not allowed from type 'process'")

    def test_invalid_target_type(self):
        # `manages` must target an entity, not a capability.
        self.write("_blocks/capability.other.md", CASE_MANAGEMENT
                   .replace("capability.case-management", "capability.other")
                   .replace("target: entity.case", "target: capability.case-management"))
        self.assertFails("cannot target type 'capability'")

    def test_same_type_rule(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("type: manages", "type: specializes"))
        self.assertFails("must connect two records of the same type")

    def test_relationship_missing_target(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("    target: entity.case\n", ""))
        self.assertFails("(manages) is missing 'target'")

    def test_duplicate_relationship(self):
        text = CASE_MANAGEMENT.replace(
            "    target: entity.case\n",
            "    target: entity.case\n  - type: manages\n    target: entity.case\n",
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

    def test_experience_idea_needs_a_title(self):
        self.write("_missions/example.md", MISSION.replace(
            "components:\n",
            "experience_ideas:\n  - description: An idea with no name.\ncomponents:\n",
        ))
        self.assertFails("experience_ideas #1 needs a 'title'")

    def test_retired_use_cases_field_is_flagged(self):
        self.write("_missions/example.md", MISSION.replace(
            "components:\n",
            "use_cases:\n  - title: Old field\ncomponents:\n",
        ))
        warnings = "\n".join(validate_content.validate(self.root).warnings)
        self.assertIn("unknown field 'use_cases'", warnings)

    def test_inline_reference_to_missing_id(self):
        self.write("_missions/example.md", MISSION + '\nSee {% include ref.html id="capability.nothing" %}.\n')
        self.assertFails("inline ref.html link points to ID 'capability.nothing'")


class RegistryErrors(ValidatorTestCase):
    def test_every_type_must_be_placed_in_mission_layout(self):
        path = self.root / "_data/block_types.yml"
        text = path.read_text(encoding="utf-8")
        path.write_text(text.replace("  applied: [pattern]\n", "  applied: []\n"), encoding="utf-8")
        self.assertFails("type 'pattern' is missing from mission_layout")

    def test_mission_layout_connector_must_be_a_known_relationship(self):
        path = self.root / "_data/block_types.yml"
        text = path.read_text(encoding="utf-8")
        path.write_text(text.replace("      next: supports\n", "      next: helps\n"), encoding="utf-8")
        self.assertFails("uses unknown relationship 'helps'")

    def test_implies_use_must_be_forward_or_reverse(self):
        path = self.root / "_data/relationship_types.yml"
        text = path.read_text(encoding="utf-8")
        path.write_text(text.replace("implies_use: reverse", "implies_use: backward", 1), encoding="utf-8")
        self.assertFails("relationship 'enforces' has implies_use 'backward'")


PROCESS = """\
---
id: process.example
type: process
title: Example Process
summary: Work a case.
status: draft
scope: shared
domain: cross-cutting
relationships:
  - type: uses
    target: capability.case-management
trigger: A request arrives.
steps:
  - id: open
    title: Open the case
    uses: [capability.case-management]
    decisions:
      - decision: Accept the request
        accountable: Supervisor
outcome: The case is open.
---
## Definition

A process.

## Flow

{% include block-flow.html %}

## Boundaries

Not a capability.
"""


class SectionRules(ValidatorTestCase):
    def warnings(self) -> str:
        return "\n".join(validate_content.validate(self.root).warnings)

    def test_well_formed_process_has_no_warnings(self):
        self.write("_blocks/process.example.md", PROCESS)
        self.assertEqual(self.errors(), "")
        self.assertNotIn("process.example", self.warnings())

    def test_missing_required_section_is_flagged(self):
        self.write("_blocks/process.example.md", PROCESS.replace("## Boundaries\n\nNot a capability.\n", ""))
        self.assertIn("is missing the '## Boundaries' section", self.warnings())

    def test_unknown_section_is_flagged(self):
        self.write("_blocks/process.example.md", PROCESS.replace("## Boundaries", "## Responsibilities"))
        self.assertIn("'## Responsibilities' isn't a section for process blocks", self.warnings())

    def test_sections_out_of_order_are_flagged(self):
        text = PROCESS.replace("## Definition\n\nA process.\n\n", "") + "\n## Definition\n\nA process.\n"
        self.write("_blocks/process.example.md", text)
        self.assertIn("sections are out of order", self.warnings())

    def test_headings_inside_comments_are_ignored(self):
        self.write("_blocks/process.example.md", PROCESS + "\n<!--\n## Leftover\n-->\n")
        self.assertNotIn("Leftover", self.warnings())

    def test_planned_stub_needs_no_sections(self):
        self.write("_blocks/process.example.md", PROCESS.replace("status: draft", "status: planned").replace("## Steps", "## Anything"))
        self.assertNotIn("process.example", self.warnings())

    def test_field_without_its_include_is_flagged(self):
        self.write("_blocks/process.example.md", PROCESS.replace("{% include block-flow.html %}", "Some steps."))
        self.assertIn("doesn't show them. Put {% include block-flow.html %}", self.warnings())

    def test_text_field_must_be_text(self):
        self.write("_blocks/process.example.md", PROCESS.replace("trigger: A request arrives.", "trigger:\n  - A request"))
        self.assertFails("'trigger' must be a sentence of plain text")

    def test_decision_needs_a_decision(self):
        self.write("_blocks/process.example.md", PROCESS.replace("      - decision: Accept the request\n", "      - records: Something\n"))
        self.assertFails("step 'open': decision #1 needs a 'decision'")

    def test_exception_must_continue_at_a_step(self):
        self.write("_blocks/process.example.md", PROCESS.replace(
            "outcome: The case is open.\n",
            "outcome: The case is open.\nexceptions:\n  - title: Rework\n    continues_at: opne\n",
        ))
        self.assertFails("continues at 'opne', which isn't one of this process's steps", "Did you mean 'open'?")

    def test_field_on_the_wrong_type_is_flagged(self):
        self.write("_blocks/entity.case.md", CASE.replace("domain: cross-cutting\n", "domain: cross-cutting\nsteps:\n  - id: a\n    title: A\n"))
        self.assertIn("'steps' isn't used by entity blocks", self.warnings())

    def test_entries_need_their_required_keys(self):
        self.write("_blocks/process.example.md", PROCESS.replace("  - id: open\n", "  - id:\n"))
        self.assertFails("steps #1 needs 'id' and 'title'")

    def test_step_must_use_a_related_capability(self):
        self.write("_blocks/capability.other.md", CASE_MANAGEMENT.replace("capability.case-management", "capability.other"))
        self.write("_blocks/process.example.md", PROCESS.replace("uses: [capability.case-management]", "uses: [capability.other]"))
        self.assertFails("uses 'capability.other', but the process has no 'uses' relationship to it")

    def test_step_must_use_a_capability(self):
        self.write("_blocks/process.example.md", PROCESS.replace("uses: [capability.case-management]", "uses: [entity.case]"))
        self.assertFails("uses 'entity.case', which isn't a capability")

    def test_duplicate_step_ids(self):
        self.write("_blocks/process.example.md", PROCESS.replace(
            "    uses: [capability.case-management]\n",
            "    uses: [capability.case-management]\n  - id: open\n    title: Again\n",
        ))
        self.assertFails("step 'open': id is used more than once")

    def test_unknown_control_kind(self):
        self.write("_blocks/control.example.md", """\
            ---
            id: control.example
            type: control
            kind: preventative
            title: Example Control
            summary: Checks things.
            status: planned
            scope: shared
            domain: cross-cutting
            ---
            """)
        self.assertFails("kind 'preventative' is not defined", "Did you mean 'preventive'?")


CAPABILITY_MODEL = """\
operations:
  - id: open
    title: Open
    automation: allowed
  - id: close
    title: Close
    automation: people-only
    takes: [The reason]
    returns: [The closed case]
    authority: The case's owner.
states:
  - id: active
    name: Active
  - id: closed
    name: Closed
transitions:
  - { from: active, to: closed, via: close }
every_operation:
  - Records who performed it.
events:
  - id: closed
    name: Case closed
    raised_by: close
"""


class CapabilityModelRules(ValidatorTestCase):
    def write_capability(self, model: str = CAPABILITY_MODEL) -> None:
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace("---\nA definition.", model + "---\nA definition."))

    def test_well_formed_model_is_valid(self):
        self.write_capability()
        self.assertEqual(self.errors(), "")

    def test_unknown_automation_level(self):
        self.write_capability(CAPABILITY_MODEL.replace("automation: allowed", "automation: allow"))
        self.assertFails("has automation 'allow', which isn't defined", "Did you mean 'allowed'?")

    def test_contract_takes_must_be_phrases(self):
        self.write_capability(CAPABILITY_MODEL.replace("takes: [The reason]", "takes: The reason"))
        self.assertFails("operation 'close' 'takes' must be a list of short phrases")

    def test_contract_authority_must_be_text(self):
        self.write_capability(CAPABILITY_MODEL.replace("authority: The case's owner.", "authority: [owner]"))
        self.assertFails("operation 'close' 'authority' must be a sentence of plain text")

    def test_transition_must_join_known_states(self):
        self.write_capability(CAPABILITY_MODEL.replace("to: closed,", "to: done,"))
        self.assertFails("'to: done' isn't one of the states")

    def test_transition_must_use_a_known_operation(self):
        self.write_capability(CAPABILITY_MODEL.replace("via: close", "via: shut"))
        self.assertFails("'via: shut' isn't one of the operations")

    def test_duplicate_operation_ids(self):
        self.write_capability(CAPABILITY_MODEL.replace("  - id: close\n", "  - id: open\n"))
        self.assertFails("operations id 'open' is used more than once")

    def test_every_operation_must_be_sentences(self):
        self.write_capability(CAPABILITY_MODEL.replace("  - Records who performed it.\n", "  - title: Not a sentence\n"))
        self.assertFails("'every_operation' must be a list of sentences")

    def test_event_must_be_raised_by_a_known_operation(self):
        self.write_capability(CAPABILITY_MODEL.replace("raised_by: close", "raised_by: clsoe"))
        self.assertFails("is raised by 'clsoe', which isn't one of the operations", "Did you mean 'close'?")

    def test_maturity_questions_must_be_a_list(self):
        self.write_capability(CAPABILITY_MODEL + "maturity:\n  - level: Basic\n    questions: Is it working?\n")
        self.assertFails("maturity #1 'questions' must be a list of questions")

    def test_capability_omits_questions_to_ask(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace(
            "A definition.", "## Definition\n\nAbility.\n\n## Operations\n\nOps.\n\n## Boundaries\n\nLimits.\n\n## Questions to ask\n\n- One?"))
        warnings = "\n".join(validate_content.validate(self.root).warnings)
        self.assertIn("'## Questions to ask' isn't a section for capability blocks", warnings)

    def test_event_needs_an_id(self):
        self.write_capability(CAPABILITY_MODEL.replace("  - id: closed\n    name: Case closed", "  - name: Case closed"))
        self.assertFails("events #1 needs 'id' and 'name'")

    def test_capability_fields_on_an_entity_are_flagged(self):
        self.write("_blocks/entity.case.md", CASE.replace("domain: cross-cutting\n", "domain: cross-cutting\n" + CAPABILITY_MODEL))
        warnings = "\n".join(validate_content.validate(self.root).warnings)
        self.assertIn("'operations' isn't used by entity blocks", warnings)


POLICY = """\
---
id: policy.example
type: policy
title: Example Policy
summary: Limits access.
status: planned
scope: shared
domain: cross-cutting
obligations:
  - id: need-to-know
    level: must
    statement: Grant access only to those who need it.
---
"""

CONTROL = """\
---
id: control.example
type: control
kind: preventive
title: Example Control
summary: Checks access.
status: planned
scope: shared
domain: cross-cutting
relationships:
  - type: enforces
    target: policy.example
    obligations: [need-to-know]
---
"""


class GovernanceRules(ValidatorTestCase):
    def setUp(self):
        super().setUp()
        self.write("_blocks/policy.example.md", POLICY)
        self.write("_blocks/control.example.md", CONTROL)

    def test_control_may_list_obligations_it_enforces(self):
        self.assertEqual(self.errors(), "")

    def test_listed_obligation_must_exist_on_the_policy(self):
        self.write("_blocks/control.example.md", CONTROL.replace("[need-to-know]", "[need-to-knwo]"))
        self.assertFails("lists obligation 'need-to-knwo', which policy.example doesn't have", "Did you mean 'need-to-know'?")

    def test_only_enforces_may_list_obligations(self):
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace(
            "    target: entity.case\n", "    target: entity.case\n    obligations: [need-to-know]\n"))
        self.assertFails("lists 'obligations', which only an 'enforces' relationship can")

    def test_unknown_obligation_level(self):
        self.write("_blocks/policy.example.md", POLICY.replace("level: must", "level: shall"))
        self.assertFails("has level 'shall', which isn't defined")

    def test_tests_need_an_expected_result(self):
        self.write("_blocks/control.example.md", CONTROL.replace(
            "---\n", "---\n", 1).replace("    obligations: [need-to-know]\n", "    obligations: [need-to-know]\ntests:\n  - title: Someone asks.\n"))
        self.assertFails("tests #1 needs 'title' and 'expected'")


EXPERIENCE = """\
---
id: experience.example
type: experience
title: Example Workspace
summary: Where people work cases.
status: planned
scope: shared
domain: cross-cutting
personas:
  - name: Investigator
    summary: Works a few cases at a time.
    ideas:
      - A list of assigned cases.
---
"""


class ExperienceRules(ValidatorTestCase):
    def setUp(self):
        super().setUp()
        self.write("_blocks/experience.example.md", EXPERIENCE)

    def test_personas_with_ideas_are_valid(self):
        self.assertEqual(self.errors(), "")

    def test_persona_needs_a_name(self):
        self.write("_blocks/experience.example.md", EXPERIENCE.replace("  - name: Investigator\n    summary:", "  - summary:"))
        self.assertFails("personas #1 needs 'name'")

    def test_persona_ideas_must_be_sentences(self):
        self.write("_blocks/experience.example.md", EXPERIENCE.replace("      - A list of assigned cases.\n", "      - title: Not a sentence\n"))
        self.assertFails("personas #1 'ideas' must be a list of sentences")

    def test_retired_tasks_field_is_flagged(self):
        self.write("_blocks/experience.example.md", EXPERIENCE.replace("personas:\n", "tasks:\n  - id: x\n    title: X\npersonas:\n"))
        warnings = "\n".join(validate_content.validate(self.root).warnings)
        self.assertIn("unknown field 'tasks'", warnings)

    def test_participant_type_must_be_a_block_type(self):
        self.write("_blocks/pattern.example.md", """\
            ---
            id: pattern.example
            type: pattern
            title: Example Pattern
            summary: A pattern.
            status: planned
            scope: shared
            domain: cross-cutting
            participants:
              - name: Reviewer
                type: robot
            ---
            """)
        self.assertFails("participants #1 has type 'robot'. Use a building block type, or 'person' or 'agent'")


class LifecycleProcessRules(ValidatorTestCase):
    def test_lifecycle_process_must_be_a_process(self):
        self.write("_missions/example.md", MISSION.replace("lifecycle:\n", "lifecycle_process: capability.case-management\nlifecycle:\n"))
        self.assertFails("lifecycle_process 'capability.case-management' must be a process block")

    def test_lifecycle_process_must_exist(self):
        self.write("_missions/example.md", MISSION.replace("lifecycle:\n", "lifecycle_process: process.missing\nlifecycle:\n"))
        self.assertFails("lifecycle_process 'process.missing' does not exist")


class OutcomeRules(ValidatorTestCase):
    OUTCOMES = (
        "outcomes:\n"
        "  - A plain sentence still works.\n"
        "  - id: wrongdoing-addressed\n"
        "    title: Wrongdoing is addressed\n"
        "    statement: Wrongdoing is found and corrected.\n"
        "    indicators:\n"
        "      - name: Funds recovered\n"
        "        description: Money returned.\n"
        "operational_outcomes:\n"
        "  - A plain sentence still works.\n"
        "  - id: timely-triage\n"
        "    statement: Matters are triaged promptly.\n"
        "    contributes_to: [wrongdoing-addressed]\n"
        "    measures: [capability.case-management#time-to-accept]\n"
        "    supported_by: [capability.case-management#accept, entity.case]\n"
    )

    def setUp(self):
        super().setUp()
        self.write("_blocks/capability.case-management.md", CASE_MANAGEMENT.replace(
            "---\nA definition.",
            "operations:\n  - id: accept\n    title: Accept\n"
            "measures:\n  - id: time-to-accept\n    name: Time to accept\n---\nA definition.",
        ))

    def write_outcomes(self, outcomes: str) -> None:
        self.write("_missions/example.md", MISSION.replace("lifecycle:\n", outcomes + "lifecycle:\n"))

    def test_structured_outcomes_are_valid(self):
        self.write_outcomes(self.OUTCOMES)
        self.assertEqual(self.errors(), "")

    def test_measure_must_exist_on_the_block(self):
        self.write_outcomes(self.OUTCOMES.replace("#time-to-accept", "#time-to-acept"))
        self.assertFails("has no measure 'time-to-acept'", "Did you mean 'time-to-accept'?")

    def test_measure_reference_must_name_a_measure(self):
        self.write_outcomes(self.OUTCOMES.replace("[capability.case-management#time-to-accept]", "[capability.case-management]"))
        self.assertFails("must name one of the block's measures")

    def test_supported_by_operation_must_exist(self):
        self.write_outcomes(self.OUTCOMES.replace("#accept,", "#approve,"))
        self.assertFails("has no operation 'approve'")

    def test_supported_by_block_must_exist(self):
        self.write_outcomes(self.OUTCOMES.replace("entity.case]", "entity.cases]"))
        self.assertFails("'entity.cases' does not exist")

    def test_entity_has_no_items_to_name(self):
        self.write_outcomes(self.OUTCOMES.replace("entity.case]", "entity.case#title]"))
        self.assertFails("only a process's steps or a capability's operations")

    def test_outcome_needs_a_statement(self):
        self.write_outcomes(self.OUTCOMES.replace("    statement: Matters are triaged promptly.\n", ""))
        self.assertFails("operational outcome #2 must be a sentence, or have an 'id' and a 'statement'")

    def test_contributes_to_must_name_a_mission_outcome(self):
        self.write_outcomes(self.OUTCOMES.replace("[wrongdoing-addressed]", "[wrongdoing-adressed]"))
        self.assertFails("contributes to 'wrongdoing-adressed', which isn't one of this mission's outcomes", "Did you mean 'wrongdoing-addressed'?")

    def test_indicator_needs_a_name(self):
        self.write_outcomes(self.OUTCOMES.replace("      - name: Funds recovered\n", "      - label: Funds recovered\n"))
        self.assertFails("outcome 'wrongdoing-addressed'", "indicator #1 needs a 'name'")

    def test_trace_fields_belong_on_operational_outcomes(self):
        self.write_outcomes(self.OUTCOMES.replace("    title: Wrongdoing is addressed\n", "    title: Wrongdoing is addressed\n    measures: [capability.case-management#time-to-accept]\n"))
        warnings = "\n".join(validate_content.validate(self.root).warnings)
        self.assertIn("outcome 'wrongdoing-addressed': unknown field 'measures' will be ignored", warnings)


PROCESS_REQUIREMENTS = """\
requirements:
  - id: any-channel
    title: Any channel
    statement: Receive from any channel.
    category: functional
    steps: [open]
    capabilities: [capability.case-management]
"""


class ProcessDetailRules(ValidatorTestCase):
    def write_process(self, extra: str = "", step_extra: str = "") -> None:
        text = PROCESS.replace("outcome: The case is open.\n", "outcome: The case is open.\n" + extra)
        text = text.replace("    uses: [capability.case-management]\n", "    uses: [capability.case-management]\n" + step_extra)
        self.write("_blocks/process.example.md", text)

    def test_requirements_and_waits_are_valid(self):
        self.write_process(PROCESS_REQUIREMENTS, "    waits: The requester's reply.\n")
        self.assertEqual(self.errors(), "")

    def test_requirement_step_must_exist(self):
        self.write_process(PROCESS_REQUIREMENTS.replace("steps: [open]", "steps: [opne]"))
        self.assertFails("names step 'opne', which isn't one of this process's steps", "Did you mean 'open'?")

    def test_requirement_category_must_be_known(self):
        self.write_process(PROCESS_REQUIREMENTS.replace("category: functional", "category: functionality"))
        self.assertFails("category 'functionality' isn't defined", "Did you mean 'functional'?")

    def test_requirement_capability_must_be_a_capability(self):
        self.write_process(PROCESS_REQUIREMENTS.replace("capabilities: [capability.case-management]", "capabilities: [entity.case]"))
        self.assertFails("names 'entity.case' as a capability, but it's a entity")

    def test_subprocess_must_be_a_process(self):
        self.write_process(step_extra="    subprocess: capability.case-management\n")
        self.assertFails("subprocess 'capability.case-management' must be a process block")

    def test_subprocess_must_exist(self):
        self.write_process(step_extra="    subprocess: process.missing\n")
        self.assertFails("subprocess 'process.missing' does not exist")


class MissionDetailRules(ValidatorTestCase):
    def write_mission(self, extra: str) -> None:
        self.write("_missions/example.md", MISSION.replace("lifecycle:\n", extra + "lifecycle:\n"))

    def test_roles_and_systems_are_valid(self):
        self.write_mission(
            "roles:\n  - { id: owner, name: Case owner, influence: high, concerns: Delay. }\n"
            "typical_systems:\n  - { id: cms, name: Case system, kind: service, provides: [capability.case-management] }\n"
        )
        self.assertEqual(self.errors(), "")

    def test_role_influence_must_be_known(self):
        self.write_mission("roles:\n  - { id: owner, name: Case owner, influence: huge }\n")
        self.assertFails("has influence 'huge'")

    def test_system_must_provide_capabilities(self):
        self.write_mission("typical_systems:\n  - { id: cms, name: Case system, provides: [entity.case] }\n")
        self.assertFails("provides 'entity.case', which isn't a capability")


MODEL = """\
mission: mission.example
factors:
  - id: caseload
    type: condition
    title: Investigator caseload
    better: lower
    steps: [process.example#open]
    known_by: [owner]
outcome_notes:
  timely:
    questions: ["How long do cases take?"]
links:
  - { from: caseload, to: timely, effect: decreases, confidence: supported }
loops:
  - { id: crowding, title: Crowding, kind: reinforcing, factors: [caseload, timely] }
interventions:
  - id: dashboards
    title: Workload dashboards
    kind: technology
    changes: [{ factor: caseload, effect: decreases }]
    requirements: [process.example#any-channel]
"""


class MissionModelRules(ValidatorTestCase):
    def setUp(self):
        super().setUp()
        self.write("_blocks/process.example.md", PROCESS.replace("outcome: The case is open.\n", "outcome: The case is open.\n" + PROCESS_REQUIREMENTS))
        self.write("_missions/example.md", MISSION.replace(
            "lifecycle:\n",
            "roles:\n  - { id: owner, name: Case owner }\n"
            "outcomes:\n  - { id: accountability, title: Accountability, statement: People are held to account. }\n"
            "operational_outcomes:\n  - { id: timely, statement: Cases move quickly., contributes_to: [accountability] }\n"
            "lifecycle:\n",
        ))
        (self.root / "_data" / "mission_models").mkdir(exist_ok=True)

    def write_model(self, text: str = MODEL, name: str = "example") -> None:
        (self.root / "_data" / "mission_models" / f"{name}.yml").write_text(text, encoding="utf-8")

    def test_well_formed_model_is_valid(self):
        self.write_model()
        self.assertEqual(self.errors(), "")

    def test_model_must_match_a_mission(self):
        self.write_model(name="nowhere")
        self.assertFails("has no mission")

    def test_factor_type_must_be_condition_or_behavior(self):
        self.write_model(MODEL.replace("type: condition", "type: mission-outcome"))
        self.assertFails("type must be condition or behavior")

    def test_link_must_join_known_factors(self):
        self.write_model(MODEL.replace("to: timely,", "to: timley,"))
        self.assertFails("'to: timley' isn't a factor or one of the mission's outcomes", "Did you mean 'timely'?")

    def test_factor_step_must_exist(self):
        self.write_model(MODEL.replace("process.example#open", "process.example#close"))
        self.assertFails("process.example has no step 'close'")

    def test_known_by_must_be_a_role(self):
        self.write_model(MODEL.replace("known_by: [owner]", "known_by: [boss]"))
        self.assertFails("known_by 'boss' isn't one of the mission's role ids")

    def test_intervention_requirement_must_exist(self):
        self.write_model(MODEL.replace("process.example#any-channel", "process.example#every-channel"))
        self.assertFails("process.example has no requirement 'every-channel'")


class SectionRegistryRules(ValidatorTestCase):
    def test_section_field_must_be_known(self):
        path = self.root / "_data/block_types.yml"
        text = path.read_text(encoding="utf-8")
        path.write_text(text.replace("fields: [attributes]", "fields: [phases]"), encoding="utf-8")
        self.assertFails("uses unknown field 'phases'")

    def test_omitted_section_must_be_a_shared_section(self):
        path = self.root / "_data/block_types.yml"
        text = path.read_text(encoding="utf-8")
        path.write_text(text.replace("entity: [In practice,", "entity: [In practise,"), encoding="utf-8")
        self.assertFails("names 'In practise', which isn't a shared section", "Did you mean 'In practice'?")


class EntitySections(ValidatorTestCase):
    def test_entity_may_not_use_a_section_it_omits(self):
        self.write("_blocks/entity.case.md", CASE.replace("A definition.", "## Definition\n\nA matter.\n\n## In practice\n\nUsed somewhere."))
        warnings = "\n".join(validate_content.validate(self.root).warnings)
        self.assertIn("'## In practice' isn't a section for entity blocks", warnings)


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


QUESTION_SET = """\
title: Example questions
summary: For tests.
mission: mission.example
questions:
  - { id: why-now, text: "Why now?", why: It shows the urgency., informs: [outcome], ask: [owner] }
"""


class QuestionBankRules(ValidatorTestCase):
    def setUp(self):
        super().setUp()
        self.write("_missions/example.md", MISSION.replace("lifecycle:\n", "roles:\n  - { id: owner, name: Case owner }\nlifecycle:\n"))
        (self.root / "_data" / "question_bank").mkdir()

    def write_set(self, text: str = QUESTION_SET, name: str = "example") -> None:
        (self.root / "_data" / "question_bank" / f"{name}.yml").write_text(text, encoding="utf-8")

    def warnings(self) -> str:
        # Only the question bank's: the shared fixtures have warnings of their own.
        return "\n".join(w for w in validate_content.validate(self.root).warnings if "question_bank" in w)

    def test_well_formed_set_is_valid(self):
        self.write_set()
        self.assertEqual(self.errors(), "")
        self.assertEqual(self.warnings(), "")

    def test_a_standalone_set_needs_no_mission(self):
        self.write_set(QUESTION_SET.replace("mission: mission.example\n", "").replace(", ask: [owner]", ""))
        self.assertEqual(self.errors(), "")

    def test_mission_must_exist(self):
        self.write_set(QUESTION_SET.replace("mission.example", "mission.exampel"))
        self.assertFails("mission 'mission.exampel' doesn't exist", "Did you mean 'mission.example'?")

    def test_ask_needs_a_mission(self):
        self.write_set(QUESTION_SET.replace("mission: mission.example\n", ""))
        self.assertFails("only a set with a 'mission' can have it")

    def test_ask_must_be_a_mission_role(self):
        self.write_set(QUESTION_SET.replace("ask: [owner]", "ask: [boss]"))
        self.assertFails("ask 'boss' isn't one of the mission's role ids")

    def test_informs_must_be_known(self):
        self.write_set(QUESTION_SET.replace("informs: [outcome]", "informs: [outcomes]"))
        self.assertFails("informs 'outcomes' isn't one of", "Did you mean 'outcome'?")

    def test_question_ids_are_unique(self):
        self.write_set(QUESTION_SET + "  - { id: why-now, text: 'Again?', why: Twice. }\n")
        self.assertFails("the id is used twice in this set")

    def test_a_question_without_why_warns(self):
        self.write_set(QUESTION_SET.replace(" why: It shows the urgency.,", ""))
        self.assertIn("add 'why'", self.warnings())


if __name__ == "__main__":
    unittest.main()
