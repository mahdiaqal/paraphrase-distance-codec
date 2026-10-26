# Live proofs — ParaphraseDistanceCodec

Experimental public text-channel primitive on gasless StudioNet (61999). Semantic fidelity is model-consensus judgment, not formal equivalence or truth of the original.

[Explorer source](https://explorer-studio.genlayer.com/address/0xf359D218806d2273E5D76b7cF7a0d9cb6FFADF5a) · [Repository source](https://github.com/mahdiaqal/paraphrase-distance-codec/blob/main/contracts/ParaphraseDistanceCodec.py) · [Machine-readable ledger](https://github.com/mahdiaqal/paraphrase-distance-codec/blob/main/PROOFS.json)

- Contract: `0xf359D218806d2273E5D76b7cF7a0d9cb6FFADF5a`
- Matching normalized deployed source SHA-256: `335bda1d3dbd18a41ac49be1526737d7d23c721be42110f85c41e1f86a051920`
- Initial published source commit: [c5d07d0cfabac63c731a5621dfd1f064cd9110f3](https://github.com/mahdiaqal/paraphrase-distance-codec/tree/c5d07d0cfabac63c731a5621dfd1f064cd9110f3)
- Nine finalized transactions: 4 successful executions, four expected errors and one failed generation (ERROR / MAJORITY_DISAGREE). Other eight receipts are MAJORITY_AGREE. All are leader-only false, with at least 5 initial validators and 3 explicit agree votes on the eight majority-agree receipts. Idle/dissent metadata remains visible; this is not unanimity.
- Separate read-only verification checked receipts, native signers/nonces/zero values, full deployed source, exact contract history, immutable book/attempt/alphabet roots, six pair distances per alphabet and all stored audit fields. It verifies bindings and decoding, not the truth of semantic labels.

## Actual generated alphabets

### approval

Authored original: "Rin must get written approval before opening the crate."

Protected literal spans: "Rin must get written approval"; "opening the crate". Expected occurrence counts: [1,1]; every generated candidate retains exactly those counts.

Minimum measured edit distance: **18**. All sixteen independent fidelity/rephrasing labels: **PASS**. Codebook root: `0cbd62a78aab4d5a4d1e61a157b1f2715657f2cfc7d2be93c2aca3ac70e6383d`.

| Symbol | Actual generated canonical carrier |
|---|---|
| 0 | "Prior to opening the crate, it is mandatory that Rin must get written approval." |
| 1 | "Rin must get written approval as a requirement preceding the act of opening the crate." |
| 2 | "Before the process of opening the crate, Rin must get written approval first." |
| 3 | "For the task of opening the crate, Rin must get written approval beforehand." |

Six pair distances: 0↔1: 68; 0↔2: 40; 0↔3: 43; 1↔2: 66; 1↔3: 68; 2↔3: 18.

The published alphabet came from the contract's AI call. The caller supplied the authored original and two protected literal spans; no hardcoded candidate or favorable-audit retry was substituted. It was forged by a different native account than its creator, demonstrating permissionless generation. The same creator nonce on two native accounts produced different input roots and books.

## Failed second generation and preserved v1 evidence

The quantity book was created, but its first forge finalized ERROR / MAJORITY_DISAGREE with `[LLM_ERROR] Invalid generated codebook or audit`. No attempt or codebook was stored, as checked by native reads. It was not retried. The workflow expectation of a second published alphabet was unmet. This is failure evidence, not a successful consensus or semantic rejection proof.

[Archived v1 ledger](history/v1-PROOFS.json) and [v1 findings](history/README.md) retain the earlier actor/quantity omissions that motivated deterministic protected spans. Those receipts are not v2 evidence. Literal retention does not establish all semantic relationships.

## Nine-receipt matrix

| Transaction | Finality / execution | Verified effect or error | Votes |
|---|---|---|---|
| [deploy](https://explorer-studio.genlayer.com/tx/0xdca60a391b9735ba6be7bfc23e57501496f72d21b5903faf8200cca6a8d50ce4) | FINALIZED / SUCCESS | Contract deployed | 3 agree, 2 idle, 0 disagree |
| [create-approval](https://explorer-studio.genlayer.com/tx/0x35849ae1a0df0ec1f78faf9f46cd5ccc20dd4f090bc7f57208d6bf8a395d5db8) | FINALIZED / SUCCESS | Immutable authored proposition registered | 5 agree, 0 idle, 0 disagree |
| [forge-approval](https://explorer-studio.genlayer.com/tx/0x6bceb6bb51cda701d221222eaf71448ffa513e183d062cd44e45774591603bab) | FINALIZED / SUCCESS | AI-generated alphabet published | 3 agree, 1 idle, 1 disagree |
| [immutable-alphabet](https://explorer-studio.genlayer.com/tx/0x5330c971cf7c08da97687a9c268c92db6f7c828f14310c4d7fae929be7cb806a) | FINALIZED / ERROR | Codebook already published | 3 agree, 2 idle, 0 disagree |
| [creator-nonce-replay](https://explorer-studio.genlayer.com/tx/0x67b9773ddd29a739d63a973f64da7edba00afbc399bd42035414b3cef0466a1e) | FINALIZED / ERROR | Nonce already used | 4 agree, 1 idle, 0 disagree |
| [create-quantity](https://explorer-studio.genlayer.com/tx/0xcff00054f34efbbc2235a5d9a86a4dc4eea9439e132cd2d3094bff4924fee50d) | FINALIZED / SUCCESS | Immutable authored proposition registered | 3 agree, 2 idle, 0 disagree |
| [cross-book-input](https://explorer-studio.genlayer.com/tx/0x6b42d35e8491f4f47864fff457e15ac603ee3851a145c2769e48334e2ae7569e) | FINALIZED / ERROR | Input root mismatch | 3 agree, 2 idle, 0 disagree |
| [forge-quantity](https://explorer-studio.genlayer.com/tx/0x5ccbe358b3eb82dfb41ba7e0c1c84d92cb1e5896facd0b0c27ccea28fbe7355b) | FINALIZED / ERROR | [LLM_ERROR] Invalid generated codebook or audit | FAILED EXPECTATION; MAJORITY_DISAGREE; 0 agree, 1 idle, 4 disagree |
| [invalid-original](https://explorer-studio.genlayer.com/tx/0xf6d815f95c0fbe7ff96dcf49c0139cff779d1b2ad3c7e4f3f088ecb753b08696) | FINALIZED / ERROR | Invalid original proposition | 3 agree, 2 idle, 0 disagree |

## Native encoding and decoding reads

The verifier executed four native encodings and **16 native decodings**: one published alphabet, all four symbols, and exact text plus two insertions, two deletions or two substitutions. Every damaged supported carrier decoded to the original symbol and canonical codeword, with measured distance exactly two; exact carriers had distance zero. The complete input/output records are in PROOFS.json. These are contract VM read calls, not additional transaction receipts.

Empty carriers returned UNCORRECTABLE. 5 native read rejections cover cross-source roots, mismatched alphabet roots, symbol 4, 163-character carriers and unsupported Unicode. An oversized original created no book. Native failures and expected-error transactions are identified separately from successful generation.

Publication cannot overwrite or permute the alphabet; source nonce replay and wrong-book input roots fail before generation. Consumers must pin **both** input and codebook roots, since another valid alphabet can order the same meanings differently. This codec provides no message authentication: replacing a carrier with another canonical word changes its symbol.

## Local evidence and limits

37 Python direct/helper/callback + 3 independent JavaScript tests; seven SDK roundtrips; GenVM lint and SDK validation pass. Independent edit-graph search checks all 961 short-string pairs. A minimum-distance-five alphabet passes 7,253 symbol/carrier cases reached by up to two edits over a reduced alphabet; the general supported-radius guarantee follows from triangle inequality, not exhaustive enumeration of all printable strings. Every one of sixteen audit positions is consequential. Actual v1 omissions fail the v2 literal guards even with all-PASS labels. Actual callback tests reject a fully rehashed before/after false-meaning report with protected spans retained, substituted context and model errors; exact copies and padding tricks are tested. Direct mode alone is not distributed consensus.

Correction assumes printable ASCII and at most two edits. Larger corruption may decode incorrectly, and no fidelity claim is made about damaged text itself. Agreed canonical-paraphrase fidelity can still be wrong. Experimental, not production audited.

Read-only verification: `node --require ./scripts/native-http.cjs scripts/verify-live.mjs`; no signer, model call or transaction-send path.
