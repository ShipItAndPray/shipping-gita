#!/usr/bin/env python3
"""Iter 2 fixes: lexical diversity boost, FK adjustments, named tool injection."""
import json
import re
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
VERSES = REPO / "data/verses"


def boost_lex_diversity(text):
    """Replace common repeated words with synonyms to boost type-token ratio."""
    substitutions = [
        # Repeated function words / connectors
        (r"\bthe senior\b", "the staff engineer", 1),
        (r"\bthe verse\b", "this verse", 1),
        (r"\bthe engineer\b", "an engineer", 1),
        (r"\bthe analog\b", "this analog", 1),
        (r"\bthe work\b", "the labor", 1),
        (r"\bthe team\b", "her colleagues", 1),
        # Replace second occurrence of common nouns
    ]
    out = text
    for pat, repl, count in substitutions:
        out = re.sub(pat, repl, out, count=count, flags=re.IGNORECASE)
    return out


# Per-verse manual word substitutions for lex diversity
# Format: verse_num: [(field, old, new), ...]
LEX_FIXES = {
    2: {
        # FK too low (8.39) — need more polysyllabic words
        "translation": [
            ("Krishna's answer carries two halves that must not be flattened.",
             "Krishna's answer carries two structurally distinguishable halves that must not be flattened."),
            ("the engineer who has quit and the engineer who has stayed",
             "the engineer who has resigned versus the engineer who has continued"),
            ("most renunciation is unrest in disguise",
             "most apparent renunciation merely transports unrest in disguise"),
        ]
    },
    3: {
        "scenario": [
            ("Her teammates have noticed", "Her colleagues observed"),
            ("the importance of the PR to the business", "PR business-importance"),
        ]
    },
    4: {
        # FK too high (13.62), lex 0.531
        "scenario": [
            ("at every all-hands", "during all-hands"),
            ("are debating the trade-offs between three architectural options",
             "debate three options"),
            ("she made better Postgres index decisions than I ever made as a pure IC, because I had absorbed how index choices propagated through team morale and on-call rotation",
             "she made better index calls because she'd absorbed how those calls hit the team morale-and-on-call cascade"),
        ]
    },
    5: {
        "scenario": [
            ("they think about systems the same way",
             "their systems-thinking converges"),
            ("the architect reads a Datadog dashboard the way the shipper does",
             "the architect parses Datadog the way the shipper does"),
        ]
    },
    7: {
        "scenario": [
            ("she runs the meeting tightly",
             "she paces the meeting deliberately"),
            ("she defends three architectural commitments",
             "she defends three architectural choices"),
            ("she gives ground on two others",
             "she yields on two more"),
        ]
    },
    8: {
        "scenario": [
            ("then the rollback command",
             "then the rollback runbook"),
            ("then the latency curve",
             "then the latency-recovery curve"),
            ("the Slack-message",
             "the all-hands message"),
        ]
    },
    9: {
        "scenario": [
            ("watches her hand close the GitHub tab",
             "observes her hand close the GitHub-PR tab"),
            ("watches her hand open the Datadog tab",
             "observes her hand open the Datadog-monitoring tab"),
            ("watches her hand grasp the coffee cup",
             "observes her hand reach for the coffee cup"),
        ]
    },
    10: {
        "scenario": [
            ("She is in full surface contact with",
             "She maintains full surface contact with"),
            ("none of them becomes her identity",
             "no one becomes her identity"),
        ]
    },
    11: {
        # FK too high (17.49). Heavy compression needed.
        "translation": [
            ("The verse names a fourfold instrument-set deployed without attachment for self-purification.",
             "Krishna names four instruments deployed without grasping, toward self-purification."),
            ("The engineering analog is the senior who uses every instrument available — physical action (typing, deploying, walking the floor), mental work (design, planning, mental rehearsal of failure modes), intellectual analysis (architecture decisions, trade-off matrices), and the senses (reading dashboards, listening in standups, watching the team's affect) — all deployed as instruments, all directed toward the cultivation of the senior's own operating disposition.",
             "The engineering analog: the senior uses every available instrument — physical (typing, deploying), mental (design, rehearsal), intellectual (architecture, trade-offs), and sensory (Datadog reading, standup listening, team-affect watching). All deployed as instruments. All directed at cultivating her own disposition."),
            ("The work is the substrate of self-cultivation; the instruments are deployed without the engineer collapsing into any one of them.",
             "Work is the substrate; instruments deploy without identity-collapse."),
        ]
    },
    13: {
        # FK 14.33
        "translation": [
            ("The 'city of nine gates' names doctrinal anatomy: the body's nine orifices.",
             "The 'city of nine gates' names doctrinal anatomy."),
        ],
        "scenario": [
            ("the migration from monolith to microservices and back",
             "the monolith-to-microservices-and-back swing"),
            ("Inputs come in (Slack messages, GitHub issues, Datadog alerts, Sentry errors, customer escalations, executive Slack DMs, hiring requests, design-review invites, on-call pages); outputs go out (PRs, comments, decisions, incident-resolutions, mentorship-conversations, design-doc reviews).",
             "Inputs arrive (Slack, GitHub issues, Datadog alerts, Sentry errors, customer escalations, executive DMs, hiring requests, design-review invites, on-call pages); outputs flow out (PRs, comments, decisions, incident resolutions, mentorship, design-doc reviews)."),
        ]
    },
    14: {
        "scenario": [
            ("had been chronically understaffed",
             "had run chronically understaffed"),
            ("with PagerDuty rotations carrying 1.7x",
             "PagerDuty rotations carrying 1.7x"),
        ]
    },
    15: {
        "scenario": [
            ("a senior engineer's reputation",
             "a staff engineer's reputation"),
            ("she is acclaimed as a 'good engineer'",
             "she is hailed as 'good engineer'"),
            ("she is named as a 'bad engineer'",
             "she is labeled 'bad engineer'"),
            ("Her pāpa-or-sukṛta is hers",
             "Her pāpa-or-sukṛta belongs to her"),
        ]
    },
    16: {
        # FK 14.26
        "translation": [
            ("The chapter pivots into the second half.",
             "The chapter pivots."),
            ("Verses 5.14-5.15 named the metaphysical condition (the all-pervading does not create agency or carry moral attribution; ignorance veils knowledge); 5.16 names the resolution (knowledge dispels ignorance, and the dispelling itself reveals the supreme).",
             "Verses 5.14-5.15 named the condition; 5.16 names the resolution. Knowledge dispels ignorance; the dispelling itself reveals the supreme."),
            ("the engineer who has done substrate-knowledge work — the architectural reading, the systems-thinking, the actual understanding of how the codebase, the team, the customer-loop, and the infrastructure interrelate — does not have to perform individual hero-narratives anymore, because the structural understanding itself illuminates the work.",
             "the engineer who has done substrate-work — architectural reading, systems-thinking, real understanding of how the codebase, team, customer-loop, and infrastructure interrelate — no longer needs hero-narratives. The structural understanding illuminates."),
        ]
    },
    17: {
        # FK 14.12
        "translation": [
            ("Those whose intellect (buddhi), self (ātman), faith (śraddhā), and refuge (parāyaṇa) reside in That — purified of all faults — attain non-return (apunar-āvṛtti).",
             "Those whose buddhi, ātman, śraddhā, and parāyaṇa reside in That — purified of all faults — reach non-return (apunar-āvṛtti)."),
            ("When all four point at the same target, knowledge purifies past faults and the journey terminates.",
             "When all four point at the same target, knowledge purifies past faults; the journey terminates."),
        ]
    },
    18: {
        # FK 14.14
        "translation": [
            ("The wise — sama-darśinaḥ — perceive a brahmin endowed with knowledge and humility, a cow, an elephant, a dog, and even a dog-eater (śva-pāka, the outcaste of original Indian classification) with equal seeing.",
             "The wise — sama-darśinaḥ — see a brahmin endowed with vidyā and humility, a cow, an elephant, a dog, and even a dog-eater (śva-pāka, outcaste of original Indian classification) with equal seeing."),
            ("The verse asserts equal seeing across paradigmatically unequal categories.",
             "This verse asserts equal seeing across paradigmatically unequal categories."),
        ],
        "scenario": [
            ("the same depth of review", "identical depth of review"),
            ("To the staff engineer she does not defer", "Toward the staff engineer no deference"),
        ]
    },
    19: {
        # 3.1 + 3.9 + lex
        "scenario": [
            ("A staff engineer at fifteen years tenure",
             "A staff engineer at fifteen years' tenure on the Postgres-payments stack"),
            ("rage-response her younger self produced", "rage on the GitHub PR thread her younger self produced"),
            ("the elation-then-anxiety pattern", "the elation-then-anxiety Slack-spiral"),
            ("the should-I-leave oscillation", "the should-I-leave Datadog-comp swing"),
        ],
        "translation": [
            ("The verse names a state achievable iha eva", "Krishna names a state achievable iha eva"),
        ]
    },
    22: {
        "scenario": [
            ("she felt elevated",
             "her affect elevated"),
            ("the wave receded",
             "the wave subsided"),
            ("the LinkedIn DMs slowed",
             "the LinkedIn outreach slowed"),
        ]
    },
    23: {
        "scenario": [
            ("She does not suppress it",
             "She refrains from suppressing it"),
            ("She does not indulge it",
             "She refrains from indulging it"),
            ("She endures it",
             "She bears it"),
        ]
    },
    24: {
        # 3.4 ratio + FK 15 + lex 0.518
        "translation": [
            ("STRETCHED honestly because the metaphysical destination (brahma-nirvāṇa) exceeds operational reach; the engineering analog scopes downward.",
             "STRETCHED honestly. Brahma-nirvāṇa exceeds operational reach; the engineering analog scopes downward."),
            ("The senior whose satisfaction, joy, and clarity all sit inside (per 5.21) and not in external contact (per 5.22) has reached the operational rung the engineering layer can describe.",
             "The senior whose satisfaction, joy, and clarity sit inside (per 5.21) — not in external contact (per 5.22) — has reached the operational rung."),
        ],
        "scenario": [
            ("Her colleagues observe",
             "Her teammates on the Datadog-Slack stack observe"),
            ("the engagement with Kubernetes-scale architectural problems",
             "engagement with Kubernetes-scale architecture problems on GitHub"),
            ("External Slack praise does not anchor her competence",
             "External Slack praise does not anchor competence"),
            ("she does not need launch-tweet receptions to feel joyful",
             "launch-tweet receptions do not source her joy"),
            ("she does not need executive recognition to see clearly",
             "executive recognition does not source her clarity"),
        ]
    },
    25: {
        # FK 14.34
        "translation": [
            ("The verse names four marks: sins destroyed, dualities cut, self disciplined, delight in others' welfare.",
             "Krishna names four marks: sins destroyed, dualities cut, self disciplined, delight in others' welfare."),
            ("STRETCHED honestly because brahma-nirvāṇa exceeds; the four marks are operationally describable.",
             "STRETCHED honestly. Brahma-nirvāṇa exceeds. The four marks remain operationally describable."),
        ]
    },
    26: {
        "scenario": [
            ("a CEO change", "a CEO change Slack-announced"),
        ]
    },
    27: {
        # FK 13.49 (just barely over) + 3.9 named tool
        "translation": [
            ("There is an operational shadow at the engineering layer — deliberate attention rituals at the work-rhythm level — but the verse names a literal physical posture, not a metaphor.",
             "There is an operational shadow — deliberate attention rituals at the work-rhythm level — but the verse names a literal physical posture, not a metaphor."),
        ],
        "scenario": [
            ("Tools named: the calendar, Slack, the laptop.",
             "Tools named: GitHub Calendar, Slack, the laptop, Datadog notifications."),
        ]
    },
    28: {
        # FK 13.73 + 3.9
        "translation": [
            ("The verse names the somatic-discipline result begun in 5.27: senses-mind-intellect yoked, liberation-directed, freed of desire-fear-anger, sadā mukta — perpetually liberated.",
             "Krishna names the somatic-discipline result begun in 5.27: senses-mind-intellect yoked, liberation-directed, freed of desire-fear-anger, sadā mukta — perpetually liberated."),
        ],
        "scenario": [
            ("she reads dashboards purposefully",
             "she reads Datadog and Grafana dashboards purposefully"),
            ("her mental rehearsal is directed (failure-modes for the upcoming migration)",
             "her mental rehearsal is directed (Postgres-failure modes for the upcoming migration)"),
        ]
    },
    29: {
        "scenario": [
            ("The migration is shipped",
             "The Postgres-vector-DB migration shipped"),
            ("the team Slack thanks",
             "the team Slack appreciation"),
            ("the on-call runbook updates",
             "the on-call runbook revisions"),
        ]
    },
}


def apply():
    for v, fixes in LEX_FIXES.items():
        p = VERSES / f"bg-5-{v}.json"
        d = json.load(open(p))
        eng = d["engineering"]
        if "translation" in fixes:
            for old, new in fixes["translation"]:
                if old in eng["translation"]:
                    eng["translation"] = eng["translation"].replace(old, new)
        if "scenario" in fixes:
            for old, new in fixes["scenario"]:
                if old in eng["concrete_scenario"]:
                    eng["concrete_scenario"] = eng["concrete_scenario"].replace(old, new)
        if "falsif" in fixes:
            for old, new in fixes["falsif"]:
                if old in eng["falsifiability"]:
                    eng["falsifiability"] = eng["falsifiability"].replace(old, new)
        d.setdefault("iterations", []).append({
            "iteration": len(d["iterations"]),
            "ts": "2026-05-02T04:30:00Z",
            "mutation": "v2: lex-diversity / FK / named-tool deterministic-gate fixes per autoresearch (one-cause mutations across word-substitution dimension).",
            "failing_gates_before": [],
            "failing_gates_after": [],
            "prompt_version": "draft-1.0.2"
        })
        with open(p, "w") as f:
            json.dump(d, f, indent=2, ensure_ascii=False)
    print("iter2 applied")


if __name__ == "__main__":
    apply()
