# Architecture before implementation

User action: register one complete authored proposition. Contract action: invoke AI to generate four meaning-equivalent, lexically separated paraphrases. Each validator independently audits the exact four candidates against the complete original proposition; it does not generate a second codebook. All sixteen fidelity/rephrasing labels and all deterministic distance/report fields must match. Only an all-PASS report publishes the immutable four-symbol codebook. Exact copies, padding and formatting-only variants do not qualify as genuine rephrasings.

Policy v2 also fixes two protected literal spans from the original. Before any semantic approval can publish, every candidate must preserve each span verbatim with the original occurrence count. Both spans and all measured counts participate in the input/report roots. These checks address the observed v1 actor/quantity omissions but are deliberately not a substitute for checking the entire semantic relationship. An after/before reversal can retain all protected words and must still fail independent semantic evaluation.

The maintained object is a text channel alphabet, not a shrinking clause set, graph/head, classifier, evidence certificate or service verdict. `encode` maps a symbol 0–3 to its canonical sentence. `decode` maps printable-ASCII carrier text within Levenshtein distance two of one sentence back to its symbol and canonical sentence. Both require the original input root AND the exact codebook root. They are reusable public reads, not consumed permissions.

Minimum pairwise edit distance is at least five. If one received string were within two edits of two codewords, triangle inequality would put those codewords at distance at most four, a contradiction. This is a deterministic channel property. Semantic fidelity is a separate, probabilistic model-consensus property, not a formal theorem or proof that the original proposition is true.

The client owns transport and display; the contract owns generation, independent semantic auditing, complete six-pair distance checks, root-bound symbol mapping and bounded-distance decoding. There are no external observations or observer URLs. The authored original is the actual transformation input, not evidence of external reality.

## Comparison with existing mechanisms

- PolicyConflictReducer and the retired CounterexampleSliceLab delete original requirements to find a locally irreducible set. This generates four complete alternative sentences and provides an error-correcting symbol channel; it has no deletion probes or minimal-core claim.
- ConstraintBudgetReducer emits one shorter representation under a byte budget. This requires multiple distinct equivalent carriers with disjoint decoding balls; it makes no compression claim. Fidelity-audit concepts are shared, not claimed as a new invention.
- SemanticChunkPacking preserves fetched document bytes in contiguous slices. This creates replacement strings and an explicit payload mapping; it does not partition a document.
- NibbleRewriteForge synthesizes executable programs and proves finite-domain equivalence. This generates prose, uses independent semantic fidelity audits and deterministic string decoding, and has no program interpreter or cost-reduction claim.

Classical coding theory is attributed to [CMU's coding-theory overview](https://www.cs.cmu.edu/~venkatg/RD-coding.html). This does not claim to invent error-correcting codes or establish global novelty.
