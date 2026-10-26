# ParaphraseDistanceCodec

Experimental GenLayer **consensus-audited prose codebooks with bounded edit correction**. Four model-audited paraphrases of one authored proposition carry four symbols (two bits per carrier). The contract generates the codebook, audits its meaning and exposes reusable, root-bound encoding and decoding.

Current policy: **v2**, with two immutable protected phrases from the original and deterministic verbatim occurrence-count checks in every codeword. Model approval cannot bypass a missing, changed or repeated protected phrase. These lexical constraints supplement the independent semantic audits; they do not prove unprotected meaning or relationships.

The previous v1 deployment allowed an explicit “exactly” to disappear and some actor roles to become implicit despite all-PASS audits. Its unmodified candidates, source commit, address and receipts are retained in [history](history/README.md). Regression tests reject those candidates under v2's declared phrase constraints. V1's deployment and receipts are not v2 proofs.

## Mechanism and boundary

`create(original, two protected phrases)` → permissionless `forge` → AI generates four complete paraphrases → exact phrase/count retention + independent validator fidelity audits + all six pairwise edit distances → immutable published codebook → public `encode` / `decode`.

The nondeterministic output is the actual four-string alphabet. Callers cannot provide codewords or fidelity verdicts. Validators independently audit those exact candidates against the **full original text**, checking both-direction equivalence, critical actors/quantities/negations/modalities/conditions/exceptions, absence of additions and genuine natural rephrasing. Padding, tags, repeated text and formatting-only tricks fail the rephrasing audit; exact original copies are also rejected deterministically. All sixteen PASS/FAIL/UNKNOWN labels and the complete reconstructed report must match. Only all-PASS reports publish; other agreed audits are retained as REJECTED without a usable codebook. Malformed generation/audits revert and write nothing.

This transforms authored text; it does not verify that the proposition is true or that any external event or service happened. There are no observer URLs, caller-provided trace summaries, confidence tolerances, graph proposals, deletion probes, fund locks or consumed certificates. The codebook is a public text-channel alphabet, not encryption, authentication, covert secrecy or a compression claim.

## Two separate properties

**Deterministic channel property:** every pair of codewords has Levenshtein distance at least five. A supported received carrier within two edits of a canonical codeword uniquely decodes to that symbol. If two words both matched at radius two, triangle inequality would put them at distance at most four, contradicting spacing. The decoder returns the canonical sentence and symbol; it makes no fidelity claim about the damaged carrier itself.

**Semantic audit:** independently agreed model judgments say each canonical sentence preserves the authored original. This is probabilistic, not formal semantic equivalence or proof that the original is true. Shared model errors or prompt injection may survive consensus. In particular, factual actors and exceptions can be missed; inspect actual generated sentences.

Edits are insertion, deletion or substitution of **printable ASCII characters**. Source/codewords are 10–160 such characters; received carriers are 0–162. Case, spaces and punctuation are not normalized. Unsupported Unicode/control characters are rejected. Correction is guaranteed only within the supported radius; larger corruption may be uncorrectable **or decode to a different valid word**. An attacker can substitute another codeword, so this is not message authentication.

## Roots, identity and reuse

- The original and its two protected phrases are immutable and contract/native-creator/nonce-bound. Each phrase is a distinct 3–80 character literal span from the original, shorter than the entire original. All candidates must retain each span verbatim, including case/spacing, exactly as many times as the original. Phrase selection is an authored constraint, not a claim that it covers every critical semantic feature.
- Anyone may forge it, with an immutable native-caller/attempt nonce. The creator has no approval step or later veto.
- Agreed REJECTED attempts remain readable. A new attempt may search for different codewords satisfying the same original; a published alphabet cannot be replaced or permuted.
- **Both the original input root and exact codebook root are mandatory** for encoding/decoding. Equivalent sentences can be ordered differently in another alphabet; input-root-only binding would not identify the symbol mapping.
- Four symbols, six pair distances, sixteen audits and a bounded four-candidate decoder. No arbitrary code, network source acquisition or financial operation.

API: `create(nonce,original,anchor_a,anchor_b)`, `get_book`, `forge(book_id,input_root,attempt_nonce)`, `get_attempt`, `get_codebook`, `encode(book_id,input_root,codebook_root,symbol)`, `decode(book_id,input_root,codebook_root,carrier)`.

## Reproduce checks

```powershell
python -m pip install -r requirements-dev.txt
genvm-lint check contracts/ParaphraseDistanceCodec.py --json
python -m pytest tests -q -p no:cacheprovider
npm ci --ignore-scripts
node --test tests/reference.test.mjs
node scripts/sdk-check.mjs
```

37 Python direct/helper/callback + 3 independent JavaScript tests pass, with seven SDK roundtrips. The independent edit-graph oracle checks all 961 short-string pairs. A minimum-distance-five synthetic alphabet is checked on all 7,253 symbol/carrier pairs reachable by up to two edits over a reduced alphabet. This finite test supplements the general triangle-inequality argument; it is not exhaustive testing over every printable-ASCII string. Tests exercise all sixteen audit positions, rehashed false fidelity reports, exact-copy/padding rejection, failed generation, immutable publication, rejected-attempt replay, cross-book roots, both required consumer roots and repeated public use. Actual v1 omissions fail the v2 phrase guards even with all-PASS labels. A wrong before/after relationship retaining both protected phrases still fails the substantive validator callback. Direct mode alone does not establish distributed consensus. The Windows cleanup fixture defers only gltest's open-temporary-file `WinError 32` unlink; contract failures remain visible.

## Deployment discipline and related work

Gasless StudioNet only (61999). Native encrypted CLI test accounts sign locally; keys are never exported and global configuration is unchanged. `CODEC_TEST_ACCOUNT` names the unlocked local test signer; `CODEC_CLI_PATH` can override the workspace CLI fallback; `CODEC_NATIVE_HTTP=1` enables narrowly scoped Windows-native Studio HTTPS. Unknown broadcasts stop; inspect native history before retrying. FINALIZED with execution ERROR is a rejection proof, not a successful write. Live proof files are produced only after independent source/receipt/readback checks.

The retired [CounterexampleSliceLab](https://github.com/mahdiaqal/counterexample-slice-lab) was found to repeat PolicyConflictReducer and is explicitly marked unsuitable as a distinct submission. Its deployment and hashes do not belong to this codec. [Architecture comparison](docs/architecture.md) explains the differences from deletion reducers, semantic compaction, byte-preserving chunk packing and executable-program synthesis.

Generic encrypted-CLI transport, receipt checks and Windows test cleanup are reused with MIT attribution from [NibbleRewriteForge](https://github.com/Al1ranger/nibble-rewrite-forge) and its predecessors. Classical coding theory is attributed to [CMU's overview](https://www.cs.cmu.edu/~venkatg/RD-coding.html); there is no claim to invent error-correcting codes or establish global novelty. Experimental, not production audited. No automatic portal submission or guaranteed steward acceptance. See [security](SECURITY.md).
