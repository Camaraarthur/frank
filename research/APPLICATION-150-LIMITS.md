# Frank — Application Answers (word-limited)

---

## What technology are you building? How does it address this cohort's theme? (150 words)

Frank is open-source civic listening infrastructure. Type any area: Frank pulls real census data, deprivation indices, and elected representatives from ONS, Parliament UK, and Nomis APIs — all cited with source links. It generates an interview guide grounded in Freire's dialogical method: ask about burdens, not opinions.

In the field, conversations are recorded with consent-to-publish, transcribed on-device via Whisper (no data leaves the phone), GPS randomised for privacy. AI synthesises interviews into ranked issues scored on severity, frequency, cost, and complexity, then generates policy proposals grounded in what the local governing body can actually do — linked to What Works evidence and LG Inform's 6,600+ performance metrics.

The output is a public page (frank.community/beckton) where anyone sees what residents said, what data shows, and what could change. Democracy's crisis isn't participation — it's listening. Frank makes listening systematic and accountable.

---

## Who benefits? How are you connecting with them? What challenge does it address? (150 words)

Three communities: residents whose voices are absent from formal consultation (non-English speakers, elderly, working parents, renters); local leaders who canvass door-to-door but lack methodology and infrastructure; and councils trapped in broken feedback mechanisms.

Our prototype uses real field interviews from Beckton, East London — conversations with long-term residents, recent immigrants, factory workers, and football charity organisers, anonymised and processed through the full pipeline. A London ward candidate (Haringey Greens) confirmed the problem: doorstep intelligence is gathered but unstructured, unreproducible, and dies in the notebook.

Tower Hamlets Council has been under statutory government intervention since November 2024 for failing its Best Value Duty — a failure of institutional listening.

The challenge: representatives cannot act on what they cannot hear. Current mechanisms are broken (3% consultation response rates, surveys that manufacture opinions). Frank goes where people already are and makes what they say visible to power.

---

## Describe your project's traction. (150 words)

Working prototype deployed at frank.community with the full pipeline operational: area research pulling live data from Parliament UK, ONS Census, and deprivation APIs (all cited with source links); interview guide generation; field recording with GPS and consent; AI issue analysis; and policy proposal generation with evidence grounding.

The Beckton demo is built on real field interviews — not synthetic data. Six civic themes surfaced from messy, multilingual street conversations (community identity loss, displacement, derelict infrastructure, isolation, integration barriers, traffic), validating both methodology and AI synthesis.

Arthur published peer-reviewed research on agent-based conversation analysis (AHFE 2024) and co-founded Insights, an AI conversation processing platform — the same technology powering Frank. A ward candidate validated the problem: "We already do door knocking but it's not in my control to implement this — GDPR compliance and other checks need to be done."

Data infrastructure requires zero paid APIs. Frank operates at near-zero marginal cost.

---

## How does your technology advance democratic practice? + How is AI essential? (200 words)

**Transparency:** Every Frank area page makes civic reality visible — what residents said, what official data shows, what policies exist, what could change. Every data point cites its source with a clickable link. Council responses (or silence) are equally visible. This is transparency as a living accountability mechanism, not a data portal.

**Participation:** Frank lowers the barrier from "attend a council meeting at 7pm Tuesday" to "have a conversation at the market." It meets people where they are, in their language. The methodology surfaces authentic experience, not manufactured opinion.

**Accountability:** If what residents need is published and visible, inaction becomes a political choice rather than an information gap. Frank doesn't advocate — it makes reality legible.

**Why AI is essential:** Three steps are impossible without it. First: synthesising hundreds of unstructured interviews into scored, ranked issues mapped to governing body competencies — in minutes, not months. Second: automated meta-studies connecting each local issue to global evidence of what worked, from What Works centres, Campbell Collaboration, and 6,600+ LG Inform metrics. Third: multilingual field processing — Whisper transcribes Bengali, Urdu, Arabic conversations that monolingual researchers cannot. Without AI, Frank is a recording app. With it, Frank is civic infrastructure.

---

## What would success look like in 2-3 years? How will you measure? (150 words)

50+ UK areas with active Frank pages containing real resident-contributed civic intelligence. 500+ field interviews synthesised into public policy briefings. 5+ councils actively using Frank, with at least 2 policy changes traceable to Frank-surfaced issues. Open-source methodology adopted independently by 3+ civic organisations.

Measurement: Are Frank-surfaced issues reflected in council agendas within 6 months? Does the demographic profile of contributors match area demographics better than traditional consultation? Can we trace resident voice to issue to council action? Do residents confirm their Frank page reflects lived experience?

Success isn't adoption metrics — it's whether the information Frank produces changes what governments do. One council adjusting its housing strategy because Frank showed overcrowding was the top resident burden, with evidence from Copenhagen and Newham's own data, would validate the entire thesis. We measure democratic signal, not engagement.

---

## What do you need for sustainability? Biggest barriers? (150 words)

Frank operates as a Community Interest Company (CIC) — asset-locked, open-source (AGPL v3). Revenue: councils pay to claim their area page, connect internal data, and access analytics — priced below GBP 25,000 to avoid formal tendering. Individuals use Frank free. On-device transcription costs nothing. AI synthesis costs are negligible per session.

Biggest barriers: Government procurement inertia — councils adopt slowly. Mitigation: the public Frank page creates demand from residents; councils subscribe because being publicly uninformed is politically costly. Trust — civic tools need institutional legitimacy. Mitigation: every prompt is auditable, we pursue Digital Public Good certification and UK Algorithmic Transparency Recording Standard compliance. Sustained contribution — the platform needs ongoing interviews. Mitigation: politics students, ward candidates, council volunteers, and community organisers already canvass. Frank gives them infrastructure. Anyone interviewed can become an interviewer by opening the app.

---

## What would $50,000 unlock? (150 words)

Twelve months of full-time development and field deployment:

**Policy evidence layer** (3 months): Automated meta-study pipeline connecting What Works centres, Campbell Collaboration, J-PAL, and LG Inform evidence to every surfaced issue — so each issue links to international evidence of what worked, with quality ratings.

**Multilingual recording** (2 months): On-device Whisper supporting Bengali, Urdu, Arabic, Polish, Somali — the most common non-English UK urban languages. Currently English-only, excluding exactly who most needs to be heard.

**Public area pages** (2 months): frank.community/[area] as browsable public pages where residents upvote proposals, leave voice notes, and comment.

**Pilot deployment** (5 months): Structured field research in 3-5 London boroughs with trained, branded volunteers dispatched to markets, mosques, bus stops. Partner with ward councillors and community organisations. Produce real civic intelligence and demonstrate the full listening-to-action loop.

---

## Commitment to openness (150 words)

All code released under AGPL v3 — the same license as Decidim, Barcelona's participatory platform (477+ instances, 32 countries). Any institution deploying Frank must share modifications, preventing proprietary capture of civic infrastructure.

Open: all source code (server, web, mobile, AI pipeline); all AI prompts (version-controlled, auditable, modifiable by government clients); interview methodology (CC BY-SA 4.0); anonymised civic intelligence datasets; policy evidence mappings linking local issues to international evidence.

We publish quarterly learnings on methodology, AI bias findings, and democratic impact measurement. The project is on GitHub and contributions from civic technologists, researchers, and local government are welcomed.

Openness isn't a feature — it's the trust architecture. If a council is going to act on AI-synthesised civic intelligence, they need to see exactly how the synthesis works. If a resident flags that an issue was mischaracterised, the methodology must be inspectable. Transparency is the product.
