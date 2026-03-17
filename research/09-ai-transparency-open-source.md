# AI Transparency, Auditability, and Open Design for Civic Technology

Deep research for Beat -- an AI-powered civic tool that uses Gemini to synthesise field interviews into issue rankings and policy proposals. This document covers what it takes to make such a system transparent, auditable, trustworthy, and open by design.

---

## 1. What Should Be Open vs. Private

### Open by Default

- **Prompts and prompt templates**: The exact instructions given to the AI. This is the core of methodological transparency. If government clients and citizens cannot see how the AI is being instructed, they cannot evaluate whether the process is fair.
- **Methodology documentation**: How interviews are coded, how themes are extracted, how severity scores are calculated, how issues are ranked. The full analytical pipeline.
- **Weighting algorithms**: Any formula or logic that determines how individual interview data points contribute to aggregate scores. If certain demographics are weighted differently, or if recency matters, that logic must be visible.
- **Scoring rubrics**: The criteria the AI uses to assign severity levels (e.g., what makes something a 4 vs. a 3). These should be published, versioned, and debatable.
- **Aggregation logic**: How individual interview syntheses roll up into community-level findings. Statistical methods, thresholds, and decision rules.
- **Source code**: The application code, data pipeline, and infrastructure configuration. AGPL or similar license (see Section 7).
- **Model cards / system documentation**: What AI model is used, what version, what its known limitations are, what languages it performs well/poorly in.
- **Audit logs**: A record of every AI invocation -- what prompt was used, what model version, what the input was (anonymised), what the output was, and when.

### Private / Protected

- **Raw interview transcripts**: These contain personal stories, potentially identifying details, and sensitive community information. Must be protected under data protection law and community consent agreements.
- **Personal data**: Names, locations, contact details, demographic information linked to individuals. Never exposed in outputs.
- **API keys and infrastructure secrets**: Standard operational security.
- **Pre-publication findings**: Intermediate results that could be misinterpreted without context. Embargoed until validated by researchers and community.

### The Grey Zone

- **Anonymised interview excerpts used as citations**: These support explainability (Section 4) but must be carefully anonymised. The community should consent to this use.
- **Demographic breakdowns of participants**: Useful for bias auditing (Section 5) but could be re-identifying in small communities. Aggregate only; minimum group sizes.

---

## 2. Algorithmic Transparency Frameworks and Regulation

### UK Algorithmic Transparency Recording Standard (ATRS)

The ATRS became mandatory for UK central government in March 2024. It requires public sector organisations to publish standardised records for any algorithmic tool that has "significant influence on a decision-making process with public effect" or "directly interacts with the general public."

As of 2025, over 125 records have been published across government. The standard requires disclosure of:
- The tool's purpose and intended use
- How it was developed and what data it uses (distinguishing development vs. operational data)
- How decisions are made with or by the tool
- Risks identified and mitigations applied
- Human oversight mechanisms

**Relevance to Beat**: If a UK council uses Beat to inform policy decisions, the council would likely need to publish an ATRS record. Beat should pre-populate as much of the ATRS template as possible, making compliance effortless for government clients. This is a competitive advantage: build the ATRS record into the product.

Reference: [GOV.UK ATRS Hub](https://www.gov.uk/government/collections/algorithmic-transparency-recording-standard-hub) | [Making ATRS Mandatory](https://dataingovernment.blog.gov.uk/2025/05/08/making-the-algorithmic-transparency-recording-standard-atrs-mandatory-across-government/)

### EU AI Act

The EU AI Act's transparency obligations under Article 50 become enforceable in August 2026. Key requirements:
- Users must be informed when they are interacting with an AI system
- AI-generated content must be marked and labelled (Code of Practice draft published December 2025)
- High-risk AI systems require conformity assessments, technical documentation, and human oversight
- Systems used in public services (migration, justice, democratic processes) face additional scrutiny

A civic tool that synthesises community input into policy recommendations could be classified as high-risk depending on how directly its outputs influence government decisions. Even if classified as limited-risk, transparency obligations apply.

Reference: [EU AI Act Article 50](https://artificialintelligenceact.eu/article/50/) | [EU AI Act 2026 Compliance](https://www.legalnodes.com/article/eu-ai-act-2026-updates-compliance-requirements-and-business-risks)

### NIST AI Risk Management Framework (US)

The NIST AI RMF (version 1.0, January 2023) is voluntary but widely adopted. It organises trustworthy AI around four functions: GOVERN, MAP, MEASURE, MANAGE. Key trustworthiness characteristics include:
- Accountable and transparent
- Fair with harmful bias managed
- Valid and reliable
- Safe and secure

For public sector deployment, NIST emphasises: examining where AI influences program eligibility decisions, assessing risks of algorithmic bias, building transparent processes with feedback channels, and aligning AI use with civil rights protections.

Reference: [NIST AI RMF](https://www.nist.gov/itl/ai-risk-management-framework)

### Canada's Algorithmic Impact Assessment (AIA)

Canada requires federal agencies to complete an Algorithmic Impact Assessment before deploying automated decision systems. The AIA tool produces a score that determines the level of human oversight, transparency, and legal review required. This is notable as one of the most operationalised government AI accountability frameworks globally.

Reference: [Canada AIA Tool](https://www.canada.ca/en/government/system/digital-government/digital-government-innovations/responsible-use-ai/algorithmic-impact-assessment.html)

### Open Government Partnership

The OGP has documented how algorithm registers (Netherlands, Finland, France) and transparency standards are being adopted globally. Their research on algorithmic accountability emphasises that accessibility means external independent experts can access an algorithm for inspection -- transparency is a prerequisite for meaningful auditing.

Reference: [OGP Algorithmic Transparency](https://www.opengovpartnership.org/united-kingdom-digital-governance-story/)

---

## 3. Prompt Auditing and Version Control

### The Problem

If Beat's outputs depend on how Gemini is prompted, then the prompts are the methodology. Changing a prompt changes the results. Government clients and citizens need to know: what prompts were used, when they changed, and why.

### Architecture for Prompt Governance

**Version control**: Store all prompts in a Git repository (or equivalent). Every prompt change gets a commit with:
- What changed
- Why it changed (e.g., "reduced tendency to over-weight economic framing")
- Who approved the change
- What testing was done before deployment

**Prompt registry**: Maintain a structured catalogue of all active prompts with:
- Unique identifier and version number
- Purpose description
- Input schema (what data the prompt receives)
- Expected output schema
- Known limitations and failure modes
- Last review date and reviewer

**Change control process**:
1. Proposed change documented with rationale
2. Testing against a held-out dataset of interviews (same inputs, compare outputs)
3. Bias audit on changed outputs (Section 5)
4. Peer review by at least one domain expert (community researcher) and one technical reviewer
5. Staged rollout with monitoring
6. Public changelog published

**Audit trail**: For every AI invocation in production, log:
- Prompt version used
- Model version (Gemini model ID, temperature, etc.)
- Timestamp
- Input hash (not the raw input, for privacy)
- Output stored with citation links
- Processing time and token counts

### Client Access to Prompts

Government clients should be able to:
- **View** all active prompts and their version history
- **Propose modifications** through a structured review process (not unilateral changes)
- **Fork** prompts for local adaptation (e.g., adding culturally specific severity criteria) while maintaining a link to the upstream standard
- **Compare** outputs between prompt versions on the same dataset

This is analogous to how Decidim (the open-source participatory democracy platform) lets administrators configure participation rules -- but with the rigour of an auditable change process.

Reference: [Enterprise AI Prompt Governance](https://www.promptanthology.com/blog/enterprise-ai-prompt-governance) | [Prompt Standards for the Public Sector](https://builtbyrose.co/prompt-standards-public-sector-constituent-services-ai/)

---

## 4. Explainability: Showing WHY the AI Scored an Issue as Severity 4

### The Citation Chain Approach

For a civic tool, explainability means being able to answer: "Why did the AI say housing is severity 4 and transport is severity 3?" The answer must trace back to specific evidence.

**Architecture**:

```
Community Report
  -> Issue: Housing (Severity 4)
    -> Contributing factors:
      -> "Mentioned by 73% of interviewees" [frequency evidence]
      -> "Described as urgent/crisis by 12 of 15 interviewees" [intensity evidence]
        -> Quote: "We've been on the waiting list for 3 years..." [Interview #47, anonymised]
        -> Quote: "My children share a room with mould on the walls..." [Interview #23, anonymised]
      -> "Cross-referenced with 2 other issues (health, education)" [interconnection evidence]
      -> "Severity assessment reasoning: High frequency + crisis-level language + multi-domain impact = 4/5"
    -> Model confidence: 0.82
    -> Prompt version: v2.3.1
```

### Specific Techniques

**Structured output with reasoning**: Instruct the AI to produce its reasoning in a structured format -- not just a score, but the factors that led to the score. Use Gemini's structured output capabilities to enforce this.

**Quote attribution**: Every claim in the synthesis must link to at least one source quote. If the AI cannot cite a specific interview excerpt, the claim should be flagged as unsupported.

**Confidence scoring**: Report model confidence alongside every output. Low confidence triggers human review.

**Counterfactual explanations**: "If 3 fewer people had mentioned housing, the severity would have dropped to 3." This helps users understand the sensitivity of the scoring.

**Disagreement surfacing**: When interviewees contradict each other, surface the disagreement rather than averaging it away. "8 interviewees said housing is the top issue; 4 said it's improving."

### What Mozilla's Research Says

Mozilla's "AI Transparency in Practice" report (2024) strongly recommends using interpretable models over black-box solutions where traceability is a design requirement. They reference Cynthia Rudin's finding that simpler, inherently interpretable models often perform comparably to complex ones while maintaining transparency.

The report also identifies an "explainability gap": 63% of AI practitioners surveyed distrusted current model interpretation methods (LIME, SHAP, etc.), finding they sometimes produce "misleading or wrong explanations." For Beat, this means: do not rely on post-hoc explainability tools. Build explainability into the pipeline design itself -- structured prompts that require the AI to show its work.

Reference: [Mozilla AI Transparency in Practice](https://www.mozillafoundation.org/en/research/library/ai-transparency-in-practice/ai-transparency-in-practice/)

---

## 5. Bias Auditing

### Why This Matters for Beat

If Beat synthesises interviews from a diverse community, the AI might:
- Give more weight to eloquently expressed concerns (education bias)
- Underweight concerns expressed in non-English languages or dialects
- Misinterpret culturally specific framings of issues
- Cluster minority perspectives into "other" rather than surfacing them
- Reflect the biases embedded in its training data (LLMs are heavily influenced by English-language, Western, capitalist perspectives)

### Bias Audit Framework for Interview Synthesis

**1. Demographic parity testing**
- Run the same synthesis pipeline on demographically stratified subsets
- Compare: Do issues raised primarily by one demographic group get systematically lower severity scores?
- Test across: age, gender, ethnicity, language, disability status, socioeconomic indicators

**2. Language and cultural framing tests**
- Translate the same concern into different registers (formal English, colloquial English, translated from another language)
- Compare severity scores and theme classifications
- Test whether the AI handles code-switching, dialect, and non-standard grammar fairly
- Research shows language is "not merely a tool of communication but a gateway to culture, rights, and political participation"

**3. Ordering and position bias**
- Randomise the order in which interview excerpts are presented to the AI
- Check whether earlier or later excerpts get more weight
- Test with different batch sizes

**4. Missing perspective detection**
- Compare the demographic profile of interviewees against community demographics
- Flag when certain groups are underrepresented in the interview data (this is a data collection issue, not an AI issue, but the tool should surface it)
- Report: "This synthesis is based on 50 interviews. 80% of interviewees were over 40. Concerns of younger residents may be underrepresented."

**5. Red-teaming**
- Deliberately craft adversarial inputs: interviews that express concerns in unusual ways, in minority languages, using cultural references the AI might not understand
- Test whether these are appropriately represented in outputs

### Tools

- **Aequitas**: Open-source bias audit toolkit. Assesses disparities across demographic groups using metrics like statistical parity and false positive rate parity.
- **IBM AI Fairness 360 (AIF360)**: Provides 70+ fairness metrics and 10+ bias mitigation algorithms.
- **Custom evaluation sets**: Build a test corpus of interviews with known ground-truth themes and severity. Run the pipeline and measure divergence.

### Reporting

Publish bias audit results alongside every community report. Not buried in an appendix -- surfaced as a first-class element: "Bias Audit Summary: This synthesis was tested for demographic parity across [X] dimensions. [Findings]."

Reference: [AI Multilingual Tools for Social Innovation](https://www.frontiersin.org/journals/political-science/articles/10.3389/fpos.2026.1792788/full) | [Cultural Bias in LLMs](https://arxiv.org/abs/2311.14096)

---

## 6. Data Governance Models

### The Ownership Question

In Beat's context, data flows through multiple parties:
- **The researcher** collects interviews
- **The community members** share their experiences
- **The platform (Beat)** processes and synthesises
- **The commissioning body** (council, NGO) receives findings
- **The public** may see published reports

Who owns what?

### Model Comparison

| Model | How It Works | Pros for Beat | Cons |
|-------|-------------|---------------|------|
| **Data Trust** | Independent trustees govern data on behalf of contributors, with fiduciary duty to act in their interests | Strong legal framework; trustees can refuse harmful use; established case law | Requires legal setup; trustees need expertise; can be slow |
| **Data Cooperative** | Members collectively own and govern data; democratic decision-making on use | Aligns with community empowerment; participants have agency; scales community voice | Coordination overhead; requires engaged membership; challenging at scale |
| **Data Commons** | Data treated as shared community asset; governance determined collectively, not by individual owners | Open access; reduces barriers; good for public interest research | Harder to protect individual interests; may conflict with GDPR; less control |
| **Platform Stewardship** | Platform holds data with contractual obligations to community | Simple to implement; clear accountability | Power imbalance; trust depends entirely on platform behaviour |
| **Sovereign Individual** | Each participant retains full control; platform accesses via consent | Maximum individual autonomy; GDPR-aligned | Fragmented; hard to do aggregate analysis; consent fatigue |

### Recommended Approach for Beat

A **hybrid model** combining elements of data trust and data cooperative:

1. **Community consent framework**: Before data collection, establish a community data agreement that specifies:
   - What data will be collected
   - How it will be processed (including AI synthesis)
   - Who will see what outputs
   - How long data is retained
   - How community members can withdraw consent
   - What happens to data if the platform ceases to operate

2. **Tiered data access**:
   - **Tier 1 (Raw transcripts)**: Accessible only to the research team and the interviewee themselves. Encrypted at rest. Deleted after agreed period.
   - **Tier 2 (Anonymised excerpts)**: Used for AI processing and citation chains. Community can review and redact.
   - **Tier 3 (Synthesised findings)**: Published reports. Community validates before publication.
   - **Tier 4 (Aggregate metadata)**: Statistics about the process (number of interviews, demographic breakdown). Fully open.

3. **Data deletion and portability**: Community can request full deletion. All data exportable in open formats.

4. **Succession planning**: If Beat shuts down, data returns to the community (or is deleted at their choice). This should be in the terms from day one.

Reference: [Data Cooperatives](https://arxiv.org/html/2504.10058v1) | [Nesta: New Ecosystem of Trust](https://www.nesta.org.uk/blog/new-ecosystem-trust/) | [Data Commons](https://policyreview.info/glossary/data-commons)

---

## 7. Open Source Licensing

### License Options

| License | Type | Key Feature | Fit for Beat |
|---------|------|-------------|-------------|
| **AGPL v3** | Strong copyleft | Anyone offering the software as a service must publish their modifications | Best fit. Prevents a large consultancy from taking Beat's code, running it as a paid service, and contributing nothing back |
| **Apache 2.0** | Permissive | Patent protection, but allows proprietary forks | Good for maximum adoption, but a government contractor could close-source improvements |
| **GPL v3** | Copyleft | Modifications must be shared, but SaaS loophole exists | Decent, but the SaaS loophole undermines the civic purpose |
| **MIT** | Permissive | Maximum freedom | Too permissive for civic tech; allows value extraction without contribution |
| **EUPL** | Copyleft | EU-specific, compatible with GPL/AGPL, explicit multilingual legal text | Worth considering for EU government clients |

### Recommendation: AGPL v3

AGPL is the right choice for Beat because:
- Beat is a web application / SaaS. Without AGPL, someone could take the code, deploy it commercially, and never contribute back.
- Decidim (the gold standard for open civic tech) uses AGPL v3 for exactly this reason.
- AGPL signals to Mozilla, government clients, and communities that this is genuinely open -- not "open-washing."
- Government procurement increasingly recognises AGPL as a legitimate open-source license.

**Complementary licensing**:
- **Documentation and methodology**: Creative Commons BY-SA 4.0 (same as Decidim)
- **Prompt templates**: Consider dual-licensing -- AGPL for the code, CC BY-SA for the prompts as methodology documents
- **Community data agreements**: CC0 (public domain) for the templates, so anyone can reuse them

Reference: [AGPL v3](https://opensource.org/license/agpl-v3) | [Decidim license](https://github.com/decidim/decidim)

---

## 8. Existing Open Civic AI Projects

### Decidim
- **What**: Open-source participatory democracy platform, created by Barcelona
- **Scale**: 477+ instances across 32 countries, 925,000+ participants
- **AI**: Increasingly integrating AI for proposal clustering and synthesis
- **Transparency**: Full code transparency (AGPL v3), decision traceability, API access
- **Lesson for Beat**: The gold standard for open civic tech governance. Study their community governance model.
- https://decidim.org

### Pol.is
- **What**: Open-source platform for large-scale opinion clustering and consensus finding
- **Notable use**: vTaiwan used Pol.is to develop Uber regulation policy; consensus items were ratified into law
- **AI**: Uses machine learning to cluster opinions and identify areas of consensus vs. division
- **Transparency**: Open source, but research shows most citizens lack technical literacy to audit the clustering algorithms
- **Lesson for Beat**: Pol.is proves AI-assisted civic synthesis can lead to real policy. But "open source" alone is not enough -- you need interpretable outputs.
- https://pol.is

### Talk to the City (T3C)
- **What**: Open-source AI tool for scaling deliberation, by AI Objectives Institute
- **How it works**: Processes unstructured text, interviews, and structured data; uses LLMs to extract arguments; clusters into hierarchical themes; provides interactive exploration
- **Transparency**: Report structure designed to mitigate LLM inaccuracies by connecting summaries directly to individual opinions. Each respondent's specific claims are preserved and attributable.
- **Lesson for Beat**: T3C is the closest existing project to what Beat does. Study their citation chain architecture and interactive report format.
- https://github.com/AIObjectives/talk-to-the-city-reports

### Consul Democracy
- **What**: Open-source citizen participation platform used by Madrid, Buenos Aires, and others
- **Recent development**: Launched an open-source, LLM-powered civic assistant project (March 2025)
- **Transparency**: Full code transparency, designed for institutional deployment
- **Lesson for Beat**: Shows how established civic platforms are adding AI. Watch their approach to AI governance.
- https://consuldemocracy.org

### UrbanistAI (Helsinki)
- **What**: AI-powered visualisation tool for participatory urban planning
- **How it works**: Integrates AI-powered visualisation with co-design features for residents and businesses
- **Lesson for Beat**: Demonstrates AI-enhanced civic participation in a government context. Focus on how they built institutional trust.

### Civic AI (6-Pack of Care)
- **What**: Framework and community for responsible civic AI
- **Focus**: Six areas of care for civic AI deployment
- **Lesson for Beat**: Provides a normative framework for what "responsible" means in this context.
- https://civic.ai

Reference: [OECD AI in Civic Participation](https://www.oecd.org/en/publications/2025/06/governing-with-artificial-intelligence_398fa287/full-report/ai-in-civic-participation-and-open-government_51227ce7.html) | [Democracy Technologies Database](https://democracy-technologies.org/database/)

---

## 9. Trust Seals and Certification

### Digital Public Goods (DPG) Certification

The Digital Public Goods Alliance (DPGA), endorsed by the UN Secretary-General, maintains a registry of certified digital public goods. As of October 2025, 222 solutions are registered.

**The 9 DPG Standard Indicators**:
1. Relevance to the Sustainable Development Goals
2. Use of an approved open-source license (OSI-approved)
3. Clear ownership
4. Platform independence
5. Documentation
6. Mechanism for extraction of non-PII data
7. Adherence to privacy and applicable laws
8. Adherence to standards and best practices
9. Do no harm by design

Recent updates to indicators 7 and 9 now require demonstrating concrete practices like data minimisation. The standard emphasises that safeguards must be "integrated at the design and development stage rather than being retrofitted."

**Relevance to Beat**: DPG certification would be a powerful signal for international credibility, especially for deployment in low- and middle-income countries. Beat could realistically meet all 9 indicators. This should be a medium-term goal.

Reference: [DPG Standard](https://github.com/DPGAlliance/DPG-Standard) | [DPG Registry](https://www.digitalpublicgoods.net/registry) | [UNICEF DPG Guide](https://unicef.github.io/publicgoods-accelerator-guide/about-dpgs/what-is-a-dpg/)

### What Works Cities Certification

US-focused programme that grades localities on 45 criteria related to data-driven governance. Less directly applicable but useful for understanding what US government clients value in evidence-based tools.

### Algorithmic Registers

The Netherlands, Finland, and France maintain public algorithm registers. Helsinki's AI Register is notable for requiring plain-language descriptions of how AI systems work, what data they use, and how humans are involved. Beat could pre-generate register entries for clients.

### ISO/IEC Standards

- **ISO/IEC 42001**: AI management system standard
- **ISO/IEC 23894**: AI risk management guidance
- These are expensive to certify against but signal enterprise-grade governance.

---

## 10. Mozilla's AI Transparency Principles

### Mozilla's Trustworthy AI Framework

Mozilla organises its AI advocacy around three pillars:

1. **Openness**: Open-source AI development ensures transparency, security, and accessibility. Mozilla advocates for AI systems where the code, training data, and decision-making processes are inspectable.

2. **Competition**: Preventing monopolistic control of AI. Supporting diverse, community-driven alternatives to Big Tech AI.

3. **Accountability**: Effective governance that mitigates AI risks. Transparency must be mandated so systems and their potential for harm can be fully understood.

### Key Mozilla Positions Relevant to Beat

**"Automated decisions can have huge personal impacts but reasons for decisions are often opaque, so transparency must be mandated so systems and their potential for harm can be fully understood."** This is directly relevant to Beat's synthesis outputs informing government decisions.

**Meaningful transparency**: Mozilla's research (the "AI Transparency in Practice" report) distinguishes between performative transparency (publishing information nobody can use) and meaningful transparency (useful, actionable information tailored to the literacy and needs of specific stakeholders). Beat must design for the latter.

**Multi-stakeholder transparency**: Different audiences need different information:
- **Builders/internal teams**: Model cards, architecture diagrams, feature importance
- **Domain experts/clients (councils, researchers)**: Real-time explanations, decision decomposition, dataset descriptions
- **Affected individuals (community members)**: Appeal channels, clear communication about limitations
- **Regulators**: Comprehensive technical documentation, metrics justification
- **General public**: Accessible summaries (Mozilla notes this is the most neglected audience)

**Interpretable over black-box**: Mozilla explicitly recommends interpretable models over post-hoc explanation tools where traceability matters. For Beat, this translates to: design the AI pipeline to produce structured, citation-backed reasoning -- not a black-box score with an explanation bolted on.

**Open source as trust mechanism**: Mozilla's "Joint Statement on AI Safety and Openness" advocates for open-source AI development as a safety and trust mechanism, not despite safety concerns but because of them.

### Mozilla Foundation's Democracy x AI Cohort (2026)

Mozilla launched a "Democracy x AI" incubator cohort in 2026, specifically for AI-driven civic technologies that strengthen democratic systems through transparency, accountability, and protected civic participation. This programme provides funding, structured support, and global visibility. Beat's mission aligns directly.

Reference: [Mozilla Trustworthy AI](https://www.mozillafoundation.org/en/internet-health/trustworthy-artificial-intelligence/) | [Mozilla AI Transparency in Practice](https://assets.mofoprod.net/network/documents/AI_Transparency_in_Practice_Report.pdf) | [Mozilla 2025 Policy Priorities](https://blog.mozilla.org/netpolicy/2025/03/27/mozilla-shares-2025-policy-priorities-and-recommendations-for-creating-an-internet-where-everyone-can-thrive/) | [Democracy x AI Cohort 2026](https://opportunitydesk.org/2026/02/20/mozilla-foundation-incubator-democracy-x-ai-cohort-2026/) | [Joint Statement on AI Safety and Openness](https://open.mozilla.org/ai-safety/)

---

## Synthesis: What This Means for Beat

### The Transparency Stack

Beat should implement transparency at every layer:

```
Layer 1: Code         -> Open source (AGPL v3), public repository
Layer 2: Methodology  -> Published prompts, scoring rubrics, weighting logic
Layer 3: Process      -> Versioned prompts, audit logs, change control
Layer 4: Output       -> Citation chains, confidence scores, disagreement surfacing
Layer 5: Governance   -> Community data agreements, bias audits, demographic reporting
Layer 6: Certification -> DPG Standard, ATRS-ready, algorithm register entries
```

### Immediate Actions

1. **Open the repository** under AGPL v3 with CC BY-SA 4.0 for documentation
2. **Publish all prompts** in a versioned, browsable format with plain-language explanations
3. **Implement citation chains** so every claim traces to source quotes
4. **Add confidence scores** to all AI outputs
5. **Build an ATRS template generator** so UK council clients can comply effortlessly
6. **Design the bias audit pipeline** -- start with language/register testing

### Medium-Term Goals

7. **Apply for Digital Public Goods certification**
8. **Publish bias audit methodology and results** alongside every deployment
9. **Implement community data agreements** with tiered access model
10. **Build a prompt review interface** for government clients
11. **Create plain-language "how it works" documentation** for community members (Mozilla's most neglected audience)

### Competitive Positioning

No existing civic AI tool does all of this. Talk to the City comes closest on the citation chain / synthesis transparency front. Decidim leads on open governance. But nobody has combined rigorous AI transparency with community-driven data governance in a field-interview-to-policy pipeline. This is Beat's opportunity.

The combination of AGPL licensing + published prompts + citation chains + bias audits + ATRS compliance + DPG certification would make Beat the most transparent AI civic tool in existence. That is a story Mozilla wants to fund, governments want to trust, and communities deserve.
