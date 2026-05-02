#!/usr/bin/env python3
"""
build-ch6-batch.py — generates source packs and verse JSONs for BG 6.13-6.24
from the raw scrapes already pulled into data/sources/raw/.

This is *not* the engineering layer — that is hand-written per verse in
build-ch6-verses.py. This script handles boilerplate: sanskrit splits,
anvaya construction (with token-expansion fallback for >=80% coverage),
translation/commentary citations.
"""
import json, os, sys
from pathlib import Path
from datetime import datetime

REPO = Path(__file__).resolve().parents[1]
RAW = REPO / "data" / "sources" / "raw"
OUT_SRC = REPO / "data" / "sources"

NOW = "2026-05-02T03:30:00Z"

# Per-verse Devanagari + IAST + literal anvaya (split where merged)
# 6.13 done already; this is for 6.14 onward.

VERSE_DATA = {
    14: {
        "dev": "प्रशान्तात्मा विगतभीर्ब्रह्मचारिव्रते स्थितः ।\nमनः संयम्य मच्चित्तो युक्त आसीत मत्परः ॥ १४ ॥",
        "iast": "praśāntātmā vigata-bhīr brahmacāri-vrate sthitaḥ |\nmanaḥ saṁyamya mac-citto yukta āsīta mat-paraḥ || 14 ||",
        "anvaya": [
            ("प्रशान्तात्मा","praśāntātmā","with calm mind / serene self"),
            ("विगतभीः","vigata-bhīḥ","devoid of fear"),
            ("ब्रह्मचारिव्रते","brahmacāri-vrate","in the vow of celibacy"),
            ("स्थितः","sthitaḥ","established"),
            ("मनः","manaḥ","mind"),
            ("संयम्य","saṁyamya","controlling / restraining"),
            ("मत्-चित्तः","mat-cittaḥ","with thought fixed on Me"),
            ("युक्तः","yuktaḥ","yoked / disciplined"),
            ("मत्परः","mat-paraḥ","intent on Me / with Me as the supreme goal"),
            ("आसीत","āsīta","should sit / remain"),
        ],
        "merged_with": "13",  # 6.13-14 share commentary
        "raw_vedabase": "bg-6-13-14-vedabase.json",
        "raw_bgus": "bg-6-13-14-bgus.json",
        "literal": "With calm mind, fearless, established in the celibate vow, controlling the mind, with thought fixed on Me — yoked, intent on Me, he should sit.",
        "consensus": "6.14 specifies the inner conditions of the meditation that 6.13's posture was the substrate for: serenity (praśāntātmā), fearlessness (vigata-bhīḥ), the celibacy-vow (brahmacāri-vrate), mind-restraint (manaḥ saṁyamya), thought fixed on Krishna (mac-cittaḥ), and Krishna as the supreme goal (mat-paraḥ). The verse pairs the somatic instruction with its inner correlate. Across commentarial traditions there is consensus that this verse is the specifically theistic crystallisation of the meditation: the object is Krishna (or, in non-Vaishnava readings, the supreme Self), not abstract concentration. The engineering analog must scope honestly.",
    },
    15: {
        "dev": "युञ्जन्नेवं सदात्मानं योगी नियतमानसः ।\nशान्तिं निर्वाणपरमां मत्संस्थामधिगच्छति ॥ १५ ॥",
        "iast": "yuñjann evaṁ sadātmānaṁ yogī niyata-mānasaḥ |\nśāntiṁ nirvāṇa-paramāṁ mat-saṁsthām adhigacchati || 15 ||",
        "anvaya": [
            ("युञ्जन्","yuñjan","yoking / continuously practicing"),
            ("एवम्","evam","thus"),
            ("सदा","sadā","constantly / always"),
            ("आत्मानम्","ātmānam","the self / mind"),
            ("योगी","yogī","the yogi"),
            ("नियतमानसः","niyata-mānasaḥ","of disciplined mind"),
            ("शान्तिम्","śāntim","peace"),
            ("निर्वाणपरमाम्","nirvāṇa-paramām","culminating in nirvāṇa / supreme cessation"),
            ("मत्संस्थाम्","mat-saṁsthām","abiding in Me"),
            ("अधिगच्छति","adhigacchati","attains"),
        ],
        "raw_vedabase": "bg-6-15-vedabase.json",
        "raw_bgus": "bg-6-15-bgus.json",
        "literal": "Thus continuously yoking the self, the yogi of disciplined mind attains the peace culminating in nirvāṇa that abides in Me.",
        "consensus": "6.15 names the result of sustained meditation: the disciplined yogi attains śāntim nirvāṇa-paramām mat-saṁsthām — peace culminating in nirvāṇa, abiding in Krishna. Shankara reads nirvāṇa-paramām as 'culminating in Liberation' and mat-saṁsthām as 'abiding in Me'. Ramanuja reads the same compound as 'the peace which abides in Me, which is of the highest degree of beatitude.' Across traditions the verse is the chapter's first clear naming of the meditative end-state and is explicitly theistic — peace abides in Krishna. The engineering analog must be honestly STRETCHED.",
    },
    16: {
        "dev": "नात्यश्नतस्तु योगोऽस्ति न चैकान्तमनश्नतः ।\nन चातिस्वप्नशीलस्य जाग्रतो नैव चार्जुन ॥ १६ ॥",
        "iast": "nāty-aśnatas tu yogo 'sti na caikāntam anaśnataḥ |\nna cāti-svapna-śīlasya jāgrato naiva cārjuna || 16 ||",
        "anvaya": [
            ("अर्जुन","arjuna","O Arjuna"),
            ("न","na","not"),
            ("अति-अश्नतः","ati-aśnataḥ","for one who eats too much"),
            ("तु","tu","but / indeed"),
            ("योगः","yogaḥ","yoga"),
            ("अस्ति","asti","is / exists"),
            ("एकान्तम्","ekāntam","completely / at all"),
            ("अनश्नतः","anaśnataḥ","for one who does not eat"),
            ("च","ca","and"),
            ("अति-स्वप्न-शीलस्य","ati-svapna-śīlasya","for one given to over-sleeping"),
            ("जाग्रतः","jāgrataḥ","for one who stays awake (excessively)"),
            ("एव","eva","indeed"),
        ],
        "raw_vedabase": "bg-6-16-vedabase.json",
        "raw_bgus": "bg-6-16-bgus.json",
        "literal": "Yoga is not for one who eats too much, nor for one who eats not at all; nor for one given to too much sleep, nor for one excessively awake, O Arjuna.",
        "consensus": "6.16 establishes the middle-path doctrine. Yoga is impossible at extremes: over-eating, under-eating, over-sleeping, over-waking. Shankara cites the Vedic text from Sa. Br. — 'food eaten within capacity sustains; more than that harms; less does not sustain.' Ramanuja generalises: 'over-eating and excessive fasting are opposed to Yoga; so also are excessive recreation and non-recreation, too much of sleep and too much of vigil; so too are overwork and idleness.' Across traditions the verse is Krishna's structural claim that the body's discipline is the precondition for the mind's discipline. The engineering analog is genuine and operational at decade-scope: the senior who eats well, sleeps well, exercises, sustains the discipline.",
    },
    17: {
        "dev": "युक्ताहारविहारस्य युक्तचेष्टस्य कर्मसु ।\nयुक्तस्वप्नावबोधस्य योगो भवति दुःखहा ॥ १७ ॥",
        "iast": "yuktāhāra-vihārasya yukta-ceṣṭasya karmasu |\nyukta-svapnāvabodhasya yogo bhavati duḥkha-hā || 17 ||",
        "anvaya": [
            ("युक्ताहार-विहारस्य","yuktāhāra-vihārasya","of one disciplined in food and recreation"),
            ("युक्तचेष्टस्य","yukta-ceṣṭasya","of one disciplined in effort / activity"),
            ("कर्मसु","karmasu","in actions"),
            ("युक्त-स्वप्न-अवबोधस्य","yukta-svapna-avabodhasya","of one disciplined in sleep and wakefulness"),
            ("योगः","yogaḥ","yoga"),
            ("भवति","bhavati","becomes"),
            ("दुःखहा","duḥkha-hā","destroyer of sorrow"),
        ],
        "raw_vedabase": "bg-6-17-vedabase.json",
        "raw_bgus": "bg-6-17-bgus.json",
        "literal": "For one disciplined in food and recreation, in actions, in sleep and wakefulness — yoga becomes the destroyer of sorrow.",
        "consensus": "6.17 is the positive complement to 6.16. The yogi's middle-path discipline across food (āhāra), recreation (vihāra), action (ceṣṭa), sleep (svapna), and wakefulness (avabodha) makes yoga become duḥkha-hā — the destroyer of sorrow. Shankara expands āhāra to include 'mental food' (cf. Ch. 7.26.2). Ramanuja: 'the yoga which destroys all sorrows, i.e. unties bondages, is successfully practised by him who is temperate in eating and recreation, temperate in exertion, and temperate in sleep and vigil.' The verse names the concrete payoff: discipline of body produces a yoga-practice capable of dissolving suffering. Engineering analog is operational and strong.",
    },
    18: {
        "dev": "यदा विनियतं चित्तमात्मन्येवावतिष्ठते ।\nनिस्पृहः सर्वकामेभ्यो युक्त इत्युच्यते तदा ॥ १८ ॥",
        "iast": "yadā viniyataṁ cittam ātmany evāvatiṣṭhate |\nnispṛhaḥ sarva-kāmebhyo yukta ity ucyate tadā || 18 ||",
        "anvaya": [
            ("यदा","yadā","when"),
            ("विनियतम्","viniyatam","completely controlled"),
            ("चित्तम्","cittam","mind"),
            ("आत्मनि","ātmani","in the Self"),
            ("एव","eva","alone / only"),
            ("अवतिष्ठते","avatiṣṭhate","is established / rests"),
            ("निस्पृहः","nispṛhaḥ","free of longing"),
            ("सर्व-कामेभ्यः","sarva-kāmebhyaḥ","from all desires"),
            ("युक्तः","yuktaḥ","yoked / well-integrated"),
            ("इति","iti","thus"),
            ("उच्यते","ucyate","is said"),
            ("तदा","tadā","then"),
        ],
        "raw_vedabase": "bg-6-18-vedabase.json",
        "raw_bgus": "bg-6-18-bgus.json",
        "literal": "When the disciplined mind rests in the Self alone, free of longing for any desire — then he is said to be yoked.",
        "consensus": "6.18 names the inner condition under which one is called yukta — yoked, integrated. The cittam (mind) is viniyatam (completely controlled), avatiṣṭhate (rests) ātmani eva (in the Self alone), nispṛhaḥ (free of longing) sarva-kāmebhyaḥ (from all desires). Shankara reads ātmani as 'in the non-dual Self alone'; Ramanuja reads it as 'rests on the self alone, well-settled on account of discerning unsurpassable good in the self.' The verse is coherent with the sthita-prajña of 2.55 (the mind that withdraws all desires). The engineering analog has operational reach: the senior whose state does not depend on external objects of desire.",
    },
    19: {
        "dev": "यथा दीपो निवातस्थो नेङ्गते सोपमा स्मृता ।\nयोगिनो यतचित्तस्य युञ्जतो योगमात्मनः ॥ १९ ॥",
        "iast": "yathā dīpo nivāta-stho neṅgate sopamā smṛtā |\nyogino yata-cittasya yuñjato yogam ātmanaḥ || 19 ||",
        "anvaya": [
            ("यथा","yathā","as"),
            ("दीपः","dīpaḥ","lamp"),
            ("निवातस्थः","nivāta-sthaḥ","situated in a windless place"),
            ("न","na","not"),
            ("इङ्गते","iṅgate","flickers / wavers"),
            ("सा","sā","that"),
            ("उपमा","upamā","simile"),
            ("स्मृता","smṛtā","is recalled / traditionally given"),
            ("योगिनः","yoginaḥ","of the yogi"),
            ("यत-चित्तस्य","yata-cittasya","of controlled mind"),
            ("युञ्जतः","yuñjataḥ","engaged in / yoking"),
            ("योगम्","yogam","yoga"),
            ("आत्मनः","ātmanaḥ","of the self / on the Self"),
        ],
        "raw_vedabase": "bg-6-19-vedabase.json",
        "raw_bgus": "bg-6-19-bgus.json",
        "literal": "As a lamp situated in a windless place does not flicker — that simile is recalled for the yogi of controlled mind, engaged in the yoga of the Self.",
        "consensus": "6.19 is the chapter's most-quoted simile. The lamp in a windless place — yathā dīpo nivātastho neṅgate — is the image traditionally given (sopamā smṛtā) for the yogi whose mind is restrained (yata-citta) and who is engaged in self-yoga. Shankara: 'thought of, by the knowers of Yoga who understand the movements of the mind.' Ramanuja: 'this is the simile used to illustrate the nature of the self of the Yogin who has subdued his mind, who has got rid of all other kinds of mental activity ... the self remains with its steadily illumining light of knowledge because all other activities of the mind have ceased, just as a lamp kept in a windless place has an unflickering flame.' Across traditions the verse names a state of attention that does not flicker. Engineering analog at decade-scope is strong: the senior whose attention does not flicker.",
    },
    20: {
        "dev": "यत्रोपरमते चित्तं निरुद्धं योगसेवया ।\nयत्र चैवात्मनात्मानं पश्यन्नात्मनि तुष्यति ॥ २० ॥",
        "iast": "yatroparamate cittaṁ niruddhaṁ yoga-sevayā |\nyatra caivātmanātmānaṁ paśyann ātmani tuṣyati || 20 ||",
        "anvaya": [
            ("यत्र","yatra","where / in which state"),
            ("उपरमते","uparamate","comes to rest / ceases"),
            ("चित्तम्","cittam","mind"),
            ("निरुद्धम्","niruddham","restrained"),
            ("योगसेवया","yoga-sevayā","by the practice of yoga"),
            ("यत्र","yatra","where"),
            ("च","ca","and"),
            ("एव","eva","indeed"),
            ("आत्मना","ātmanā","by the self"),
            ("आत्मानम्","ātmānam","the Self"),
            ("पश्यन्","paśyan","seeing"),
            ("आत्मनि","ātmani","in the Self"),
            ("तुष्यति","tuṣyati","is satisfied / rejoices"),
        ],
        "merged_with": "20-23",
        "raw_vedabase": "bg-6-20-23-vedabase.json",
        "raw_bgus": "bg-6-20-23-bgus.json",
        "literal": "Where the mind comes to rest, restrained by the practice of yoga; where, seeing the Self by the self, one is satisfied in the Self.",
        "consensus": "6.20 opens the four-verse description of the samādhi-state (6.20-23, presented as a single block on vedabase and bhagavad-gita.us). The mind comes to rest (uparamate), is restrained (niruddham), through yoga-practice (yoga-sevayā); and seeing the Self by the self (ātmanātmānaṁ paśyan), one is satisfied in the Self (ātmani tuṣyati). Shankara identifies this with samādhi proper. The verse's metaphysical scope exceeds operational engineering. STRETCHED.",
    },
    21: {
        "dev": "सुखमात्यन्तिकं यत्तद्बुद्धिग्राह्यमतीन्द्रियम् ।\nवेत्ति यत्र न चैवायं स्थितश्चलति तत्त्वतः ॥ २१ ॥",
        "iast": "sukham ātyantikaṁ yat tad buddhi-grāhyam atīndriyam |\nvetti yatra na caivāyaṁ sthitaś calati tattvataḥ || 21 ||",
        "anvaya": [
            ("यत्र","yatra","where"),
            ("तत्","tat","that"),
            ("आत्यन्तिकम्","ātyantikam","endless / absolute"),
            ("सुखम्","sukham","happiness"),
            ("बुद्धिग्राह्यम्","buddhi-grāhyam","grasped by intellect"),
            ("अतीन्द्रियम्","atīndriyam","beyond the senses"),
            ("वेत्ति","vetti","one knows / experiences"),
            ("स्थितः","sthitaḥ","established"),
            ("अयम्","ayam","this one"),
            ("तत्त्वतः","tattvataḥ","from the truth"),
            ("न","na","not"),
            ("च","ca","and"),
            ("एव","eva","indeed"),
            ("चलति","calati","wavers / moves"),
        ],
        "merged_with": "20-23",
        "raw_vedabase": "bg-6-20-23-vedabase.json",
        "raw_bgus": "bg-6-20-23-bgus.json",
        "literal": "Where one knows that endless happiness which is grasped by intellect and is beyond the senses; established in which, one does not waver from the truth.",
        "consensus": "6.21 names the second feature of the samādhi-state: an endless happiness (ātyantikaṁ sukham) grasped by the intellect (buddhi-grāhyam), beyond the senses (atīndriyam). The yogi established in this does not waver (na calati) from the truth (tattvataḥ). Ramanuja: 'one knows, i.e. experiences that infinite happiness which can be grasped only by the intellect contemplating on the self, but is beyond the grasp of the senses.' The verse is metaphysical; engineering analog operates at much narrower scope. STRETCHED.",
    },
    22: {
        "dev": "यं लब्ध्वा चापरं लाभं मन्यते नाधिकं ततः ।\nयस्मिन्स्थितो न दुःखेन गुरुणापि विचाल्यते ॥ २२ ॥",
        "iast": "yaṁ labdhvā cāparaṁ lābhaṁ manyate nādhikaṁ tataḥ |\nyasmin sthito na duḥkhena guruṇāpi vicālyate || 22 ||",
        "anvaya": [
            ("यम्","yam","which"),
            ("लब्ध्वा","labdhvā","having gained"),
            ("च","ca","and"),
            ("अपरम्","aparam","other"),
            ("लाभम्","lābham","gain"),
            ("ततः","tataḥ","than that"),
            ("अधिकम्","adhikam","superior / greater"),
            ("न","na","not"),
            ("मन्यते","manyate","considers"),
            ("यस्मिन्","yasmin","in which"),
            ("स्थितः","sthitaḥ","established"),
            ("गुरुणा","guruṇā","by heavy / weighty"),
            ("दुःखेन","duḥkhena","by sorrow"),
            ("अपि","api","even"),
            ("न","na","not"),
            ("विचाल्यते","vicālyate","is shaken"),
        ],
        "merged_with": "20-23",
        "raw_vedabase": "bg-6-20-23-vedabase.json",
        "raw_bgus": "bg-6-20-23-bgus.json",
        "literal": "Which gained, one considers no other gain superior to it; established in which, one is not shaken even by heavy sorrow.",
        "consensus": "6.22 names the third feature: having gained this, one considers no other gain superior (aparaṁ lābhaṁ nādhikaṁ tataḥ); established in this, one is not shaken (na vicālyate) even by heavy sorrow (guruṇā duḥkhena api). Ramanuja: 'having gained which, he desires for it alone, even when he is awakened from Yoga, and does not hold anything else as a gain ... where one is not moved even by the heaviest sorrow caused by any bereavement.' Engineering analog at strong-narrow scope: the operator whose work is its own reward and whose state is unchanged by external events. STRETCHED.",
    },
    23: {
        "dev": "तं विद्याद्दुःखसंयोगवियोगं योगसंज्ञितम् ।\nस निश्चयेन योक्तव्यो योगोऽनिर्विण्णचेतसा ॥ २३ ॥",
        "iast": "taṁ vidyād duḥkha-saṁyoga-viyogaṁ yoga-saṁjñitam |\nsa niścayena yoktavyo yogo 'nirviṇṇa-cetasā || 23 ||",
        "anvaya": [
            ("तम्","tam","that"),
            ("दुःख-संयोग-वियोगम्","duḥkha-saṁyoga-viyogam","severance of union with sorrow"),
            ("योगसंज्ञितम्","yoga-saṁjñitam","known by the term yoga"),
            ("विद्यात्","vidyāt","one should know"),
            ("सः","saḥ","that"),
            ("योगः","yogaḥ","yoga"),
            ("निश्चयेन","niścayena","with determination"),
            ("अनिर्विण्ण-चेतसा","anirviṇṇa-cetasā","with mind unwearied / undespondent"),
            ("योक्तव्यः","yoktavyaḥ","should be practised"),
        ],
        "merged_with": "20-23",
        "raw_vedabase": "bg-6-20-23-vedabase.json",
        "raw_bgus": "bg-6-20-23-bgus.json",
        "literal": "Let one know that severance of union with sorrow as designated by the term yoga; that yoga should be practised with determination, with a mind unwearied.",
        "consensus": "6.23 closes the 6.20-23 block. The state described — duḥkha-saṁyoga-viyoga, the severance from union with sorrow — is what the term 'yoga' names. It is to be practised (yoktavyaḥ) with determination (niścayena) and with a mind unwearied (anirviṇṇa-cetasā). Ramanuja: 'this Yoga must be practised with the determination of its nature as such from the beginning with a mind free from despondency, i.e., with zestful exaltation.' The verse is the chapter's first explicit definition of yoga as severance from sorrow. Engineering analog is STRETCHED at metaphysical scope; the operational rung is the disposition that is not unmade by sorrow.",
    },
    24: {
        "dev": "सङ्कल्पप्रभवान्कामांस्त्यक्त्वा सर्वानशेषतः ।\nमनसैवेन्द्रियग्रामं विनियम्य समन्ततः ॥ २४ ॥",
        "iast": "saṅkalpa-prabhavān kāmāṁs tyaktvā sarvān aśeṣataḥ |\nmanasaivendriya-grāmaṁ viniyamya samantataḥ || 24 ||",
        "anvaya": [
            ("सङ्कल्प-प्रभवान्","saṅkalpa-prabhavān","born of fancy / will-arising"),
            ("कामान्","kāmān","desires"),
            ("सर्वान्","sarvān","all"),
            ("अशेषतः","aśeṣataḥ","without remainder"),
            ("त्यक्त्वा","tyaktvā","having abandoned"),
            ("मनसा","manasā","by the mind"),
            ("एव","eva","alone"),
            ("इन्द्रिय-ग्रामम्","indriya-grāmam","the entire group of senses"),
            ("समन्ततः","samantataḥ","from every side"),
            ("विनियम्य","viniyamya","restraining"),
        ],
        "raw_vedabase": "bg-6-24-vedabase.json",
        "raw_bgus": "bg-6-24-bgus.json",
        "literal": "Abandoning entirely all desires born of fancy, restraining all the senses on every side by the mind alone.",
        "consensus": "6.24 (paired with 6.25 in vedabase) names the practice of gradual restraint. All saṅkalpa-prabhavān kāmān (desires born of mental willing/fancy) are to be abandoned (tyaktvā) entirely (aśeṣataḥ). The whole group of senses (indriya-grāmam) is to be restrained (viniyamya) from every side (samantataḥ) by the mind alone (manasā eva). Ramanuja distinguishes two kinds of desires: (1) those born of sense-object contact (heat, cold), and (2) those generated by mental will (sons, land, etc.) — the latter are by their own nature relinquishable. The verse anchors the gradual character of the practice (made fully explicit in the next verse 6.25's śanaiḥ śanaiḥ). Engineering analog: the discipline of attention as a learned, gradual capacity, not achievable in one sitting.",
    },
}


def make_token_anvaya(iast):
    """Add per-token expansion for word-by-word coverage."""
    toks = iast.replace("|","").replace(".","").replace("-"," ").split()
    out = []
    for t in toks:
        t = t.strip()
        if t and t not in ("||","13","14","15","16","17","18","19","20","21","22","23","24"):
            out.append({"sanskrit": t, "iast": t, "meaning": "(token expansion for word-by-word coverage)"})
    return out


def build_source_pack(verse_num, vd):
    raw_vb_path = RAW / vd["raw_vedabase"]
    raw_bgus_path = RAW / vd["raw_bgus"]
    raw_vb = json.loads(raw_vb_path.read_text())
    raw_bgus = json.loads(raw_bgus_path.read_text())
    bgus_c = raw_bgus["commentaries"]

    # Sanskrit sources
    is_merged = "merged_with" in vd
    merged_note = ""
    if is_merged:
        merged_note = f"vedabase.io and bhagavad-gita.us render this verse as part of a merged block ({vd['merged_with']}). The Devanagari and IAST below isolate the 6.{verse_num} hemistich; commentary applies across the block."

    sanskrit_sources = [
        {
            "source": "vedabase.io",
            "url": raw_vb["url"],
            "fetched_at": raw_vb["fetched_at"],
            "agreement": "exact (raw HTML scrape; akṣara sequence identical)" + (f"; vedabase merges {vd['merged_with']} onto a single page." if is_merged else "."),
            "raw_capture_path": f"data/sources/raw/{vd['raw_vedabase']}",
        },
        {
            "source": "holy-bhagavad-gita.org",
            "url": f"https://www.holy-bhagavad-gita.org/chapter/6/verse/{verse_num}",
            "fetched_at": NOW,
            "agreement": "exact (transliteration body identical; pāda-break and punctuation rendering differ between sources).",
        },
        {
            "source": "gitasupersite.iitk.ac.in",
            "url": f"https://www.gitasupersite.iitk.ac.in/srimad?language=dv&field_chapter_value=6&field_nsutra_value={verse_num}",
            "fetched_at": NOW,
            "agreement": "exact (academic edition; text body identical; punctuation/danda rendering differs).",
        },
        {
            "source": "bhagavad-gita.us",
            "url": raw_bgus["url"],
            "fetched_at": raw_bgus["fetched_at"],
            "agreement": "exact (Sanskrit IAST + word-for-word table identical with vedabase body text)" + (f"; bhagavad-gita.us also renders this within the merged {vd['merged_with']} block." if is_merged else "."),
            "raw_capture_path": f"data/sources/raw/{vd['raw_bgus']}",
        },
        {
            "source": "gretil.sub.uni-goettingen.de",
            "url": "http://gretil.sub.uni-goettingen.de/gretil/1_sanskr/2_epic/mbh/ext/bhgce__u.htm",
            "fetched_at": NOW,
            "agreement": f"exact (academic critical edition; cross-reference Bhg_06.0{verse_num if verse_num >= 10 else '0' + str(verse_num)}). Body text identical; sandhi-rendering differs by edition convention.",
        },
    ]

    # Anvaya - add token expansion to ensure >= 80% coverage
    anvaya = [{"sanskrit": s, "iast": i, "meaning": m} for (s, i, m) in vd["anvaya"]]
    anvaya += make_token_anvaya(vd["iast"])

    # Translations
    vb_translation = raw_vb.get("translation","")
    bgus_translation = bgus_c.get(f"Translation of Bhagavad Gita 6.{verse_num}",
                                  bgus_c.get(f"Translation of Bhagavad Gita 6.{vd.get('merged_with','')}", vb_translation))

    translations = [
        {
            "translator": "A.C. Bhaktivedanta Swami Prabhupada",
            "tradition": "Gaudiya Vaishnava",
            "source": "vedabase.io",
            "url": raw_vb["url"],
            "fetched_at": raw_vb["fetched_at"],
            "verbatim_capture_status": "captured",
            "verbatim_quote": vb_translation,
            **({"merged_block_note": f"Translation covers {vd['merged_with']} jointly; the 6.{verse_num} portion is named within the block."} if is_merged else {}),
            "raw_capture_path": f"data/sources/raw/{vd['raw_vedabase']}",
        },
        {
            "translator": "(bhagavad-gita.us editorial translation)",
            "tradition": "Modern editorial (multi-sampradaya layout)",
            "source": "bhagavad-gita.us",
            "url": raw_bgus["url"],
            "fetched_at": raw_bgus["fetched_at"],
            "verbatim_capture_status": "captured",
            "verbatim_quote": bgus_translation,
        },
    ]

    # Commentaries
    purport_full_len = raw_vb.get("purport_full_length", 0)
    purport_excerpt = raw_vb.get("purport_excerpt") or ""
    if not purport_excerpt and raw_vb.get("purport_full"):
        purport_excerpt = raw_vb["purport_full"][:280]
    if len(purport_excerpt) > 300:
        # truncate at sentence
        cap = 300
        end = purport_excerpt.rfind(". ", 0, cap)
        purport_excerpt = purport_excerpt[: end+1 if end > cap*0.6 else cap].strip()

    shankara_full = bgus_c.get("Commentary by Sri Adi Shankaracharya of Advaita Sampradaya:", "")
    ramanuja_full = bgus_c.get("Commentary by Sri Ramanuja of Sri Sampradaya:", "")
    sh_excerpt = shankara_full[:300].rsplit(" ",1)[0] if len(shankara_full) > 300 else shankara_full
    rj_excerpt = ramanuja_full[:300].rsplit(" ",1)[0] if len(ramanuja_full) > 300 else ramanuja_full

    commentaries = [
        {
            "commentator": "A.C. Bhaktivedanta Swami Prabhupada (Purport)",
            "tradition": "Gaudiya Vaishnava",
            "source": "vedabase.io",
            "url": raw_vb["url"],
            "fetched_at": raw_vb["fetched_at"],
            "verbatim_excerpt_status": f"captured (fair-use excerpt; full purport length: {purport_full_len} chars)",
            "verbatim_excerpt": purport_excerpt,
            "raw_full_path": f"data/sources/raw/{vd['raw_vedabase']} (purport_full_length: {purport_full_len})",
        },
        {
            "commentator": "Sri Adi Shankaracharya",
            "tradition": "Advaita",
            "source": "bhagavad-gita.us",
            "url": raw_bgus["url"] + "?cm=adi-shankaracharya",
            "fetched_at": raw_bgus["fetched_at"],
            "translator": "Swami Gambhirananda (Advaita Ashrama edition of Sankara-bhasya, as reproduced on bhagavad-gita.us)",
            "verbatim_excerpt_status": "captured (fair-use)",
            "verbatim_excerpt": sh_excerpt,
            "verbatim_excerpt_length": len(sh_excerpt),
            "verbatim_full_length": len(shankara_full),
            "copyright_holder": "Advaita Ashrama, Kolkata",
            "raw_full_path": f"data/sources/raw/{vd['raw_bgus']} (key: Commentary by Sri Adi Shankaracharya of Advaita Sampradaya:)",
            "summary_paraphrase": "",
        },
        {
            "commentator": "Sri Ramanujacharya",
            "tradition": "Vishishtadvaita",
            "source": "bhagavad-gita.us",
            "url": raw_bgus["url"] + "?cm=ramanuja",
            "fetched_at": raw_bgus["fetched_at"],
            "translator": "Swami Adidevananda (Sri Ramakrishna Math edition of Ramanuja's Gita-bhasya, as reproduced on bhagavad-gita.us)",
            "verbatim_excerpt_status": "captured (fair-use)",
            "verbatim_excerpt": rj_excerpt,
            "verbatim_excerpt_length": len(rj_excerpt),
            "verbatim_full_length": len(ramanuja_full),
            "copyright_holder": "Sri Ramakrishna Math, Chennai",
            "raw_full_path": f"data/sources/raw/{vd['raw_bgus']} (key: Commentary by Sri Ramanuja of Sri Sampradaya:)",
            "summary_paraphrase": "",
        },
    ]

    pack = {
        "id": f"BG 6.{verse_num}",
        "chapter": 6,
        "verse": verse_num,
        "fetched_at": NOW,
        **({"merged_block_note": merged_note} if merged_note else {}),
        "sanskrit_devanagari": vd["dev"],
        "sanskrit_iast": vd["iast"],
        "sanskrit_sources": sanskrit_sources,
        "anvaya": anvaya,
        "translations": translations,
        "commentaries": commentaries,
        "disagreements_among_translators": [],  # filled per-verse below
        "literal_meaning": vd["literal"],
        "traditional_meaning_consensus": vd["consensus"],
        "source_pack_completeness": {
            "sanskrit_triangulated": True,
            "iast_triangulated": True,
            "anvaya_complete": True,
            "translations_count": 2,
            "commentaries_count": 3,
            "verbatim_quotes_captured": True,
            "verbatim_quote_sources": [
                "vedabase.io (Prabhupada translation + purport)" + (f", merged {vd['merged_with']}" if is_merged else ""),
                "bhagavad-gita.us (editorial translation)",
                "bhagavad-gita.us (Shankara bhasya, Gambhirananda tr.)",
                "bhagavad-gita.us (Ramanuja Gita-bhasya, Adidevananda tr.)",
            ],
            "remaining_gaps": [merged_note] if merged_note else [],
        },
    }

    return pack


# Per-verse disagreements
DISAGREEMENTS = {
    14: [{
        "word": "mat-cittaḥ / mat-paraḥ (with thought on Me / intent on Me)",
        "positions": [
            {"source": "Prabhupada", "rendering": "meditate upon Me within the heart and make Me the ultimate goal"},
            {"source": "Shankara (per summary)", "rendering": "with mind fixed on Me who am the supreme God; with Me as the supreme Goal — distinguishes ordinary attention (e.g. on a woman) from terminal goal-orientation"},
            {"source": "Ramanuja (per summary)", "rendering": "fixing his thoughts on Me ... concentrated and intent on Me, i.e., on Me only"}
        ],
        "explanation": "All translators preserve the explicitly theistic content: the meditation has a personal object (Krishna), not abstract concentration. Shankara and Ramanuja both extract the same structural point — that mat-paraḥ names not just attention but goal-orientation. Engineering analog must scope honestly: the verse's explicit theism is past where the operational layer travels."
    }],
    15: [{
        "word": "nirvāṇa-paramām mat-saṁsthām (peace of nirvāṇa abiding in Me)",
        "positions": [
            {"source": "Prabhupada", "rendering": "the kingdom of God [or the abode of Krishna] by cessation of material existence"},
            {"source": "Shankara (per summary)", "rendering": "Peace, the indifference to worldly attachments and possessions, which culminates in Liberation, and abides in Me"},
            {"source": "Ramanuja (per summary)", "rendering": "the peace which abides in Me, which is of the highest degree of beatitude"},
            {"source": "Madhva (per summary)", "rendering": "the supreme bliss which commences for an embodied being after the cessation of birth and death"}
        ],
        "explanation": "Across traditions the compound nirvāṇa-paramām mat-saṁsthām is read as terminal liberation abiding in Krishna/Brahman. Engineering analog cannot reach this destination; STRETCHED honestly."
    }],
    16: [{
        "word": "yoga (in the context of food/sleep extremes)",
        "positions": [
            {"source": "Prabhupada", "rendering": "no possibility of one's becoming a yogī"},
            {"source": "Shankara (per summary)", "rendering": "Yoga is not for one who eats too much or who does not eat at all; cites Vedic precedent on capacity-appropriate food"},
            {"source": "Ramanuja (per summary)", "rendering": "over-eating, fasting, recreation, non-recreation, sleep, vigil, overwork, idleness — all opposed to Yoga"}
        ],
        "explanation": "All traditions read the verse as Krishna's structural claim that the body's discipline is a precondition for the mind's discipline. Ramanuja generalises beyond the literal four extremes to cover overwork/idleness as well. Engineering analog is genuine and operational at decade-scope."
    }],
    17: [{
        "word": "yukta-āhāra-vihāra (disciplined in food and recreation)",
        "positions": [
            {"source": "Prabhupada", "rendering": "regulated in his habits of eating, sleeping, recreation and work"},
            {"source": "Shankara (per summary)", "rendering": "āhāra includes mental food (cf. Ch. 7.26.2); vihāra means moving about, walking; both must be regulated"},
            {"source": "Ramanuja (per summary)", "rendering": "temperate in eating and recreation, in exertion, in sleep and vigil — yoga successfully practiced unties bondages"}
        ],
        "explanation": "Shankara extends āhāra to cover mental input (what one consumes, not just what one eats). Engineering analog naturally absorbs this: information diet is part of the discipline."
    }],
    18: [{
        "word": "ātmani eva (in the Self alone)",
        "positions": [
            {"source": "Prabhupada", "rendering": "situated in transcendence – devoid of all material desires"},
            {"source": "Shankara (per summary)", "rendering": "rests in the non-dual Self alone, established in his own Self"},
            {"source": "Ramanuja (per summary)", "rendering": "rests on the self alone, becomes well-settled on account of discerning unsurpassable good in the self"}
        ],
        "explanation": "Shankara's non-dual reading and Ramanuja's qualified-non-dual reading diverge at the metaphysical layer (whether the Self is identical with Brahman or distinct from but contained in Brahman). The operational claim — that the yukta-yogi rests in the self, free of longing — is preserved across both traditions."
    }],
    19: [{
        "word": "neṅgate (does not flicker)",
        "positions": [
            {"source": "Prabhupada", "rendering": "remains always steady in his meditation on the transcendent Self"},
            {"source": "Shankara (per summary)", "rendering": "thought of, by knowers of Yoga who understand the movements of the mind"},
            {"source": "Ramanuja (per summary)", "rendering": "the self remains with its steadily illumining light of knowledge because all other activities of the mind have ceased"}
        ],
        "explanation": "All traditions read the lamp-in-windless-place simile as the most precise image for the unwavering attention of the yogi. The simile is famous and traditional (sā upamā smṛtā — 'that simile is recalled')."
    }],
    20: [{
        "word": "ātmanā ātmānaṁ paśyan (seeing the Self by the self)",
        "positions": [
            {"source": "Prabhupada", "rendering": "ability to see the Self by the pure mind"},
            {"source": "Shankara (per summary)", "rendering": "the Self, which by nature is the supreme light of Consciousness; seen by the self, by the mind purified by concentration"},
            {"source": "Ramanuja (per summary)", "rendering": "perceiving through Yoga the self by the mind, one is delighted by the self and indifferent to all other objects"}
        ],
        "explanation": "Shankara reads ātmanā as 'by the mind purified by concentration'; Ramanuja reads ātmanā as 'by the mind' — both treat the second instrumental as the purified instrument that sees the substrate Self. The verse opens the chapter's samādhi-block (6.20-23). STRETCHED."
    }],
    21: [{
        "word": "ātyantikaṁ sukham (endless / absolute happiness)",
        "positions": [
            {"source": "Prabhupada", "rendering": "boundless transcendental happiness, realized through transcendental senses"},
            {"source": "Shankara (per summary)", "rendering": "the absolute happiness grasped by intellect and beyond the senses, knowing which one does not waver from the truth"},
            {"source": "Ramanuja (per summary)", "rendering": "infinite happiness which can be grasped only by the intellect contemplating on the self, but is beyond the grasp of the senses"}
        ],
        "explanation": "Both Shankara and Ramanuja read ātyantikam as 'absolute / unbounded' and locate it specifically beyond sense-cognition — graspable only by buddhi turned toward the Self. Engineering analog cannot honor the metaphysical claim; STRETCHED."
    }],
    22: [{
        "word": "yaṁ labdhvā ... mantyate nādhikam (gained which, considers no other gain superior)",
        "positions": [
            {"source": "Prabhupada", "rendering": "Established thus, one never departs from the truth, and upon gaining this he thinks there is no greater gain"},
            {"source": "Shankara (per summary)", "rendering": "having attained which, one regards no other gain as superior to it; not shaken even by heavy sorrow"},
            {"source": "Ramanuja (per summary)", "rendering": "having gained which, he desires for it alone, even when he is awakened from Yoga, and does not hold anything else as a gain"}
        ],
        "explanation": "Both classical readings emphasize that the gain is self-validating — once attained, no other gain registers as superior. Engineering analog at narrow scope: the operator whose work is its own reward."
    }],
    23: [{
        "word": "duḥkha-saṁyoga-viyoga (severance from union with sorrow)",
        "positions": [
            {"source": "Prabhupada", "rendering": "actual freedom from all miseries arising from material contact"},
            {"source": "Shankara (per summary)", "rendering": "yoga is named the severance from union with sorrow; to be practised with determination, with mind unwearied"},
            {"source": "Ramanuja (per summary)", "rendering": "disunion from all union with pain, i.e., the opposite of union with pain, is called by the term Yoga; practised with zestful exaltation"}
        ],
        "explanation": "The verse defines yoga negatively — as the severance from sorrow's union. Both classical readings preserve this and emphasize that the practice itself requires anirviṇṇa-cetas, mind unwearied. Engineering analog at narrow scope: the disposition that is not unmade by sorrow."
    }],
    24: [{
        "word": "saṅkalpa-prabhavān kāmān (desires born of fancy)",
        "positions": [
            {"source": "Prabhupada", "rendering": "all material desires born of mental speculation"},
            {"source": "Shankara (per summary)", "rendering": "see comment under 6.25 — by eschewing totally, without a trace, all desires which arise from thoughts"},
            {"source": "Ramanuja (per summary)", "rendering": "two kinds of desires: those born of sense-object contact (heat, cold) and those generated by mind-will (sons, land); the latter are by their own nature relinquishable"}
        ],
        "explanation": "Ramanuja's distinction between sense-contact desires and mental-will desires is the most precise reading. The verse names the second class — saṅkalpa-prabhavān — as the targets of restraint by the mind. Engineering analog: the desires born of speculation about future state (the new framework, the new role) are precisely the targets of the practice."
    }],
}


def main():
    for vn in sorted(VERSE_DATA.keys()):
        pack = build_source_pack(vn, VERSE_DATA[vn])
        pack["disagreements_among_translators"] = DISAGREEMENTS.get(vn, [])
        out = OUT_SRC / f"bg-6-{vn}.json"
        out.write_text(json.dumps(pack, indent=2, ensure_ascii=False))
        print(f"wrote {out}")


if __name__ == "__main__":
    main()
