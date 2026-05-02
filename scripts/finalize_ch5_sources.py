#!/usr/bin/env python3
"""Finalize 5.16-5.29 source packs: add literal_meaning, traditional_meaning_consensus,
disagreements_among_translators, and (for 5.27/5.28) split the IAST."""
import json
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
SRC = REPO / "data/sources"

# Per-verse content. Each entry: literal_meaning, traditional_meaning_consensus,
# disagreements (list of dicts with word, positions, explanation).
META = {
    16: {
        "literal_meaning": "But for those whose ignorance has been destroyed by knowledge of the self, knowledge — like the sun — illuminates that supreme.",
        "traditional_meaning_consensus": "When discriminating self-knowledge destroys ignorance, the natural illumination of the self reveals the supreme reality. Shankara reads this as ātma-jñāna dispelling avidyā; Ramanuja reads it as the contracted dharma-bhūta-jñāna of the self expanding to its natural unlimited form once karma-rooted ignorance is overcome; Prabhupada reads it as Krishna-consciousness (tat param) revealing everything once nescience is gone. All three traditions agree on the structural claim: knowledge destroys ignorance, and the destruction itself is what reveals the supreme.",
        "disagreements": [
            {"word": "tat param",
             "positions": [
                 {"source": "Prabhupada", "rendering": "Kṛṣṇa consciousness (the supreme); revelation of Krishna"},
                 {"source": "Shankara (per summary)", "rendering": "the supreme Reality, the highest Goal, the totality of whatever is to be known"},
                 {"source": "Ramanuja (per summary)", "rendering": "the natural unlimited self-knowledge expanding once karma-ignorance is destroyed"}
             ],
             "explanation": "Prabhupada's Gaudiya reading identifies tat param with Krishna-as-supreme; Shankara reads it as the impersonal absolute / totality of the knowable; Ramanuja reads it as the self's own dharma-bhūta-jñāna in its expanded state. The three traditions diverge sharply on the metaphysical referent of 'that supreme'."}
        ]
    },
    17: {
        "literal_meaning": "Those whose intellect (buddhi), self (ātman), faith (śraddhā), and refuge (parāyaṇa) are in That, having shaken off all faults by knowledge, go to non-return.",
        "traditional_meaning_consensus": "The verse names four directional commitments — intellect, self-identification, faith, and refuge — all directed toward 'That' (tad-buddhi, tad-ātman, tad-niṣṭha, tad-parāyaṇa). When all four point at the supreme, knowledge purifies past faults and the journey terminates in apunar-āvṛtti (non-return). Shankara reads 'That' as Brahman; Ramanuja reads it as the Lord; Prabhupada reads it as Krishna. All traditions agree on the structural fourfold-direction claim.",
        "disagreements": [
            {"word": "tad-buddhayaḥ / tad-ātmānaḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "intelligence and being absorbed in Him (Krishna)"},
                 {"source": "Shankara (per summary)", "rendering": "intellect fixed on Brahman; self merged in Brahman"},
                 {"source": "Ramanuja (per summary)", "rendering": "intellect and self directed to the Lord as the supreme reality"}
             ],
             "explanation": "The four 'tat'-prefixed terms admit multiple referents — Brahman (Advaita), the personal Lord (Vishishtadvaita, Gaudiya). The verse's structural form (fourfold direction toward That) is preserved across traditions; the metaphysical referent of 'That' diverges."}
        ]
    },
    18: {
        "literal_meaning": "The wise — those of equal vision — see a brahmin endowed with knowledge and humility, a cow, an elephant, a dog, and even a dog-eater (śva-pāka, an outcaste) equally.",
        "traditional_meaning_consensus": "Sama-darśana — equal vision — is the wisdom-marker. The wise see the same Self in beings of widely differing outer condition: the brahmin (highest social-ritual rank in the original Indian classification), the cow, the elephant, the dog, and the śva-pāka (the outcaste dog-eater, lowest social rank in the verse's original frame). The verse names categories drastically unequal in their outer station and asserts the seer's equal seeing across them. Shankara reads this as recognition of the same Self in all bodies; Ramanuja reads it as recognition of the Lord-as-Self in all selves; Prabhupada reads it as the seer's recognition that all are servants of Krishna. The provocation of the verse — its choice of paradigmatically unequal categories — is preserved across all readings.",
        "disagreements": [
            {"word": "sama-darśinaḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "those who see with equal vision, recognising spiritual identity in all"},
                 {"source": "Shankara (per summary)", "rendering": "those who see the same Brahman as Self in all beings, recognising the equality of the Self despite the inequality of the bodies"},
                 {"source": "Ramanuja (per summary)", "rendering": "those who see the equality of the selves (jīvas) — equal in essential nature though different in their bodies and karmic accumulations"}
             ],
             "explanation": "Equal vision is structurally agreed upon across traditions; what is being equally seen diverges. Shankara: the same Brahman-as-Self. Ramanuja: the equality of jīvas in essential nature. Prabhupada: the common spiritual identity as Krishna-servants. None of the traditions read this as social-political egalitarianism erasing varṇa or competence; all read it as the wise seer's perception across drastically unequal outer station."}
        ]
    },
    19: {
        "literal_meaning": "Those whose mind is established in equality have, here in this very life, conquered the cycle of birth-and-death (sarga). Brahman is faultless and equal; therefore they are established in Brahman.",
        "traditional_meaning_consensus": "Equality of mind (sāmye sthitam manaḥ) is itself the conquest of saṁsāra in this life — iha eva, here-and-now. The verse names the conquest as having already happened (jitaḥ sargaḥ) for those whose minds are established in equality. Shankara reads brahman here as nirguṇa Brahman; Ramanuja reads it as the Lord; both agree the seer-of-equality is brahma-stha (established in Brahman) here in this life. The here-and-now claim (iha eva) is doctrinally significant — liberation is not deferred.",
        "disagreements": [
            {"word": "jitaḥ sargaḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "they have conquered birth and death; the conditions of birth and death are surpassed"},
                 {"source": "Shankara (per summary)", "rendering": "the cycle of saṁsāra is conquered here in this life"},
                 {"source": "Ramanuja (per summary)", "rendering": "the seer-of-equality has conquered creation; samsāra no longer binds"}
             ],
             "explanation": "All readings converge on 'cycle-of-rebirth conquered'; the metaphysics of what 'conquering' entails differs (Advaita: realisation of identity with Brahman; Vishishtadvaita: realisation of dependence on the Lord; Gaudiya: devotional realisation of Krishna-relationship). Iha eva (here-and-now) is preserved across all readings."}
        ]
    },
    20: {
        "literal_meaning": "One who, knowing Brahman and established in Brahman, neither rejoices on obtaining the pleasant nor grieves on encountering the unpleasant — with steady intellect and undeluded — is established in Brahman.",
        "traditional_meaning_consensus": "The verse describes the brahman-knower's affective signature: no upward swing on the pleasant, no downward swing on the unpleasant, sthira-buddhi (steady intellect), asammūḍha (undeluded). This is consistent with the sthita-prajña of 2.55-2.72. Shankara, Ramanuja, and Prabhupada agree on the operational description; the metaphysical referent of 'Brahman' diverges (Advaita: nirguṇa Brahman; Vishishtadvaita: the Lord; Gaudiya: Krishna).",
        "disagreements": [
            {"word": "brahma-vid",
             "positions": [
                 {"source": "Prabhupada", "rendering": "knower of the Supreme; one who knows the Lord"},
                 {"source": "Shankara (per summary)", "rendering": "knower of Brahman as the impersonal absolute"},
                 {"source": "Ramanuja (per summary)", "rendering": "knower of Brahman, identified with the Lord"}
             ],
             "explanation": "The sectarian referent diverges; the operational description (no swings on pleasant/unpleasant, steady intellect, undeluded) is identical across all three readings."}
        ]
    },
    21: {
        "literal_meaning": "With self unattached to external contacts, one finds happiness within the self (ātmani). Then, with the self yoked to brahman through brahma-yoga, one obtains imperishable bliss (akṣayam sukham).",
        "traditional_meaning_consensus": "The verse establishes that bliss has an inner source — happiness in the self (ātmani sukham) — accessed by detachment from external contacts (bāhya-sparśa). Once the self is yoked to brahman through brahma-yoga, the resulting bliss is imperishable (akṣaya), in contrast to the bounded enjoyments named in 5.22. Shankara reads this as the self abiding in non-dual Brahman; Ramanuja reads it as the self meditating on the Lord and obtaining Lord-related bliss; Prabhupada reads it as devotional bliss in Krishna-consciousness. All converge on the bounded-vs-imperishable contrast.",
        "disagreements": [
            {"word": "brahma-yoga-yukta-ātmā",
             "positions": [
                 {"source": "Prabhupada", "rendering": "self yoked to the Supreme through bhakti-yoga; devotional union"},
                 {"source": "Shankara (per summary)", "rendering": "self abiding in the non-dual Brahman through samādhi"},
                 {"source": "Ramanuja (per summary)", "rendering": "self meditating on the Lord through brahma-yoga; the meditator-Lord relation produces the imperishable bliss"}
             ],
             "explanation": "What 'brahma-yoga' refers to differs sharply: Advaita reads it as identity-meditation on impersonal Brahman; Vishishtadvaita and Gaudiya read it as relation-meditation on the personal Lord. The verse's structural claim (yoking produces imperishable bliss in contrast to bounded contact-enjoyments) is preserved."}
        ]
    },
    22: {
        "literal_meaning": "Enjoyments born of contact (saṁsparśa-jā bhogāḥ) are sources of misery (duḥkha-yonayaḥ); they have a beginning and an end (ādy-anta-vantaḥ); the wise (budhaḥ) do not delight in them.",
        "traditional_meaning_consensus": "Bounded enjoyments — the kind produced by sense-contact with sense-objects — are explicitly named as sources of misery (duḥkha-yonayaḥ). Their boundedness (ādy-anta-vantaḥ — having beginning and end) is the structural reason. The wise person, recognising this, does not delight in them. The verse is sharp; it does not hedge. Shankara, Ramanuja, and Prabhupada agree on the operational claim; the metaphysics of the alternative (the imperishable bliss of 5.21) diverges along sectarian lines.",
        "disagreements": [
            {"word": "duḥkha-yonayaḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "sources of distress; wombs of misery"},
                 {"source": "Shankara (per summary)", "rendering": "sources/origins of misery; the contact-enjoyment is itself the seed of the suffering it eventually produces"},
                 {"source": "Ramanuja (per summary)", "rendering": "wombs of misery; the bounded enjoyment is structurally the source of the dissatisfaction that follows it"}
             ],
             "explanation": "All three readings preserve the verse's sharpness — bounded enjoyment is a source of misery, not a soft 'sometimes-painful pleasure'. The structural claim (boundedness produces misery) is identical across traditions."}
        ]
    },
    23: {
        "literal_meaning": "The one who is able to endure here in this world (iha eva), before liberation from the body, the urge born of desire-and-anger (kāma-krodha-udbhavaṁ vegam) — that one is yoked, that one is the happy person.",
        "traditional_meaning_consensus": "The verse names a specific practice — enduring (sahanam, soḍhum) the urges of desire-and-anger here-and-now (iha eva), before death. The capacity to endure the urge is what makes one yukta (yoked); the yukta is named as the happy person. The verse rejects the deferred-liberation reading; the practice is now. Shankara, Ramanuja, and Prabhupada all read this as the moment-by-moment endurance of arising urge as the operational practice of the yogi.",
        "disagreements": [
            {"word": "soḍhum / yaḥ śaknoti",
             "positions": [
                 {"source": "Prabhupada", "rendering": "able to tolerate; the urge of desire and anger is tolerated, not suppressed mechanically"},
                 {"source": "Shankara (per summary)", "rendering": "able to endure; the urge arises, the practitioner does not yield, the urge passes"},
                 {"source": "Ramanuja (per summary)", "rendering": "able to bear/withstand; the practice is moment-to-moment endurance of arising kāma-krodha"}
             ],
             "explanation": "All three readings preserve the doctrinal point — endurance is the practice, not suppression and not indulgence. The verb soḍhum names a specific operation (bear, withstand, endure) that is structurally distinct from suppression."}
        ]
    },
    24: {
        "literal_meaning": "The one whose happiness is within (antar-sukhaḥ), whose joy is within (antar-ārāmaḥ), whose light is within (antar-jyotiḥ) — that yogi, having become Brahman, attains brahma-nirvāṇa.",
        "traditional_meaning_consensus": "The verse names the inner-located triple — happiness, joy, light — and ties this internal location to the attainment of brahma-nirvāṇa (terminal liberation in/as Brahman). The yogi has 'become Brahman' (brahma-bhūtaḥ) and attains brahma-nirvāṇa. Shankara reads brahma-nirvāṇa as identity with the absolute; Ramanuja reads it as the Lord-realisation state; Prabhupada reads it as Krishna-realisation. All three agree on the internal location of the bliss-source and on the verse's metaphysical maximum-claim.",
        "disagreements": [
            {"word": "brahma-bhūtaḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "self-realised; on the Brahman platform; one who has realised the Supreme"},
                 {"source": "Shankara (per summary)", "rendering": "having become Brahman; identity with the non-dual absolute"},
                 {"source": "Ramanuja (per summary)", "rendering": "having become Brahman in the qualified sense — the self realised in its essential nature, dependent on the Lord"}
             ],
             "explanation": "Brahma-bhūta is read as identity (Advaita), as relation-in-essence (Vishishtadvaita), or as devotional realisation (Gaudiya). The verse's metaphysical maximum is preserved; the reading of 'become Brahman' diverges across traditions."}
        ]
    },
    25: {
        "literal_meaning": "Those sages whose sins (kalmaṣa) are destroyed, whose dualities (dvandva) are cut, whose self is disciplined (yatātmānaḥ), and who delight in the welfare of all beings (sarva-bhūta-hite ratāḥ) — they obtain brahma-nirvāṇa.",
        "traditional_meaning_consensus": "Brahma-nirvāṇa is named as the terminus for sages with four marks: sins destroyed, dualities cut, self disciplined, delight in the welfare of all beings. The fourth mark — sarva-bhūta-hite ratāḥ — is structurally significant: terminal liberation is not solitary withdrawal but is consistent with active concern for the welfare of all beings. Shankara, Ramanuja, and Prabhupada all read this fourfold characterisation as the description of the realised sage.",
        "disagreements": [
            {"word": "sarva-bhūta-hite ratāḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "engaged in the welfare of all beings; devotionally serves all beings as servants of Krishna"},
                 {"source": "Shankara (per summary)", "rendering": "delighting in the welfare of all beings; sees the same Self in all and acts for their welfare"},
                 {"source": "Ramanuja (per summary)", "rendering": "ever-engaged in the good of all beings; the realised sage's outward motion is welfare-directed"}
             ],
             "explanation": "All three traditions agree the realised sage is welfare-directed, not solitarily withdrawn. The motivation diverges (Krishna-service in Gaudiya, Self-recognition in Advaita, Lord-service in Vishishtadvaita); the operational claim (delight in others' welfare) is preserved."}
        ]
    },
    26: {
        "literal_meaning": "For renunciates (yatīnām) freed from desire-and-anger, with subdued minds, who have realised the self — brahma-nirvāṇa is near (abhitaḥ vartate), surrounding them on all sides.",
        "traditional_meaning_consensus": "The verse closes the sequence (5.24-5.26) with abhitaḥ — 'on all sides', 'near, surrounding'. Brahma-nirvāṇa is not far from the renunciate freed from desire-and-anger with subdued mind and self-realisation. The intimacy of the state (abhitaḥ) is structurally significant. Shankara, Ramanuja, and Prabhupada all read this as confirming the achievability of the state for the disciplined practitioner.",
        "disagreements": [
            {"word": "abhitaḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "very near; on all sides"},
                 {"source": "Shankara (per summary)", "rendering": "everywhere; the state surrounds them on all sides — neither distant nor postponed"},
                 {"source": "Ramanuja (per summary)", "rendering": "near, on all sides; the state is at hand for the disciplined practitioner"}
             ],
             "explanation": "All three readings emphasise the immediacy of the state. The verse refuses the deferred-liberation reading. The metaphysical specification (what the state is) diverges along sectarian lines, but the immediacy is preserved."}
        ]
    },
    27: {
        "literal_meaning": "Shutting out external contacts (sparśān bahir kṛtvā), fixing the gaze between the eyebrows (cakṣur bhruvor antare kṛtvā), and equalising the in-and-out breaths (prāṇa-apānau samau kṛtvā) within the nostrils — [the muni who is destined for liberation, controlling senses-mind-intellect, free of desire-fear-anger, is always liberated. (continued in 5.28)]",
        "traditional_meaning_consensus": "Verses 5.27 and 5.28 are read as a single instruction-block by Prabhupada (vedabase combines them onto one page) and as separate but conjoined verses by Shankara and Ramanuja. The instruction is somatic-meditative: external contacts shut, gaze fixed between the eyebrows, breath equalised in the nostrils. This anticipates aṣṭāṅga-yoga's aṅgas (yama, niyama, āsana, prāṇāyāma, pratyāhāra, dhāraṇā, dhyāna, samādhi) which chapter 6 will treat fully. Shankara, Ramanuja, and Prabhupada all read these verses as literal somatic instructions, with the engineering analog stretched honestly past the operational layer.",
        "disagreements": [
            {"word": "cakṣuḥ ... antare bhruvoḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "concentrating the eyes between the two eyebrows (the ājñā-cakra location in some yogic traditions)"},
                 {"source": "Shankara (per summary)", "rendering": "fixing the gaze between the eyebrows; literal somatic instruction"},
                 {"source": "Ramanuja (per summary)", "rendering": "the gaze between the brows; somatic preparation for the meditative state"}
             ],
             "explanation": "All three traditions read this as literal somatic instruction. The yogic-anatomical mapping (e.g., to the ājñā-cakra in some readings) is preserved across traditions; the engineering analog must be tagged STRETCHED honestly because the verse names a literal physical posture, not a metaphor."}
        ]
    },
    28: {
        "literal_meaning": "[Continuing from 5.27] The muni who has yoked the senses, mind, and intellect (yata-indriya-mano-buddhiḥ), who is intent on liberation (mokṣa-parāyaṇaḥ), and who has cast off desire, fear, and anger (vigata-icchā-bhaya-krodhaḥ) — that one is always liberated.",
        "traditional_meaning_consensus": "Verse 5.28 names the result of the somatic-meditative discipline begun in 5.27. The muni — meditative sage — with senses, mind, and intellect yoked, intent on liberation, freed of desire-fear-anger, is sadā mukta — always liberated. The 'always' (sadā) is structurally significant. The verse is the immediate setup for chapter 6's full treatment of dhyāna-yoga. Shankara, Ramanuja, and Prabhupada agree on the structural threefold (senses-mind-intellect yoked) and on the threefold-affect-cleansed (desire-fear-anger gone).",
        "disagreements": [
            {"word": "sadā muktaḥ",
             "positions": [
                 {"source": "Prabhupada", "rendering": "always in the liberated state; the perpetual liberation of the Krishna-conscious yogi"},
                 {"source": "Shankara (per summary)", "rendering": "always liberated; in this very life (jīvan-mukta), liberation is constant once attained"},
                 {"source": "Ramanuja (per summary)", "rendering": "always free; the constancy of the liberated state for the disciplined sage"}
             ],
             "explanation": "All three traditions read sadā muktaḥ as marking the perpetual character of the state — not a flickering condition but a stable acquisition. The metaphysical specification of 'liberated' diverges (Advaita: identity with Brahman; Vishishtadvaita: dependence on the Lord realised; Gaudiya: continuous Krishna-consciousness). The constancy claim is preserved."}
        ]
    },
    29: {
        "literal_meaning": "Knowing me as the enjoyer (bhoktāram) of sacrifices and austerities (yajña-tapasām), the great Lord (maheśvaram) of all worlds, and the friend (suhṛdam) of all beings (sarva-bhūtānām) — one attains peace (śāntim ṛcchati).",
        "traditional_meaning_consensus": "The chapter closes with a theistic note. Krishna names himself as: (1) the enjoyer of yajña and tapas — the receiver of sacrifice and austerity; (2) the great Lord of all worlds — sarva-loka-maheśvara; (3) the friend of all beings — suhṛd sarva-bhūtānām. Knowing him as such, one attains peace. The verse anticipates chapter 9's bhakti themes and chapter 18's closing instruction. Shankara, Ramanuja, and Prabhupada read the theistic register here in tradition-specific ways; the structural close — knowing produces peace — is shared. The friend-of-all-beings phrase (suhṛdam) is doctrinally significant across traditions.",
        "disagreements": [
            {"word": "bhoktāram yajña-tapasām",
             "positions": [
                 {"source": "Prabhupada", "rendering": "the ultimate enjoyer of all sacrifices and austerities; the destination of yajña-fruit"},
                 {"source": "Shankara (per summary)", "rendering": "the enjoyer of all sacrifices and austerities — Brahman as the receiver, the same Self in all worshippers"},
                 {"source": "Ramanuja (per summary)", "rendering": "the Lord as the enjoyer of yajña and tapas; sacrifices are offered to Him as the supreme receiver"}
             ],
             "explanation": "The theistic register is read tradition-specifically. Shankara reads bhoktāram as Brahman-as-receiver (consistent with Advaita's reading of yajña as recognition of the same Self); Ramanuja and Prabhupada read it personally — the Lord/Krishna as the receiver of sacrifice and austerity. The structural claim (recognising the destination as friendly produces peace) is preserved across all readings."}
        ]
    }
}

# 5.27 and 5.28 IAST split (per-pada)
IAST_27 = "sparśān kṛtvā bahir bāhyāṁś cakṣuś caivāntare bhruvoḥ |\nprāṇāpānau samau kṛtvā nāsābhyantara-cāriṇau || 27 ||"
IAST_28 = "yatendriya-mano-buddhir munir mokṣa-parāyaṇaḥ |\nvigatecchā-bhaya-krodho yaḥ sadā mukta eva saḥ || 28 ||"


def main():
    for v, meta in META.items():
        path = SRC / f"bg-5-{v}.json"
        with path.open() as f:
            pack = json.load(f)
        pack["literal_meaning"] = meta["literal_meaning"]
        pack["traditional_meaning_consensus"] = meta["traditional_meaning_consensus"]
        pack["disagreements_among_translators"] = meta["disagreements"]
        if v == 27:
            pack["sanskrit_iast"] = IAST_27
        elif v == 28:
            pack["sanskrit_iast"] = IAST_28
        with path.open("w") as f:
            json.dump(pack, f, indent=2, ensure_ascii=False)
        print(f"finalized 5.{v}")


if __name__ == "__main__":
    main()
