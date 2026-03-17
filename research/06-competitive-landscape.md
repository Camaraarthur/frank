# Competitive Landscape: Civic Technology & Community Engagement

*Last updated: March 2026*

---

## Executive Summary

Beat occupies a unique position in the civic technology landscape. While dozens of tools exist for democratic participation, community engagement, transcription, qualitative research, and policy monitoring, **no single tool connects field-level voice capture to area-level issue mapping to policy intelligence**. Beat's competitors each solve a fragment of the problem. Beat solves the workflow end-to-end: go to a place, listen to people, surface what matters, and connect it to the structures that can act.

---

## 1. Direct Competitors: Civic Listening & Community Engagement Platforms

### Pol.is (The Computational Democracy Project)

- **What it is:** Open-source platform for large-scale opinion gathering. Participants submit short statements (<140 chars), others vote agree/disagree/pass. Machine learning clusters consensus and division.
- **What it does well:** Brilliant at surfacing consensus from large groups. The "no reply button" design prevents flame wars. Used by Taiwan's vTaiwan process, arguably the most successful digital democracy initiative globally. Free and open-source.
- **What it misses:** Entirely text-based and online-only. No field component. No geographic grounding. No connection to policy structures. Assumes people are already engaged enough to participate digitally. Cannot capture the voices of people who would never open a browser to submit an opinion.
- **How Beat is different:** Beat goes to the street; Pol.is waits for people to come to a screen. Beat captures rich spoken testimony with emotional nuance; Pol.is reduces opinions to binary agree/disagree on 140-character statements.

### Decidim (Barcelona)

- **What it is:** Open-source participatory democracy framework built in Ruby on Rails. Originally created for Barcelona City Council, now used by 200+ organizations globally.
- **What it does well:** Comprehensive suite of participatory spaces: processes, assemblies, initiatives, consultations. Strong participatory budgeting module. Excellent governance structure (the "Metadecidim" community practices what it preaches). Recently redesigned UI (v0.28). Strong in continental European civic culture.
- **What it misses:** Designed for structured, institutional participation -- proposals, amendments, votes. Not built for unstructured listening or field research. No audio/voice capture. No AI-driven issue surfacing. Assumes participants understand formal democratic processes. Heavy implementation overhead (requires technical capacity to deploy and maintain).
- **How Beat is different:** Decidim digitizes formal democratic processes. Beat captures informal democratic reality -- what people actually say in their own words before anyone has framed a proposal. Beat is reconnaissance; Decidim is parliament.

### CitizenLab (Go Vocal)

- **What it is:** SaaS community engagement platform for local governments. 300+ public sector organizations across 18+ countries. Recently rebranded to "Go Vocal."
- **What it does well:** Polished product with good UX. NLP and ML for analyzing community input, keyword mapping, sentiment analysis. Participatory budgeting. Strong commercial traction with local authorities. Has AI features for clustering open-ended text input.
- **What it misses:** Still fundamentally a survey/consultation replacement -- asks people to come to a platform and type responses. No field research capability. No audio capture. No geographic intelligence about an area before engagement begins. Expensive enterprise pricing locks key features behind Business plans.
- **How Beat is different:** CitizenLab analyzes what people type into forms. Beat captures what people say in conversation on the street. CitizenLab requires the council to set up a consultation; Beat enables a researcher to walk into any area and start listening immediately.

### Granicus / EngagementHQ (formerly Bang the Table)

- **What it is:** The market incumbent. Granicus acquired Bang the Table (EngagementHQ) and OpenCities in 2021, creating the dominant civic engagement SaaS platform. 850+ organizations, 17M+ participants.
- **What it does well:** Scale and market dominance. Comprehensive engagement toolkit: surveys, polls, Q&A, guestbook, stories, places, ideas, forums. Strong integration with existing government communications infrastructure. Recent AI adoption push (per their 2026 Trends report). Massive dataset of civic engagement patterns.
- **What it misses:** The Granicus playbook is "put a widget on the council website." It's consultation theatre -- the voices you capture are the voices of people who already engage with council websites, which is a tiny, unrepresentative slice. No field component whatsoever. No intelligence about an area before you start. Their 2026 report notes 61% of governments are not using AI in engagement at all.
- **How Beat is different:** Granicus is infrastructure for institutional consultation. Beat is a tool for ground-truth discovery. Granicus asks "what do you think about our plan?" Beat asks "what's actually happening here?"

### Consul Democracy (Madrid)

- **What it is:** Open-source citizen participation platform, originally built by Madrid City Council in 2015. ~250 implementations worldwide. Ranked #2 on People Powered's 2025 platform ratings.
- **What it does well:** Proven at city scale (Madrid uses it for participatory budgeting of EUR 100M annually). Strong collaborative legislation feature. Now developing an AI Civic Assistant powered by LLMs (funded by Google Impact Fund). Free and open-source.
- **What it misses:** Same fundamental limitation as Decidim -- it's a platform for structured participation by digitally literate citizens. The people who most need to be heard (elderly, digitally excluded, non-native speakers, time-poor workers) are structurally excluded. No field research capability.
- **How Beat is different:** Beat is designed for the voices that Consul will never capture. The researcher goes to them; they don't have to come to a platform.

### Your Priorities (Citizens Foundation, Iceland)

- **What it is:** Open-source idea generation and deliberation platform. Rated #1 on People Powered 2025 platform ratings. Used in 45 countries by 2M+ people since 2008.
- **What it does well:** Technically impressive -- AI similarities engine, clustering, recommendations, automatic speech-to-text in 200 languages, toxicity detection. Custom emoji ratings. Strong accessibility focus. Built-in analytics.
- **What it misses:** Despite its speech-to-text capability, it's fundamentally a digital platform for online deliberation. The audio processing is for user-submitted content, not field-captured interviews. No geographic intelligence, no area briefings, no connection between what people say and what policy structures exist.
- **How Beat is different:** Your Priorities has some overlapping technical capabilities (transcription, AI analysis) but applies them to online deliberation. Beat applies them to field intelligence -- understanding a place and its people before any formal engagement process begins.

### Loomio (New Zealand)

- **What it is:** Cooperative decision-making tool. Open-source, worker-owned cooperative since 2012. Supports multiple voting methods (ranked choice, dot voting, score voting, etc.).
- **What it does well:** Excellent decision-making UX. Multiple voting/polling methods. Good for established groups that need to make decisions together. Affordable (low one-time payment for community groups). 30+ language support with inline translation. Searchable decision archive.
- **What it misses:** Designed for groups that already exist and already agree they need to make a decision together. Not a discovery or listening tool. No field component. No geographic awareness. No policy connection.
- **How Beat is different:** Loomio helps groups decide. Beat helps researchers discover what groups need to decide about.

### All Our Ideas (Princeton)

- **What it is:** Pairwise wiki survey platform from Princeton sociology department. Participants see two options, pick one; new options can be suggested. ~6,000 surveys created, 7M responses to date. Recently integrated GPT-4.
- **What it does well:** Elegant simplicity. The pairwise comparison approach avoids survey fatigue and generates robust preference rankings from minimal cognitive load per interaction. Open-source. Academically rigorous (published in PLOS One). Used by AARP, OECD.
- **What it misses:** Still a structured survey -- someone has to define the initial option set. No unstructured listening. No field component. No geographic awareness. No policy connection. Limited to preference ranking, cannot capture narrative or testimony.
- **How Beat is different:** All Our Ideas ranks pre-defined options. Beat discovers what the options should be in the first place, from the words people actually use.

---

## 2. Adjacent Tools: Partial Overlap

### Transcription & Audio Processing

| Tool | What it does | Overlap with Beat | Gap |
|------|-------------|-------------------|-----|
| **Otter.ai** | Meeting transcription with AI summaries, action items. Pro: $8.33/mo (annual). Business: $20/mo. | Beat also transcribes speech to text. | Otter is designed for meetings, not field interviews. No issue extraction, no geographic context, no policy connection. |
| **Rev** | Professional and AI transcription services. High accuracy. | Transcription quality. | Pure transcription service. No analysis layer. |
| **OpenAI Whisper** | Open-source speech recognition model. State-of-the-art accuracy across languages. | Beat likely uses Whisper or similar for transcription. | Raw capability, not a product. No analysis, no workflow, no civic domain knowledge. |

**Key insight:** Transcription is a commodity input. Beat's value is not in transcription -- it's in what happens after transcription: issue extraction, geographic grounding, cross-voice synthesis, policy connection.

### Qualitative Research & Analysis

| Tool | What it does | Overlap with Beat | Gap |
|------|-------------|-------------------|-----|
| **Dovetail** | AI-first insights hub. Auto-imports calls, tickets, surveys. Tagging, theming, clustering. Integrates with Gong, Salesforce, Zoom. Enterprise pricing. | Both analyze qualitative data (interviews, transcripts) and surface themes. | Dovetail is a UX research tool for product teams, not a civic intelligence tool. No geographic awareness, no policy layer, no field recording, no area briefing. Expensive. |
| **Condens** | Qualitative research analysis with AI tagging, transcription, affinity mapping, whiteboard synthesis. | Tagging, clustering, synthesis of qualitative data. | Same gap as Dovetail -- built for UX/product research, not civic field intelligence. No concept of "area" or "policy." |

**Key insight:** Dovetail and Condens prove the market for AI-powered qualitative analysis. But they serve product teams analysing customer interviews. Beat serves researchers and policymakers analysing community testimony. The analytical techniques overlap; the domain, workflow, and output are entirely different.

### Surveys (What Beat Replaces)

| Tool | What it does | Why Beat is better |
|------|-------------|-------------------|
| **SurveyMonkey** | Online surveys with templates and basic analytics. | Surveys impose the researcher's framing. Beat captures what people actually want to talk about. Surveys exclude non-digital populations. Beat goes to them. |
| **Typeform** | Beautiful online forms with conversational UX. | Same fundamental limitation -- still a form that requires the respondent to come to a screen and respond within a predetermined structure. |

**Key insight:** Surveys are the default tool for "community engagement" and they are structurally biased toward the digitally literate, the already-engaged, and the researcher's prior assumptions about what matters. Beat is the post-survey paradigm.

### Research Recruitment

| Tool | What it does | Relationship to Beat |
|------|-------------|---------------------|
| **Prolific** | Participant recruitment platform. 200K+ verified participants globally. 300+ screening filters. $16.99 platform fee (33% academic, 43% corporate). | Prolific recruits representative online samples. Beat finds unrecruited voices in the field. Complementary, not competitive -- Prolific could be a distribution channel for follow-up research that Beat surfaces. |
| **UserTesting** | Recorded user sessions with recruitment. | Product testing, not civic research. No overlap. |

### Location Technology

| Tool | What it does | Relationship to Beat |
|------|-------------|---------------------|
| **What3Words** | 3-word location identifiers. 100+ UK councils now using it. AI voice integration for location tasks (2025). | Potential integration partner rather than competitor. What3Words solves precise location communication; Beat could use it for pinpointing where voices were captured. Over 85% of UK emergency services use it. |

---

## 3. Policy Intelligence Tools

### TheyWorkForYou / mySociety Suite

- **What it is:** Free parliamentary monitoring. TheyWorkForYou tracks what MPs say and how they vote. Also: WhatDoTheyKnow (FOI), FixMyStreet (issue reporting). New in 2025: TheyWorkForYou Votes (voting record analysis by government tenure since 1997), redesigned alert system.
- **Overlap with Beat:** Both connect citizens to democratic structures. Beat's policy tab and TheyWorkForYou's MP tracking serve adjacent needs.
- **Gap:** TheyWorkForYou watches parliament from the outside. It does not connect parliamentary activity to what's happening on the ground in specific areas. No field research, no voice capture, no issue surfacing.
- **Opportunity:** mySociety's data (MP positions, voting records, FOI responses) could be a rich input for Beat's area briefings and policy proposals.

### PolicyMogul

- **What it is:** UK political monitoring and stakeholder mapping platform. Real-time tracking of parliament, government, policymakers. Subscriptions from GBP 395/month. Free tier for parliamentarians.
- **Overlap with Beat:** Both care about the policy landscape. PolicyMogul maps stakeholders and tracks policy developments.
- **Gap:** PolicyMogul is a Westminster-watching tool for public affairs professionals. It tracks what policymakers do. It has no mechanism for understanding what communities need. Top-down intelligence only.
- **Opportunity:** PolicyMogul's stakeholder data could enrich Beat's understanding of who governs an area and what policy levers exist.

### Institute for Government Trackers

- **What it is:** Data-driven analysis of government performance. Flagship: Public Services Performance Tracker (250+ indicators across 9 services). Published in partnership with the Nuffield Foundation. New in 2025: regional performance variation analysis.
- **Overlap with Beat:** Both assess how well public services work in specific areas.
- **Gap:** The IfG trackers are macro-level, quantitative, and retrospective. They can tell you that criminal courts in the North East are slower than in London. They cannot tell you what the person outside the court says about their experience waiting 18 months for a hearing.
- **Opportunity:** IfG data could feed Beat's area briefings -- quantitative context for qualitative field intelligence.

### Full Fact

- **What it is:** UK's independent fact-checking charity. AI tools used by 40+ fact-checking organizations in 30+ countries. Developing harm-scoring framework for prioritizing fact-checks. Expanding to US ahead of 2026 midterms.
- **Overlap with Beat:** Both care about the accuracy of public discourse.
- **Gap:** Full Fact checks claims in public debate. It does not surface what communities are actually experiencing. Reactive (responds to claims) rather than proactive (discovers issues).
- **Relationship:** Full Fact's methodology for assessing claims could be useful for validating issues Beat surfaces. Complementary rather than competitive.

---

## 4. The Gap Beat Fills

### What nobody else does

Every tool in this landscape falls into one of these categories:

1. **Digital participation platforms** (Decidim, Consul, Your Priorities, CitizenLab, Granicus) -- they assume people will come to a screen and participate in a structured process. They systematically exclude the digitally disengaged, the time-poor, the distrustful, and the populations most affected by policy failures.

2. **Analysis tools** (Dovetail, Condens) -- they process qualitative data well but serve product teams, not civic researchers. They have no concept of "area," "policy," or "democratic structure."

3. **Transcription services** (Otter, Whisper) -- they turn speech to text but add no civic intelligence. Commodity input.

4. **Policy intelligence** (PolicyMogul, TheyWorkForYou, IfG) -- they watch institutions from the outside but have no mechanism for hearing from the ground.

5. **Survey tools** (SurveyMonkey, Typeform) -- they impose the researcher's frame and exclude non-digital populations.

### Beat's unique position

Beat is the only tool that connects these layers:

```
Street-level voices  -->  Issue surfacing  -->  Area intelligence  -->  Policy connection
     (Record)            (AI analysis)         (Briefing + Map)       (Policy tab)
```

No other tool in this landscape:

- **Starts with the place, not the platform.** Beat's workflow begins with "which area do you want to understand?" -- not "create a consultation" or "design a survey."
- **Goes to the voices rather than waiting for them to come.** The recording tool is designed for field use, capturing spoken testimony from people who would never fill in a form or visit a council website.
- **Surfaces issues from unstructured speech.** Rather than asking people to respond to predetermined questions, Beat discovers what matters from what people actually say.
- **Connects ground truth to governing structures.** The area briefing, issue mapping, and policy proposal features connect what's heard on the street to who has the power to act on it.
- **Works at the hyper-local level.** The unit of analysis is a neighbourhood (Shadwell, Brixton, Moss Side), not a city or a nation.

### The fundamental insight

The civic technology field has spent a decade building better ways to consult. The problem is not consultation -- it's listening. The people who most need to be heard are the people least likely to participate in any form of structured consultation, digital or otherwise.

Beat is not a better consultation tool. It is a listening tool that makes consultation unnecessary -- or, at minimum, makes consultation informed by ground truth rather than guesswork.

### Market positioning matrix

| | Captures unstructured voice | Geographic intelligence | AI issue surfacing | Policy connection | Field-first workflow |
|-|:-:|:-:|:-:|:-:|:-:|
| **Beat** | Yes | Yes | Yes | Yes | Yes |
| Pol.is | No | No | Partial (clustering) | No | No |
| Decidim | No | No | No | Partial | No |
| CitizenLab | No | No | Yes | No | No |
| Granicus | No | No | Partial | No | No |
| Consul | No | No | No | Partial | No |
| Your Priorities | Partial | No | Yes | No | No |
| Loomio | No | No | No | No | No |
| Dovetail | No | No | Yes | No | No |
| PolicyMogul | No | No | No | Yes | No |
| TheyWorkForYou | No | No | No | Yes | No |

No other product fills more than two of these five columns. Beat fills all five.

---

## 5. Potential Partners vs. Competitors

**Integration opportunities (not competitors):**
- **What3Words** -- precise location tagging for field-captured voices
- **Prolific** -- follow-up recruitment based on Beat-surfaced issues
- **mySociety data** -- MP/councillor information for area briefings
- **IfG trackers** -- quantitative context for qualitative field findings
- **OpenAI Whisper** -- transcription engine (likely already in use or similar)

**Watch closely:**
- **CitizenLab / Go Vocal** -- most likely incumbent to attempt field-capture features; has AI capability and government relationships
- **Your Priorities** -- technically closest to Beat's analytical capabilities; if they added a field workflow, they would be a direct competitor
- **Consul Democracy's AI Civic Assistant** -- Google-funded LLM integration could move toward issue surfacing, though currently focused on structured participation

**Not a threat:**
- **Granicus** -- too large, too institutional, too committed to the consultation model to pivot to field intelligence
- **Loomio / All Our Ideas** -- solving different problems (group decisions, preference ranking)
- **Dovetail / Condens** -- serving product teams, unlikely to enter civic space
