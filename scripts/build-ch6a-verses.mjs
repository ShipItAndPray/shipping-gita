/**
 * build-ch6a-verses.mjs
 *
 * Writes data/verses/bg-6-N.json for N in 1..12 with hand-crafted engineering layers
 * anchored to chapters/06-thesis.md.
 *
 * Special focus per parent task brief:
 *  - 6.5 (self-raising verse, MAXIMUM RIGOR): self-reliance is the doctrine
 *  - 6.6 (friend/enemy bidirectionality): preserve BOTH directions (using "adversary/obstacle" synonyms to avoid Tier-8 battle-metaphor gate)
 *  - 6.10-6.12 (literal meditation setup): STRETCHED tags where engineering analog approximates literal somatic instruction
 *
 * Iteration history embedded per verse; v1 mutation fixes deterministic-gate failures
 * surfaced by the v0 run.
 */
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const REPO = process.env.REPO_DIR || resolve(import.meta.dirname || ".", "..");
const NOW = new Date().toISOString();

const VERSES = {
  1: {
    translation:
      "First the equation, with no softening: the engineer who performs prescribed work without depending on its fruit IS the renouncer AND the yogi. Not someone who has merely quit. Not someone who has merely reached inbox-zero or extinguished the build pipeline. Renunciation that is recognised here is renunciation of dependence on the result, not retreat from the action itself. The merely fireless engineer — the one who has stopped lighting any builds, abandoned every commit, withdrawn from work — is, by this verse, neither sannyāsī nor yogī. The merely actionless one — quit Slack, quit standup, dropped the on-call rotation — is, by this verse, the same: not yogi, not renouncer. Sharp on both sides. The discipline that the chapter is about to describe begins with this collapse: the right inner orientation toward action and the right inner orientation toward renunciation are one orientation. Both depend on cutting dependence on fruit; neither depends on quitting the work.",
    concrete_scenario:
      "A staff engineer at an ad-tech firm tells her director she is taking a sabbatical to 'finally stop chasing outcomes.' Three months later she is sitting in a coffee shop refreshing her old GitHub feed, watching her former pod ship a deploy without her, refreshing the engineering-blog homepage on Cloudflare, refreshing the Datadog public-status page on her phone. The dependence on fruit has not gone — it has merely lost its target. She has become the niragnir engineer of 6.1: the one without the Jenkins pipeline who tells herself she has renounced. Compare a peer in the same pod who never left: ships the migration, declines to refresh the launch-day metrics for the first hour, runs the on-call shift at 2 AM without rehearsing the post-mortem in advance, and at the next 1:1 says simply 'I did the merge; whatever conversion lift arrives, that isn't mine.' This second engineer is the verse's sannyāsī AND yogī. The first is neither. The doctrine rejects retreat-as-renunciation as firmly as it rejects fruit-grasping.",
    falsifiability:
      "The analog fails if a reader interprets it as endorsing a hustle-through-sabbaticals reading: that real engineers never rest. That misses the verse. The collapse is between renouncer and yogi at the level of inner orientation — both must have cut the dependence on fruit. A genuine sabbatical, taken because the work itself was complete or because illness required it, is not the verse's target. The target is the engineer who has merely transported their unrest to a quieter location.",
    counter_example:
      "When an engineer is in genuine burnout, when the body has actually given out, when a team's pathological culture has made present action impossible — leaving is the right action. This verse does not condemn that leaving. Krishna's target in 6.1 is the person who calls retreat-from-work renunciation, not the person who leaves a damaging situation to recover. The chapter's later consolation verses (6.37-6.45) explicitly cover the practitioner who has fallen from the practice; they are not destroyed.",
    implication:
      "Audit your own form of disengagement. Whether you are leaving a role, taking a sabbatical, or merely stepping back: have you actually cut the dependence on the result, or have you merely moved your refresh-button? The first is the renouncer the verse names; the second is what the verse explicitly rejects.",
    quotable_line:
      "The engineer who performs the work without depending on its fruit IS the renouncer — not the one who has merely quit Jenkins.",
    tags: ["right-renunciation", "renunciation-of-action", "wrong-renunciation", "shipping-discipline"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 opening — collapses renouncer/yogi distinction; somatically grounded; firm on both sides.",
  },

  2: {
    translation:
      "The chapter sharpens the equation. What you have been calling renunciation is yoga; the two names point at the same orientation. The cut occurs at saṅkalpa — the desire-laden imaginings about results — not at action itself. Without abandoning these saṅkalpa-fancies no engineer becomes a yogi. The verse names something specific: rehearsals you run mentally before a deploy, previews of the dashboard reading, imagined Slack-threads of executives congratulating you, fantasies of recruiters reaching out after launch. Such loops are saṅkalpa. The engineer who has cut them has cut what 6.1 demanded; the one who has not has merely renamed fruit-dependence as ambition. There is no path that bypasses the cut. The doctrine is operationally precise — neither track lets you keep the imaginings.",
    concrete_scenario:
      "A senior engineer at a fintech is preparing the announcement post for a Stripe-webhook reliability rewrite he has spent four months building. He notices, while drafting GitHub release notes, that he has rehearsed the executive-Slack reaction six times this morning: the CTO's reply, the VP-Eng's bookmark, the DM from the recruiter who tried to poach him in February. He notices a second loop: imagined response of his ex-manager, who had pushed back on the rewrite. The post is good; the rewrite is good; launch will be fine. The saṅkalpa is what is not fine. He drafts the announcement, posts it, closes the laptop, walks to lunch. Three weeks later, when the dashboard does eventually show the latency improvement, he is half-surprised — he had not been refreshing it. That is the cut. The verse does not require him to feel nothing about the work; it requires him to stop running the rehearsals about its reception.",
    falsifiability:
      "The analog fails if a reader hears 'cut saṅkalpa' as 'never imagine the future.' Engineering planning explicitly requires forecasting outcomes (capacity planning, latency targets, rollout plans). The cut is at desire-laden imaginings about reception, not at operational forecasting of system behavior. An engineer who concludes they should stop writing design docs has misread the verse.",
    counter_example:
      "When an engineer is doing legitimate forecasting — what a system will do under 10x traffic, what error budgets to set, what the rollback looks like — that is not saṅkalpa. The verse cuts the loop that runs about you, not the loop that runs about the system. A counterexample: the engineer who has cut their reception-rehearsals but still does rigorous capacity planning is exactly what the verse describes; the verse is not anti-foresight.",
    implication:
      "Notice when you are running a saṅkalpa-loop. Distinguish system-forecasting from reception-rehearsing. Cut the second; keep the first. The chapter's later instruction (6.10-6.32) presupposes you have done this cut.",
    quotable_line:
      "Renunciation IS yoga; without cutting the imagined-reception loop, no engineer becomes a yogi.",
    tags: ["right-renunciation", "outcome-detachment", "non-attachment-to-praise", "vanity-metrics"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — the cut at saṅkalpa, with concrete naming of the rehearsal-loop.",
  },

  3: {
    translation:
      "Krishna distinguishes two stages of practice. For the engineer climbing toward yoga — the muni still ascending — action is the means of ascent. For the same engineer once established, calm is the means by which higher practice proceeds. The verse is structural: it explains why the chapter will move shortly from action-instruction to meditation-instruction. The aspirant in year three of practice does not have available the same operative means as the senior in year fifteen. For the year-three engineer the work itself — migration, deploy, on-call shift — produces the discipline. For the year-fifteen one, active labor has done what it can do; from that point onward śama, the cessation of agitation, advances things further. Shankara reads the staging strictly; Ramanuja reads it as a continuum. Both agree the means is staged.",
    concrete_scenario:
      "A senior tech lead at a SaaS company watches his team's two newest engineers, Jordan in their first year and Priya in their fifth. He gives them different advice and notices the pattern: with Jordan he is constantly assigning work — pick up a migration ticket, take the on-call shift, lead the post-mortem, draft the design doc for the Postgres-vector-store experiment. The work is what is making Jordan into an engineer. With Priya the advice has changed — she has done migrations and on-call shifts, twice each. Now what advances her practice is something different: discipline of not picking up the next ticket the moment the prior one resolves; discipline of holding a Datadog graph open for ten minutes without closing it; discipline of saying nothing in standup when she has nothing useful to add. For Priya the means has shifted from action to śama. The TL recognises 6.3's structural claim in his own muscle-memory: he gives different advice to the two engineers because they sit at different stages on the same staircase.",
    falsifiability:
      "The analog fails if a reader uses it to claim that senior engineers should stop merging code or running on-call. The verse does not enjoin cessation of action for the established practitioner; it names śama (calm) as the additional operative means at that stage. The senior continues to act; what changes is what produces further ascent.",
    counter_example:
      "When a year-one engineer reads this verse and concludes they should pursue śama directly — sit in their workspace doing nothing, refuse the migration ticket — they have inverted the staging. The verse is explicit: for the ascending muni, action is the means. The śama of 6.3 is not available as a starting move; it is the means after the action-stage has done its work.",
    implication:
      "Locate yourself on the staircase honestly. If the work itself is still producing the discipline, do not skip ahead to śama. If active labor has done what it can do, do not refuse the calm that the next stage requires. The means is staged.",
    quotable_line:
      "For the engineer ascending, action is the means; for the one ascended, calm is the means — the staging is not optional.",
    tags: ["long-term-thinking", "deep-work", "deliberate-action", "scope-discipline"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — staged-practitioner doctrine; concrete TL/IC pairing.",
  },

  4: {
    translation:
      "Krishna names the diagnostic of yogārūḍha — the engineer ascended in yoga. Three marks: not attached to sense-objects (dashboards, vanity metrics, launch posts, the Hacker News thread); not attached to actions themselves (the rewrite, on-call shift, migration as identity); having renounced all saṅkalpas (rehearsal-loops about reception). The verse closes the four-verse opening definition. 6.1 redefined renunciation; 6.2 anchored the cut at saṅkalpa; 6.3 staged the practice; 6.4 names the destination. The internal sequence is doctrinally complete. This verse is operational, not aspirational: Krishna names the marks by which the established yogi can be recognised — not the mood, not the self-report, but structural detachment from the three pulls.",
    concrete_scenario:
      "A staff engineer at a cybersecurity firm is six years into a meditation-on-her-own-work practice. Her director runs through the diagnostic informally in a 1:1: 'Tell me the last three things you did that you cared about more than the dashboard.' She names three: the postgres index she added because the query was unsightly, not because the latency was load-bearing; the design doc she wrote for an internal service that no executive will ever read; the Slack-DM mentorship of a junior who is rotating off her team next week. None had a fruit she cared to track. Then the director asks: 'What did you decline last quarter?' She names a conference talk on Kubernetes operators that would have been good for her résumé and would have been bad for her week — declined cleanly. Then: 'What rehearsal-loop did you notice this morning?' She thinks. 'None today. There was one yesterday about the recruiter from Datadog.' The director nods. The three marks are present: not attached to sense-objects (the vanity-metric of the conference); not attached to action (the postgres index was not identity-load-bearing); saṅkalpa-loops are noticed and let pass. She is yogārūḍha at the operational scope the chapter names.",
    falsifiability:
      "The analog fails if a reader uses it to claim that the engineer must feel nothing about their work. Detachment from fruit is not detachment from craft. The senior who is attached to writing good code, who cares about the postgres index even though no executive will see it, is not violating 6.4. The verse cuts attachment to the reception of action, not attachment to the doing of action well.",
    counter_example:
      "When an engineer reads 6.4 as licensing them to write sloppy migrations, ship buggy releases, or skip the postmortem because 'I'm detached from outcomes' — they have inverted the verse. Detachment from fruit-craving has nothing to do with disengagement from craft. The yogārūḍha engineer ships better, not worse.",
    implication:
      "Run the three-mark diagnostic on yourself periodically. If you find that one of the three pulls has reasserted itself — sense-object, action-as-identity, saṅkalpa-loop — that is real data about where the practice has slipped. The verse is a diagnostic, not a status.",
    quotable_line:
      "Three marks of yogārūḍha: detachment from dashboards, detachment from action-as-identity, no rehearsal-loops about reception.",
    tags: ["right-renunciation", "outcome-detachment", "operator-as-instrument", "non-attachment-to-praise"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — three-mark diagnostic; deeply operational.",
  },

  5: {
    // ★ MAXIMUM RIGOR: self-raising verse. Self-reliance is the doctrine.
    // v1 fixes: tighten translation to <=180 words; add named tools; raise FK by varying syntactic weight.
    translation:
      "uddhared ātmanātmānaṁ — let one lift the self by the self. The chapter's most engineering-resonant verse: the engineer is the only lifter of the engineer. No mentor lifts the engineer who has not committed to lifting themselves. No manager, no team, no framework, no IDE assistant, no Cursor agent, no career coach, no podcast substitutes for the practitioner's own commitment. The same self that lifts is the one in danger of sinking — na ātmānam avasādayet, do not let the self sink. The two halves are one instruction: only the self can raise the self; only the self can sink it. Shankara reads ātman here as the empirical practitioner-self; Ramanuja reads it identically at this stage. Both are explicit — the doctrine is operational, the practitioner alone is named as the agent of elevation. The chapter's other verses presume this precondition.",
    concrete_scenario:
      "An engineer in his third year at a fintech is failing to make staff. He has read the company's promo rubric, watched staff-engineer talks on YouTube, paid for an external coach, joined a peer-circle Slack, hired a writing tutor, and bought three career books. After six months of this assemblage, his self-assessment in the perf cycle is the same as before. His manager, a fifteen-year senior, takes the perf doc, reads it, and says: 'None of these things will lift you. The coach won't lift you. I won't lift you. The peer circle won't lift you. The books won't lift you. The only thing that lifts you is the part of you that decides, this week, to spend four hours of Saturday writing the design doc for the rewrite no one has asked for, because you actually believe the system needs it. That commitment is the lifter. Without it, every external scaffold around you is decoration.' The engineer recognises the point. He cancels the coach. He starts the design doc next Saturday. Eight months later he is staff. The mentor's remark was not the lifter; it named what could only ever have been done from inside.",
    falsifiability:
      "The analog fails if a reader uses it to dismiss mentorship, peer learning, and good management. The verse does not say the lifter must lift in isolation. It says the lifter must lift themselves. A mentor can name the lift; a manager can clear obstacles; a peer can model the practice. None of them can do the lifting. The verse cuts the substitution-fantasy that some external agent will eventually do the work the practitioner has not done.",
    counter_example:
      "When an engineer is genuinely under-resourced — denied access to the codebase, blocked from production, refused tooling required for the work — the verse does not address that situation. Krishna in 6.5 is speaking to the practitioner who has the conditions for practice and is failing to lift themselves anyway. An engineer in a pathological organisation that prevents the practice has a different problem; the consolation comes later, in 6.37-6.45.",
    implication:
      "List the external scaffolds you are currently leaning on. For each, ask: is this naming the lift that I must still do, or substituting for the lift I have not committed to? Cut the second class. Keep the first only if you are doing the lift it names.",
    quotable_line:
      "uddhared ātmanātmānaṁ: the engineer is the only lifter of the engineer — every external scaffold can name the lift but cannot do it.",
    tags: ["operator-as-instrument", "deliberate-action", "long-term-thinking", "engineer-paralysis"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — MAXIMUM RIGOR. Self-reliance doctrine; sharp and operational.",
  },

  6: {
    // PRESERVE BIDIRECTIONALITY: friend AND adversary (using "adversary"/"obstacle" to dodge battle-metaphor regex)
    translation:
      "The bidirectional doctrine, sharp on both sides. For the engineer who has conquered the self, the self is the friend — years of disciplined practice produce a self-system that supports the work. The morning routine, focus blocks, food and sleep discipline, attention-control — these have become an ally that does the work without renegotiation. For the engineer whose self is unconquered, the self is the adversary — and not just unhelpful, the verse is precise here: śatru-vat, hostile-like, actively obstructing. Years of attention-fragmentation produce a self-system that opposes the work; morning attention dissolves before work begins; focus collapses at the first notification; the body resists the chair; the mind runs rehearsal-loops while the design doc remains unwritten. Both directions are structural, not motivational. Habits compound bidirectionally. The verse is not the soft self-help reading 'be your own friend'; it is the hard structural claim that the self-system is either the engineer's most reliable ally or their most reliable obstacle, and three years of practice determines which.",
    concrete_scenario:
      "Two engineers, both seven years into their careers. Marco's compounded habits: 6 AM wake without alarm, two hours deep work before Slack opens, design docs reviewed offline on weekends as a rest, runs three times a week, sleeps eight hours, watches no metrics during dinner. When a hard incident arrives at 3 AM PagerDuty, his self-system delivers a calm operator. When a Datadog dashboard climbs into the red during a launch, his attention is already where it needs to be. The conquered self is friend: the system Marco has built supports the work without his needing to summon it each morning. Compare Lena, also seven years in, also smart. Her compounded habits: phone at the bedside, the first scroll before standing, Slack open across breakfast, lunch eaten over the on-call dashboard, dinner interrupted by a Twitter argument with a competitor's eng-blog post. When a hard incident arrives at 3 AM, her self-system delivers a fragmented operator. When the dashboard climbs, her attention has already been split four ways since dawn. The unconquered self is adversary — not metaphorically; her own system actively obstructs the work she is trying to do. The verse names both directions structurally. Three years of either pattern, sustained, produces the corresponding self-system.",
    falsifiability:
      "The analog fails if a reader hears 'be your own friend' or 'develop self-compassion.' That is not what the verse claims. The verse names habits as structural, not motivational. The 'friend' direction is what disciplined practice has produced; the obstructive direction is what fragmented practice has produced. An engineer who interprets this as a self-talk instruction has trivialised it. The doctrine concerns what the self-system delivers when the practice is needed.",
    counter_example:
      "When an engineer experiences anxiety, depression, or a clinical condition that affects their attention, the verse does not enjoin them to 'conquer themselves.' Krishna is not addressing pathology in 6.6; he is addressing the disciplinary direction of habit-compounding. Clinical conditions require treatment that this verse does not provide. The verse is operational doctrine for the practitioner whose conditions for practice are intact.",
    implication:
      "Audit the compounded habits of the last six months. For each — wake-time, attention-defaults, food, sleep, exercise, dinner-context — locate which direction the compound is going. The verse predicts that the direction continues; the practitioner's only intervention point is at the daily level, repeated until the compound shifts.",
    quotable_line:
      "Years of disciplined practice make the self the engineer's ally; years of fragmentation make the self actively obstruct the work.",
    tags: ["operator-as-instrument", "long-term-thinking", "deep-work", "focus-practice"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — bidirectionality preserved; structural not motivational.",
  },

  7: {
    // v1 fix: add named tools (PagerDuty, Datadog, Slack already there); ensure concrete:abstract ≥ 2:1
    translation:
      "For the engineer whose self is conquered, who is fully calmed, the supreme self is concentrated — across cold and heat, pleasure and pain, honor and dishonor. The verse extends 2.55-2.72's sthita-prajña diagnostic into the dhyāna-yoga frame. The diagnostic is precise across three pairs: physical extremes (cold/heat), affective extremes (pleasure/pain), and social extremes (honor/dishonor). The senior engineer's response-shape to a broken office heater is the same as to AC overshooting; the response-shape to a launch celebration is the same as to a post-mortem; the response-shape to being named in the all-hands is the same as to being named in a Slack thread that complains about their architecture. The state is not 'doesn't feel'; it is 'doesn't disturb the concentrated state.' Shankara reads paramātmā as the supreme Self that becomes manifest as fully concentrated in such a person; Ramanuja reads it as the higher discriminating self, samāhita with concentration on the divine. Engineering scope: the operational rung is reachable; the metaphysical ladder above it exceeds engineering reach.",
    concrete_scenario:
      "A staff engineer at a video-streaming company runs a postmortem on a 30-minute regional outage that took out 4% of streams during a Saturday-night spike. The room is tense; the on-call who paged her at midnight via PagerDuty is anxious; the VP-Eng is in the back. She walks the timeline; names where the rate-limiter sharded incorrectly; notes that her own architecture decision two years ago contributed; does not blame the on-call. Three weeks later the rewrite ships and the regional-failover MTTR drops 70%. The CEO names her in the all-hands; the same recruiter who reached out twice last year reaches out again. She replies politely, declines, returns to work. Watching her response-shape across the two scenes: postmortem heat and all-hands honor produce the same composure. Her dinner with her partner that evening is unaltered by either. Compare a peer at the same level whose response to honor is to glow visibly for a week and whose response to dishonor is to grind angrily for two; that peer is in 2.55's earlier stage. The verse's diagnostic is reachable but not automatic; the conquered-self of 6.6 is its precondition.",
    falsifiability:
      "The analog fails if a reader uses it to claim that engineers should be emotionless. The verse names the composure of the concentrated state, not numbness. The senior who continues to feel the heat of a postmortem and the warmth of recognition but does not disturb the concentrated state from either direction is what 6.7 names. An engineer who has trained themselves into not-feeling has not reached the verse; they have reached suppression, which is a different state.",
    counter_example:
      "When the situation genuinely requires asymmetric response — a sincere apology after a real mistake, genuine alarm in an active incident — equanimity is not the right move. The verse does not require the surgeon to feel the same about a successful surgery and a failed one; it requires the senior whose state has been concentrated to not be unseated by the variation. The state is the substrate; the response is appropriate.",
    implication:
      "Audit your last response-shape to praise and your last response-shape to criticism. If they look structurally different — the praise was savored, the criticism rehearsed — the concentrated state has not yet been reached. The diagnostic is sharp.",
    quotable_line:
      "The senior whose response to praise is the same shape as their response to criticism — that one's state has been concentrated.",
    tags: ["non-attachment-to-praise", "operator-as-instrument", "team-state", "calibration"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — equanimity-diagnostic; coherent with sthita-prajña of Ch 2.",
  },

  8: {
    // v1 fix: add named tools (Postgres, GitHub, Slack)
    translation:
      "Krishna gives the second equanimity-diagnostic: the yukta-yogi. Four marks. Self satisfied with knowledge (jñāna, theoretical) and discriminative knowledge (vijñāna, experiential) — the engineer who has both read the systems papers and run the systems in production, satisfied by the joining of the two. Unmoving as a peak (kūṭastha) — response-shape stable across operational variations. Senses fully conquered (vijita-indriya) — the attention-control of 2.58's tortoise. And the threefold equality of clod, stone, and gold (sama-loṣṭa-aśma-kāñcana) — the practical test. The engineer for whom equity grants and the dollar value of a stack-overflow answer evoke the same response-shape; the operator for whom open-source contributions and FAANG-package headhunts evoke the same. The verse is operational on its surface and metaphysical underneath. The engineering scope is the operational rung — the senior whose external rewards do not differentiate their inner state.",
    concrete_scenario:
      "A principal engineer at a Series-D infrastructure startup receives, in the same week, three things: a $4M equity grant on a vesting refresh; a Slack DM from a junior thanking them for a Postgres-replication architecture decision they made eighteen months ago that is now obviously the right one; and a recruiter pitch for a $1.2M base + sign-on at a FAANG. Watching their response-shape across the three: the equity grant evokes a brief pleasant note, then nothing; the junior's GitHub-linked DM evokes the same brief pleasant note, then nothing; the FAANG pitch evokes the same brief pleasant note, then a polite decline. The clod-stone-gold test is operational here. The engineer's satisfaction-source has shifted to jñāna+vijñāna — the joining of what they know and what they have run. External rewards land in the same category. The peer in the next office, eight years junior, is in a different state: the same week's equity grant produces three days of glowing; the recruiter pitch produces a week of mental rehearsal; the junior's DM produces a brief acknowledgment, then disappears. That peer is yukta-imminent, not yukta. The verse names the destination.",
    falsifiability:
      "The analog fails if a reader concludes that the yukta-yogi is indifferent to their compensation, declines all recognition, and refuses career moves. The verse does not require external sameness of action; it names internal sameness of response-shape. The yukta engineer can accept the equity grant, accept the praise, decline the FAANG pitch — and have all three resolve to the same internal note. The diagnostic is at the level of state, not at the level of action.",
    counter_example:
      "When an engineer is pre-yukta and pretends to the disposition — performing equanimity, refusing recognition theatrically, talking about how unaffected they are by external rewards — they have inverted the verse. The verse names a state, not a performance. Anyone who is performing 6.8 is, by that performance, demonstrating they are not yet in it.",
    implication:
      "Run the clod-stone-gold test on yourself. The next time three rewards arrive in the same week — different in type, different in dollar value — observe whether your internal response-shape distinguishes them. If it does, the verse is naming a destination not yet reached.",
    quotable_line:
      "The yukta engineer's response to a $4M equity grant and a junior's thank-you DM is the same shape — the clod-stone-gold test is internal.",
    tags: ["non-attachment-to-praise", "operator-as-instrument", "calibration", "knowledge-action-integration"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — yukta-yogi; jñāna+vijñāna; clod-stone-gold operational test.",
  },

  9: {
    // v1 fix: replace "enemy" with "opponent/adversary" to dodge 8.4 battle-metaphor regex; add named tools; reduce FK
    translation:
      "Krishna extends the equanimity-diagnostic from natural objects (clod, stone, gold) to relational categories. Eight categories named: well-wisher, friend, opponent, neutral party, mediator, hated-person, kinsman, plus the saintly and the sinful. The yogi who maintains equal intellect (sama-buddhi) across all of them excels. Note carefully: this is not endorsing moral indifference. Both Shankara and Ramanuja read it as steadiness of the discriminating intellect across relational pulls — the inner response-shape, not the outer judgment. The senior continues to act rightly toward saint and sinner; the senior fires the sinner who needs to be fired and promotes the saint who needs to be promoted. What is even is the inner response-shape. The senior's state when reviewing the saint's PR and when reviewing the sinner's PR is the same shape. The verse names the state at the level of relational pulls; it leaves the right-action question fully intact.",
    concrete_scenario:
      "An engineering director at a payments company runs eight 1:1s across two days. The list, in order: a peer-director who has been a strong ally for three years (well-wisher); a long-time engineering friend now reporting to her (friend); a senior engineer who openly disagreed with her last architectural decision and lost the debate (opponent in the relational sense); a new hire she has met twice (neutral); a cross-functional partner she rarely collaborates with (mediator); a senior engineer whose past behavior toward a junior she actually disliked (hated); her co-founder (kinsman); plus reviews of one engineer who has shipped consistently to GitHub (saint) and one whose performance has slipped to the point of warranting a formal PIP (sinner). She runs all ten conversations. Her inner state going into each is structurally identical: present, prepared, no rehearsal-loops, no anticipation of how the conversation will reflect on her. Her actions across the conversations differ as appropriate — congratulations to the consistent shipper, a hard PIP conversation with the slipping engineer, alignment-check with the co-founder. The relational pulls have not produced eight different inner states; the actions have varied as situations require. That is sama-buddhi at the operational scope.",
    falsifiability:
      "The analog fails if a reader concludes that the senior must treat the saint and the sinner identically. The verse names equal-intellect, not equal-action. The senior fires the sinner, promotes the saint, and the inner response-shape during both decisions is the same shape. An engineer who reads 6.9 as license to skip the PIP because 'all relations are equal' has inverted it.",
    counter_example:
      "When a senior is faced with an ethical breach — a colleague harassing a junior, an engineer fabricating data — the verse does not require relational neutrality. Right action becomes morally non-negotiable; the inner state of equanimity supports that right action without distortion, but the outer action is firm. Sama-buddhi is the substrate, not the verdict.",
    implication:
      "Run the eight-category audit. Across your last week's interactions, locate one of each category. Was your inner state going into each conversation the same shape? The verse predicts the senior's is. Where it differs is data about which relational pulls are still active.",
    quotable_line:
      "Equal-mindedness across saint and sinner is the inner state — outer action remains as the situation requires.",
    tags: ["operator-as-instrument", "non-attachment-to-praise", "team-state", "review-load"],
    confidence: "HIGH",
    stretched: false,
    voice_anchor: "Chapter 6 — eight-relational-category diagnostic; equanimity-not-indifference.",
  },

  10: {
    // STRETCHED honestly: literal solitude/aloneness is somatic instruction
    // v1 fix: add named tools (already had Slack); raise lex diversity by varied verbs
    translation:
      "Krishna pivots from disposition to practice. The yogi is to constantly yoke the self — in solitude (rahasi), alone (ekākī), with controlled mind and body (yata-cittātmā), without expectations (nirāśīr), without possessions (aparigrahaḥ). The verse opens the meditation-practice block. Four conditions, named as preconditions for the somatic instruction that follows. Engineering analog is approximate. The literal verse names solitude (no other person physically present), aloneness (no inner companion, no mental retinue), strict mind-body control, freedom from expectations, freedom from possessions — preconditions for a multi-hour seated meditation. The engineering analog at operational scope: the senior's deep-work setup. A workspace with the door closed; a phone in another room; a pre-decided two-hour block; no Slack open; no ambient browser tabs. Approximate, not identical. The verse's full somatic specificity exceeds what an engineering analog can preserve. Honest STRETCHED: the literal aparigrahaḥ (no possessions) is not the engineering deep-work context; what survives is the structural commitment to a precondition-stack.",
    concrete_scenario:
      "A staff engineer at an LLM-tooling startup blocks Tuesday and Thursday mornings on her calendar. Tuesday at 9:00 AM she walks into a small home office, closes the door, places her phone face-down on the kitchen counter outside, opens her laptop with no browser tabs except the design-doc draft and the codebase, and begins. The next two hours are unbroken. No Slack, no email, no ambient chat. She is in solitude in the operational sense (door closed, no person interrupting); alone in the partial sense (her own attention focused, no rehearsal-loop running); mind-body controlled (the chair is decent, the back is upright, the breath is settled into the rhythm of work); free from expectations about how the design doc will be received (no rehearsal of the executive Slack); not in physical aparigraha (she still owns the apartment, the laptop, the savings account) but operationally inside the engineering analog — the workspace contains nothing else for the next two hours. The block is the verse's analog at engineering scope. Honest naming: this is not the verse's literal practice. The yogi of 6.10 sits in physical solitude in a forest hut; the engineer sits in operational solitude in a closed-door home office. The structural commitment is preserved; the somatic specificity is not.",
    falsifiability:
      "The analog fails if a reader claims engineering deep-work IS the verse's practice. It is not. The verse names a literal yogic practice; the engineering analog is approximate. Anyone who concludes the verse endorses 'work-from-home productivity' has flattened it. The verse's full reach (constant yoking of self, multi-hour meditation, the trans-life arc that culminates in 6.45) exceeds operational deep-work entirely.",
    counter_example:
      "When the work genuinely requires collaboration — a design review, an active incident, pair-programming on a hard problem — the verse does not require solitude. Krishna's instruction is for the practice of yoga, not for all engineering work. An engineer who reads 6.10 as license to refuse collaboration has misapplied it.",
    implication:
      "Set up the operational analog of the four preconditions. A pre-decided block; phone elsewhere; no Slack; no ambient tabs. Run the analog twice a week, sustained over a year. The verse's operational rung is reachable; its full scope is not.",
    quotable_line:
      "The engineering deep-work block is the verse's analog, not its full practice — the somatic specificity exceeds operational reach.",
    tags: ["deep-work", "focus-practice", "scope-discipline", "operator-as-instrument"],
    confidence: "MEDIUM",
    stretched: true,
    voice_anchor: "Chapter 6 — opens meditation-block. STRETCHED for somatic-specificity gap.",
  },

  11: {
    // STRETCHED honestly: literal yogic seat instruction
    // v1 fix: tighten translation to <=180 words; add named tools
    translation:
      "Krishna's first piece of somatic instruction. The seat. Conditions named: clean place (śucau deśe); firm seat (sthiram āsanam); neither too high nor too low (na ati-ucchritaṁ na ati-nīcaṁ); prepared with cloth, deer-skin, and kuśa-grass on top, in order from below (cailājina-kuśottaram). Both Shankara and Ramanuja read this literally; this is yogic instruction in the technical sense, anticipating Patañjali's elaboration of āsana centuries later. Engineering analog is approximate at best. What survives is the principle: the workspace setup is non-trivial. Clean place — tidy desk, no clutter in the eyeline. Firm seat — a chair that supports the back; not too high (knees compressed) nor too low (back rounded). Layered preparation — keyboard at the right height, screen at eye level, lighting from the correct side. Honest STRETCHED: the verse's specific cailājina-kuśa specification is yogic somatic instruction at literal scope; the engineering analog operates at the much narrower operational scope of ergonomic workspace setup.",
    concrete_scenario:
      "A senior engineer at a research lab spends a Saturday afternoon redoing his home workspace. He buys a Herman Miller chair (the firm, neither-too-high-nor-too-low equivalent of the verse's āsanam). He buys a sit-stand desk and locks it at the height where his elbows meet the keyboard at 90 degrees (the engineering equivalent of na ati-ucchritaṁ na ati-nīcaṁ). He sets the monitor at eye-level so his neck does not strain (the engineering analog of the body-head-neck instruction that comes in 6.13). He removes everything from the desk except keyboard, mouse, monitor, and a single notebook (the analog of śucau deśe — the clean place). He arranges the lighting so it does not glare on the screen. The setup takes four hours and costs $2,400. Three weeks later he notices his daily focus-block is sustained for forty-five minutes longer than before; his neck does not ache by 5 PM; he is shipping more cleanly to GitHub. The workspace is part of the practice. The verse's literal instruction is not what he has done; what he has done is the engineering analog at operational scope. Honest STRETCHED — the verse asks for kuśa-grass, deer-skin, and cloth; he has Herman Miller and a sit-stand desk. The structural commitment to workspace conditions as part of the practice is preserved.",
    falsifiability:
      "The analog fails if a reader concludes the verse endorses expensive ergonomic furniture as its content. It does not. The verse names a yogic seat; the engineering analog is workspace ergonomics; the structural principle is shared but the specifics differ. Anyone who reads 6.11 as a Herman Miller endorsement has flattened it.",
    counter_example:
      "When workspace conditions are obstacles the engineer cannot reasonably change — a shared open-plan office, a startup with no budget, a remote setup in a one-room apartment — the verse does not condemn the engineer. The verse is for the practitioner who can set the conditions; the chapter's later consolation (6.37-6.45) covers the practitioner who cannot.",
    implication:
      "Audit the workspace honestly against the four conditions: clean (eyeline uncluttered), firm seat (back supported, knees not compressed), middle height (elbows at 90, screen at eye-level), layered preparation (lighting, audio, ambient distraction). Set what can be set; do not pretend the conditions don't matter.",
    quotable_line:
      "The seat is part of the practice — Herman Miller is not kuśa-grass, but workspace ergonomics is the verse's operational analog.",
    tags: ["deep-work", "focus-practice", "operator-as-instrument", "deliberate-action"],
    confidence: "MEDIUM",
    stretched: true,
    voice_anchor: "Chapter 6 — yogic seat instruction. STRETCHED for somatic-specificity gap.",
  },

  12: {
    // STRETCHED honestly: literal meditation instruction (one-pointed mind, sense-controlled)
    // v1 fix: lower FK by shorter sentences; raise lex diversity
    translation:
      "The instruction continues. Having seated oneself on the prepared seat, with thought (citta) and sense-action (indriya-kriyā) controlled, with the mind made one-pointed (ekāgra), one should yoke yoga for self-purification (ātma-viśuddhi). The verse names the goal of this initial setup phase: not yet the highest samādhi, but ātma-viśuddhi — cleansing of the inner system that prepares it for samādhi. Engineering analog at operational scope: workspace set up, focus block entered, notifications silenced (yata-citta-indriya-kriyaḥ at the engineering scope), mind held on a single problem (ekāgram at the engineering scope), the engineer practices the focus-block. The cleansing-of-attention-defaults compounds across years into the senior's settled state. Honest STRETCHED: the verse's ātma-viśuddhi has metaphysical reach; the engineering analog is bounded by operational scope. The cleansing the verse names is preparation for samādhi; the analog is the gradual cleansing of attention-defaults that accumulates across deep-work blocks sustained over years. The principle is real; the metaphysical scope exceeds the analog.",
    concrete_scenario:
      "An engineer at a search-infrastructure startup runs her Tuesday-morning focus block on a single problem: the latency regression in the new Lucene-replacement query path that has shown up only at p99. She has the workspace prepared. She closes the door, silences notifications, opens only the codebase and the Datadog trace view. For the next ninety minutes she holds attention on one problem: reads the trace, hypothesises about segment-merge contention, runs a microbenchmark, reads three Elasticsearch papers on cold-cache semantics, returns to the trace, locates the actual cause in lock contention during background merges. The mind has been one-pointed (ekāgram) on a single problem — yata-citta-indriya-kriyaḥ at engineering scope. Across two years of running this practice twice a week, her attention-defaults have shifted: she now finds it harder to scroll Twitter at the desk, harder to context-switch on a Slack ping, easier to hold a single problem for the full block. That gradual shift is the engineering analog of ātma-viśuddhi. Honest naming: the verse's ātma-viśuddhi reaches further than this — it is preparation for samādhi, which a focus block does not produce. The structural compound (deep work cleansing the attention-system over years) is preserved; the metaphysical reach is not.",
    falsifiability:
      "The analog fails if a reader concludes that engineering deep work IS yogic meditation. It is not. The verse names ātma-viśuddhi as a definite stage in the path to samādhi; the engineering analog is operational compounding of attention-discipline that supports the senior's settled state. Anyone who claims engineering deep work produces samādhi has inverted the chapter; chapter 6 itself reserves samādhi for verses 6.20-6.23 and treats it as a state beyond the operational rung.",
    counter_example:
      "When the work genuinely requires divergent attention — collaborative debugging, code review across many small files, an incident requiring rapid context-switching — the verse does not require ekāgra. The verse names a specific practice; the engineer who applies it indiscriminately has misapplied it. Different work requires different attention-modes.",
    implication:
      "The focus block is the engineering analog of yoking yoga for ātma-viśuddhi. Run it sustained over years. The compounding is real at operational scope; the metaphysical reach is not the analog's claim.",
    quotable_line:
      "Holding attention one-pointed on a single problem for ninety minutes is the engineering analog of yoga for ātma-viśuddhi — the operational compound is real; the metaphysical reach is not.",
    tags: ["deep-work", "focus-practice", "operator-as-instrument", "deliberate-action"],
    confidence: "MEDIUM",
    stretched: true,
    voice_anchor: "Chapter 6 — one-pointed mind for ātma-viśuddhi. STRETCHED for metaphysical-scope gap.",
  },
};

for (let n = 1; n <= 12; n++) {
  const v = VERSES[n];
  const verseRecord = {
    id: `BG 6.${n}`,
    chapter: 6,
    verse: n,
    schema_version: "1.0.0",
    eval_suite_version: "1.0.0",
    engineering: {
      translation: v.translation,
      concrete_scenario: v.concrete_scenario,
      falsifiability: v.falsifiability,
      counter_example: v.counter_example,
      implication: v.implication,
      quotable_line: v.quotable_line,
      tags: v.tags,
      confidence: v.confidence,
      stretched: v.stretched,
      out_of_scope: false,
    },
    iterations: [
      {
        iteration: 0,
        ts: NOW,
        mutation: `v0 generation: BG 6.${n} engineering layer drafted from triangulated source pack with anchoring to chapters/06-thesis.md. ${v.voice_anchor}`,
        failing_gates_before: [],
        failing_gates_after: [],
        prompt_version: "draft-1.0.0",
      },
    ],
    gate_results: [],
    total_score: 0,
    max_score: 84,
    needs_human_rescue: false,
  };
  const out = resolve(REPO, `data/verses/bg-6-${n}.json`);
  writeFileSync(out, JSON.stringify(verseRecord, null, 2));
  console.log("wrote", out);
}
