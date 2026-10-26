# Ready-to-fill submission

Contribution type: **Builder → Intelligent Contracts**

## Title

ParaphraseDistanceCodec — Consensus-Audited Text Channel

## Notes / Description

ParaphraseDistanceCodec creates a reusable four-symbol text channel from an authored proposition and two protected spans. AI generates four paraphrases. Each must retain both spans verbatim with original occurrence counts. Validators independently audit meaning, critical details, additions and genuine rephrasing. Publication requires all sixteen PASS labels and exact report agreement.

Pairwise Levenshtein distance must be at least five. Public encoding/decoding pins both input and alphabet roots and corrects up to two supported printable-ASCII edits. Originals, spans and published alphabets are immutable; anyone may forge a fixed input.

StudioNet published one alphabet and verified sixteen decoding reads. A second generation failed without publication; its receipt is retained, without retry. Protected literals are deterministic; remaining fidelity is model-consensus judgment. This is a public codec, not encryption, authentication or external-fact verification.

976/1000 characters.

## Evidence

- [Repository](https://github.com/mahdiaqal/paraphrase-distance-codec)
- [Contract source](https://github.com/mahdiaqal/paraphrase-distance-codec/blob/main/contracts/ParaphraseDistanceCodec.py)
- [Architecture and comparisons](https://github.com/mahdiaqal/paraphrase-distance-codec/blob/main/docs/architecture.md)
- [Nine-receipt matrix and actual generated sentences](https://github.com/mahdiaqal/paraphrase-distance-codec/blob/main/LIVE_PROOFS.md)
- [Complete proof/readback ledger](https://github.com/mahdiaqal/paraphrase-distance-codec/blob/main/PROOFS.json)
- [Explorer contract](https://explorer-studio.genlayer.com/address/0xf359D218806d2273E5D76b7cF7a0d9cb6FFADF5a)
- [deploy](https://explorer-studio.genlayer.com/tx/0xdca60a391b9735ba6be7bfc23e57501496f72d21b5903faf8200cca6a8d50ce4)
- [forge-approval](https://explorer-studio.genlayer.com/tx/0x6bceb6bb51cda701d221222eaf71448ffa513e183d062cd44e45774591603bab)
- [immutable-alphabet](https://explorer-studio.genlayer.com/tx/0x5330c971cf7c08da97687a9c268c92db6f7c828f14310c4d7fae929be7cb806a)
- [cross-book-input](https://explorer-studio.genlayer.com/tx/0x6b42d35e8491f4f47864fff457e15ac603ee3851a145c2769e48334e2ae7569e)
- [forge-quantity](https://explorer-studio.genlayer.com/tx/0x5ccbe358b3eb82dfb41ba7e0c1c84d92cb1e5896facd0b0c27ccea28fbe7355b)

## Optional steward response

The submitted mechanism is a reusable prose symbol channel: AI constructs four candidate paraphrases while deterministic guards retain two protected literal spans and their occurrence counts; validators independently audit the exact candidates, and deterministic edit-distance separation enables bounded-error decoding. It has no graph proposals, shrinking requirement core or consumed certificate. Padding and formatting-only variants fail the natural-rephrasing audit. Exact input AND alphabet roots bind the symbol mapping. Matching repository/Explorer source, actual generated alphabets, native two-edit roundtrips and positive, expected-error and failed-generation receipts are linked.

## Scope

One published alphabet, 4 successful transactions, four expected-error transactions and one failed-generation ERROR / MAJORITY_DISAGREE; 16 native decoding reads. The second generation did not publish and was not retried. Supported correction covers printable-ASCII edits within radius two. This is not encryption, authentication, proof that authored facts are true, or a formal guarantee of semantic equivalence. The previously created deletion prototype is explicitly retired as overlapping prior work; its address/receipts are not codec evidence. Classical coding theory is attributed; global novelty and reviewer acceptance are not guaranteed. No automatic portal submission.
