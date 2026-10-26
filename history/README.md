# Version 1 limitation evidence — not current deployment proofs

Version 1 source is preserved at commit [153ad38cdfd77f09196de309d7f8af1bd5f22877](https://github.com/mahdiaqal/paraphrase-distance-codec/tree/153ad38cdfd77f09196de309d7f8af1bd5f22877).

Its StudioNet address is [0x2BE0A600Eb4165F2F370F15e27B494d18cAc0b4C](https://explorer-studio.genlayer.com/address/0x2BE0A600Eb4165F2F370F15e27B494d18cAc0b4C). Normalized source SHA-256: `a5976a94774ba655a53d00f63ade90823fbdca0ba3301a0bc216d2ece0d2a9f0`.

`v1-PROOFS.json` retains nine actual finalized transactions, including two published alphabets. The serial workflow checked receipts and source equality; the independent final consumer/readback audit was **not** completed for v1. No v1 receipt is a v2 deployment proof.

All sixteen semantic audits returned PASS, but approval paraphrases made some actor roles implicit. The quantity candidate “Three copper disks are contained within the sample.” omitted the original's explicit “exactly.” These outputs are retained unchanged as observed limits of model-consensus fidelity, not evidence of complete semantic preservation.

Version 2 adds two immutable, literal protected spans selected from the original and exact occurrence-count checks in every candidate, independently of the model labels. The live examples protect “Rin must get written approval” plus “opening the crate,” and “exactly three” plus “copper disks.” Regression tests reject the actual v1 candidates despite their stored all-PASS labels. This fixes protected-span loss; it does not prove the remaining semantic relationships correct. For example, replacing before with after can retain all spans and must still fail the independent semantic audit.
