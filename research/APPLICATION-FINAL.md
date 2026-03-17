# Frank — Mozilla Application (FINAL — copy-paste into form)

---

## Applicant Information
- **First Name:** Arthur
- **Last Name:** Camara
- **Email:** [your email]
- **Country:** United Kingdom
- **Applicant Type:** Individual / Informal team
- **Relationship with Mozilla:** No prior relationship with Mozilla

---

## Project Overview

**Proposed Project Title:**
Frank — Civic Listening Infrastructure for Local Democracy

**Project Summary (25 words or less):**
Frank crowdsources street-level interviews into public civic intelligence, making what communities actually need visible and what local governments do about it accountable.

**Project Category:**
Build Institutional Transparency & Accountability

**Project Stage:**
Working prototype

---

## What technology are you building? How does it address this cohort's theme? (150 words)

Frank is open-source civic listening infrastructure. Type any area: Frank pulls real census data, deprivation indices, and elected representatives from ONS, Parliament UK, and Nomis APIs, all cited with source links. It generates an interview guide grounded in Freire's dialogical method: ask about burdens, not opinions.

In the field, conversations are recorded with consent-to-publish, transcribed on-device via Whisper (no data leaves the phone), GPS randomised for privacy. AI synthesises interviews into ranked issues scored on severity, frequency, cost, and complexity, then generates policy proposals grounded in what the local governing body can actually do, linked to What Works evidence and LG Inform's 6,600+ performance metrics.

The output is a public page (frank.community/beckton) where anyone sees what residents said, what data shows, and what could change. Democracy's crisis isn't participation - it's listening. Frank makes listening systematic and accountable.

---

## Who benefits? How are you connecting with them? What challenge does it address? (150 words)

Three communities: residents whose voices are absent from formal consultation (non-English speakers, elderly, working parents, renters); local leaders who canvass door-to-door but lack methodology and infrastructure; and councils trapped in broken feedback mechanisms.

Our prototype uses real field interviews from Beckton, East London. Conversations with long-term residents, recent immigrants, factory workers, and football charity organisers, anonymised and processed through the full pipeline. A London ward candidate (Haringey Greens) confirmed the problem: doorstep intelligence is gathered but unstructured, unreproducible, and dies in the notebook.

Tower Hamlets Council has been under statutory government intervention since November 2024 for failing its Best Value Duty — a failure of institutional listening.

The challenge: representatives cannot act on what they cannot hear. Current mechanisms are broken (3% consultation response rates, surveys that manufacture opinions). Frank goes where people already are and makes what they say visible to power.

---

## Describe your project's traction. (150 words)

Working prototype deployed at frank.community with the full pipeline operational: area research pulling live data from Parliament UK, ONS Census, and deprivation APIs (all cited with source links); interview guide generation; field recording with GPS and consent; AI issue analysis; and policy proposal generation with evidence grounding.

The Beckton demo is built on real field interviews — not synthetic data. Six civic themes surfaced from messy street conversations (community identity loss, displacement, derelict infrastructure, isolation, integration barriers, traffic), validating both methodology and AI synthesis.

Arthur published peer-reviewed research on agent-based conversation analysis (AHFE 2024) and co-founded Insights, an AI conversation processing platform — the same technology powering Frank. A ward candidate validated the problem: "We already do door knocking but it's not in my control to implement this — GDPR compliance and other checks need to be done."

Data infrastructure requires zero paid APIs. Frank operates at near-zero marginal cost.

---

## Your Team

**Arthur Camara** (Technical lead, co-founder). Graduate of the Bartlett School of Architecture at UCL. Published researcher in agent-based conversation analysis (AHFE 2024) and co-founder of Insights, an AI platform using LLM agent chains to process conversation data. Currently AI Lead at Carlo Ratti Associati,designing their AI infrastructure, and led a Google-partnered AI agent project for a Brazilian architectural practice. Arthur builds the entire Frank platform. His Bartlett final project explored direct democracy, and the Beckton interviews underpinning the prototype were conducted as part of his architectural research.

**Mikhail Kobelyan** (Policy lead, co-founder). BA (Hons) in Politics and International Relations from UCL, with a focus on European security and securitisation. Contributed to the United Nations Office of Counter-Terrorism's (UNOCT) capacity-building programmes for member states, working on policy coordination and research. Mikhail leads Frank's policy methodology, stakeholder engagement, and research framework design.

---

## How does your technology actively advance democratic practice? What specific democratic outcomes does it enable? (200 words)

**Transparency:** Every Frank area page makes civic reality visible: what residents said, what official data shows, what policies exist, what could change. Every data point cites its source with a clickable link to the original dataset. Council responses (or silence) are equally visible. This isn't a data portal — it's a living accountability mechanism where ignoring published resident needs becomes a visible political choice.

**Participation:** Frank lowers the barrier from "attend a council meeting at 7pm Tuesday" to "have a conversation at the market with someone who asks how you're doing." It meets people where they already are, in their language, on their terms. The interview methodology is structurally designed to surface authentic lived experience, not manufactured opinion — you ask about burdens, not positions.

**Accountability:** The public area page creates a social contract. When what residents need is published and visible, inaction is no longer an information gap — it's a decision. Frank doesn't lobby or advocate. It makes reality legible. What politicians do with that legibility is democracy.

**Civic space protection:** Open-source methodology (AGPL v3), auditable prompts, GDPR-compliant consent, and transparent data governance ensure Frank resists capture by any political actor. The tool serves whoever listens, regardless of party.

---

## How is AI essential to achieving your democratic impact at scale? What would be lost without it? (200 words)

AI is not a feature of Frank. It is the infrastructure that makes civic listening possible at scale.

**Synthesis at democratic speed.** A single ward has 10,000+ residents. Even 50 field interviews produce 25+ hours of unstructured conversation. No human team can extract recurring issues, score them across five dimensions, identify systemic root causes, and map them to specific governing body competencies in the time a council budget cycle requires. AI does this in minutes. Without it, the interviews stay in notebooks and the patterns stay invisible.

**Evidence matching at global scale.** When Frank identifies "housing overcrowding" as an issue, AI cross-references What Works evidence, Campbell Collaboration reviews, and LG Inform performance data to surface what interventions have been tried worldwide, with what evidence quality, at what cost. This is an automated meta-study — previously requiring a research team and months. Now available for every issue in every area, instantly.

**Multilingual field processing.** Beckton is one of the most diverse areas in London. Civic listening that only works in English excludes the people who most need to be heard. Whisper transcribes Bengali, Urdu, Arabic, Polish conversations on-device. The synthesis layer detects themes across languages — something no monolingual researcher can do.

---

## What would success look like in 2-3 years? (150 words)

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

**Policy evidence layer** (3 months): Automated meta-study pipeline connecting What Works centres, Campbell Collaboration, J-PAL, and LG Inform evidence to every surfaced issue — so each links to international evidence of what worked, with quality ratings.

**Multilingual recording** (2 months): On-device Whisper supporting Bengali, Urdu, Arabic, Polish, Somali — the most common non-English UK urban languages. Currently English-only, excluding exactly who most needs to be heard.

**Public area pages** (2 months): frank.community/[area] as browsable public pages where residents upvote proposals, leave voice notes, and comment.

**Pilot deployment** (5 months): Structured field research in 3-5 London boroughs with trained, branded volunteers dispatched to markets, mosques, bus stops. Partner with ward councillors and community organisations. Produce real civic intelligence and demonstrate the full listening-to-action loop.

---

## Commitment to openness (150 words)

All code released under AGPL v3 — the same license as Decidim, Barcelona's participatory platform (477+ instances, 32 countries). Any institution deploying Frank must share modifications, preventing proprietary capture of civic infrastructure.

Open: all source code (server, web, mobile, AI pipeline); all AI prompts (version-controlled, auditable, modifiable by government clients); interview methodology (CC BY-SA 4.0); anonymised civic intelligence datasets; policy evidence mappings linking local issues to international evidence.

We publish quarterly learnings on methodology, AI bias findings, and democratic impact measurement. The project is on GitHub and contributions from civic technologists, researchers, and local government are welcomed.

Openness isn't a feature — it's the trust architecture. If a council is going to act on AI-synthesised civic intelligence, they need to see exactly how the synthesis works. If a resident flags that an issue was mischaracterised, the methodology must be inspectable. Transparency is the product.

---

## Links

**Demo:** https://frank.community (live prototype — use /beckton for the real-data demo)

**Video:** [Google Drive link if recorded]

---

## Administrative

**How did you hear:** Mozilla Foundation Website

**AI tools used:** Yes. AI tools were used for research (web search, literature review, data compilation) and to refine language clarity. All ideas, project vision, architecture, and strategic decisions are original work of the team.
