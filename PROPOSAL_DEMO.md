# MatterBridge proposal demo

## One-sentence framing

MatterBridge explores whether a legal team can turn matter documents and
external counsel communications into a queryable, evidence-aware Company Brain
that also coordinates the next workflow action without presenting unresolved
legal questions as settled conclusions.

## Five-minute walkthrough

1. Start the local demo with `MATTERBRIDGE_STORAGE_MODE=local npm run dev`.
2. Open `/matter-network`. Show the two simple matters: Project Atlas
   (employment/HR) and Northstar (financing). Point to the shared automation
   loop: capture, extract, cite, queue, refer, and decide.
3. Open `/legal-counsel` and ask: “What did external counsel advise about the
   employee review?” The response is assembled from matter assertions,
   counsel records, and documentary passages, with links back to the source
   matter.
4. Open Project Atlas → External Counsel. Show the question, received advice,
   open item, and the scoped counsel workspace. The external view exposes only
   the selected matter’s questions, documents, and evidence references.
5. Open a matter’s Documents or Review route to show that extracted facts stay
   visibly tied to source documents and can be reviewed before they influence
   internal strategy.

## Research contribution to state

The prototype is intentionally a local, synthetic-data V1. It demonstrates the
interaction and data model for document-backed assertions, deterministic
retrieval, workflow state, and scoped counsel communication. It does not claim
production authentication, permissions, OCR quality, legal advice, or a final
decision engine. Those boundaries are part of the research design: the system
keeps evidence, inference, counsel advice, and internal decisions distinct so a
lawyer remains the accountable decision-maker.

## Resetting the demo

`npm run demo:reset` clears only ignored local demo state. The next request
reseeds MAT-101 and MAT-102.
