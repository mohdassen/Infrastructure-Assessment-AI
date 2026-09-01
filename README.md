# Infrastructure Assessment AI

Evidence-first infrastructure assessment platform.

## V1 goal

Turn messy infrastructure inventories and technical evidence into a normalized asset model, deterministic findings, defensible scores, and consulting-grade recommendations.

## Core architecture

Input files / collectors → Normalization → Infrastructure Data Model → Evidence Ledger → Rules Engine → Findings → Health / Completeness / Confidence → Reports

## Current MVP

- Next.js + TypeScript application shell
- Normalized infrastructure Asset model
- Evidence model with source traceability and confidence
- Deterministic assessment Rules Engine
- Separate Infrastructure Health, Assessment Completeness, and Evidence Confidence scores
- Flexible inventory column normalization aliases
- Initial lifecycle and missing-data rules
- Evidence-first assessment dashboard with sample data

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Product principles

1. No unsupported AI conclusions: every important finding must have evidence or be marked unverified.
2. Deterministic rules own objective checks; AI is used for contextual reasoning and document understanding.
3. Health score and assessment confidence are separate.
4. All source evidence remains traceable to file, sheet/page/row, asset, and rule.
5. Vendor-neutral by design.

## Next implementation milestones

1. Real CSV/XLSX upload and parser
2. Assessment workspace and file inventory
3. More lifecycle, backup, availability, DR and capacity rules
4. Finding details with evidence drill-down
5. Report generation
6. AI reasoning gateway with strict evidence grounding
7. Benchmark suite for precision/recall and false-positive tracking

> Do not commit real customer infrastructure data or secrets to this repository.
