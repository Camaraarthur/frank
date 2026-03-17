# Deep UX Research for Frank

**Date:** 17 March 2026
**Purpose:** Evidence-based UX decisions for frank.community -- a civic listening platform where communities record what matters, surface patterns, and push for change.

---

## 1. Tabs vs Single Scroll for Civic Data Dashboards

### The Short Answer: Neither -- Use a Hybrid

Pure tabs hide information behind clicks and break the sense of narrative flow. Pure single-scroll pages become overwhelming with civic data (housing stats, interview themes, policy proposals). The evidence points to a **scrollable page with sticky section navigation** -- what we might call a "scrollytelling dashboard."

### What the Research Says

**Nielsen Norman Group on tabs** ([source](https://www.nngroup.com/articles/tabs-used-right/)): Tabs work best when (a) there are 2-5 categories needing equal visual prominence, (b) content can be summarised in 1-2 word labels, and (c) users do NOT need to compare information across tabs. The critical finding: "tabs require users to repeatedly switch between tabs to compare or reference information. A tab-based design taxes users' short-term memory, increases cognitive load and interaction cost, and lowers usability compared to a design that puts everything on one big page."

For Frank, users absolutely need to connect interview themes to data to proposals. Tabs would fracture that connection.

**UK Government Analysis Function** ([source](https://analysisfunction.civilservice.gov.uk/policy-store/top-tips-for-designing-dashboards/)): "Simple designs are best. Avoid too much scrolling, especially horizontal scrolling." They recommend limiting colour choices to four and using direct labels. Two-thirds of ONS website users view content on mobile, so dashboards must be tested on phones and tablets.

**USAFacts** ([source](https://www.artefactgroup.com/case-studies/usafacts/)): Their information architecture follows a drill-down model -- visitors explore data at the highest level (overall revenue and spending), then dive deeper into specific subject areas. Each visualization includes a source button for verification. They deliberately avoid editorialising, letting users draw their own conclusions.

**Our World in Data**: Uses long-scroll articles with embedded interactive charts. Each page tells a data story that unfolds as you scroll. Charts are interspersed with explanatory text. This "scrollytelling" approach has made them one of the most trusted data sources globally.

**Gapminder**: Uses interactive bubble charts with animation as the primary exploration tool, plus downloadable datasets. The key insight is that their visualizations are *opinionated* -- they guide you to a conclusion through the data itself.

### Progressive Disclosure: The Right Pattern for Frank

Progressive disclosure reduces cognitive load by revealing complexity gradually ([source](https://www.nngroup.com/articles/progressive-disclosure/)). Jakob Nielsen found it improves three of usability's five components: learnability, efficiency of use, and error rate.

**How this applies to Frank's area page:**

- **Level 1 (visible on load):** Area summary card -- population, top 3 themes from interviews, sentiment indicator, "X voices recorded" count
- **Level 2 (expand or scroll):** Detailed data breakdowns -- housing stats, deprivation indices, interview excerpts grouped by theme
- **Level 3 (click to explore):** Full interview transcripts, raw data tables, methodology notes, data sources

### Mobile vs Desktop Considerations

On mobile, tabs become horizontally scrollable pill buttons that are easy to miss. A sticky section nav with anchor links works better because:

- The nav sits in the thumb zone -- the most comfortable region for one-handed phone use ([source](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/))
- Users can see what sections exist without tapping
- Scrolling is more natural than tapping on mobile -- "scrolling has a bigger sensory appeal than tapping"

**Important caveat from accessibility research:** Sticky menus can break when users zoom in, block content for keyboard users, and obscure focusable elements. The sticky nav must be thin (40-48px), have a clear collapse mechanism, and use `scroll-padding` CSS to prevent anchored sections from hiding behind it.

### Recommendation for Frank

**Structure: Scrollable page with sticky mini-nav**

```
+------------------------------------------+
| [frank.community/beckton]                |
| ---------------------------------------- |
| STICKY NAV: Overview | Voices | Data |   |
|            Proposals | Record            |
| ---------------------------------------- |
|                                          |
| OVERVIEW SECTION                         |
| Area summary card (population, key       |
| stats, top themes, voice count)          |
| Mini-map showing interview locations     |
|                                          |
| VOICES SECTION                           |
| Theme cards (expandable)                 |
|   "Housing" - 23 mentions               |
|   "Safety" - 18 mentions                |
|   > Click to expand: excerpts, quotes   |
|                                          |
| DATA SECTION                             |
| Key metrics with sparklines              |
| Expandable detail panels                 |
|                                          |
| PROPOSALS SECTION                        |
| Community-generated proposals            |
| Linked to relevant voice themes          |
|                                          |
| RECORD SECTION                           |
| CTA: "Add your voice to Beckton"        |
| [Big mic button]                         |
+------------------------------------------+
```

---

## 2. The Recording/Mic Page UX

### What Field Recording Apps Do Well

**Otter.ai** ([source](https://otter.ai/)): Blue microphone icon in the lower corner. Tap to start, tap to stop. Real-time transcription appears as you speak, with the current word highlighted. You can pause and resume. The conversation is titled "Note" by default and can be renamed during or after recording. The key UX lesson: **the recording state is always visible** -- you never wonder "am I recording?"

**Apple Voice Memos**: A single, obvious red record button at the bottom of the screen. Waveform visualization shows audio is being captured. Timer counts up. Minimal UI -- nothing competes with the core action.

**Hindenburg Field Recorder** ([source](https://apps.apple.com/us/app/hindenburg-field-recorder/id346169165)): Designed for radio journalists. Works offline, stores locally. Noise reduction handles ambient sound. The key insight: **field recording apps must work without internet** and handle noisy environments gracefully.

### The Minimum Viable Recording UX

Based on the research, the irreducible elements are:

1. **Big mic button** (prominent, thumb-reachable, unmistakable)
2. **Recording state indicator** (pulsing red dot + timer counting up)
3. **Waveform or audio level meter** (confirms the mic is picking up sound)
4. **Pause/Resume** (for interruptions -- someone walks by, phone rings)
5. **Stop and Save** (single tap to end, auto-saves immediately)

Everything else is secondary and should not clutter the recording screen.

### Suggested Questions: Float Above the Mic Button?

This is the right instinct but needs careful execution. The questions serve as prompts for the interviewer, not as rigid scripts.

**Recommendation: Collapsible question prompt area above the mic**

```
+------------------------------------------+
|                                          |
| BECKTON - Field Recording                |
|                                          |
| +--------------------------------------+ |
| | SUGGESTED PROMPTS          [collapse]| |
| | "What's changed most in Beckton?"    | |
| | "What do you wish the council knew?" | |
| | "What works well here?"              | |
| +--------------------------------------+ |
|                                          |
|            [  WAVEFORM  ]                |
|             02:34 recording              |
|                                          |
|         [ PAUSE ]  [ STOP ]             |
|                                          |
+------------------------------------------+
```

The prompts should:
- Be visible before recording starts (planning phase)
- Collapse to a thin bar once recording begins (so the focus shifts to the conversation)
- Be expandable during recording with one tap (if the interviewer needs a prompt mid-conversation)
- NOT be swipeable cards (see below)

### Swipeable Question Cards: Not the Right Pattern Here

The Tinder swipe pattern is well-researched ([source](https://builtin.com/articles/tinder-swipe-design)). It works because:

- It leverages variable reward schedules (dopamine from unpredictable matches)
- The gesture is fast and subconscious -- "actions can almost occur faster than we have a chance to reflect"
- It is a natural, primitive gesture -- even 17-day-old babies make swiping motions

**But swiping is wrong for interview prompts because:**

1. **Swiping encourages rapid consumption, not reflection.** Interview questions need to be considered, not flicked through. Research from Penn State found swiping creates engagement but at the cost of depth -- users become "hooked on the action" without absorbing content.
2. **The "tyranny of choice" problem.** Too many swipeable cards becomes overwhelming and makes decision-making burdensome.
3. **It implies binary judgment (yes/no, like/dislike).** Interview prompts are not things to accept or reject -- they are starting points for conversation.
4. **During a live interview, you cannot be swiping your phone.** The interviewer needs to glance at a prompt, not interact with cards.

**Better pattern:** A simple scrollable list of 3-5 prompts, visible at a glance, collapsible during recording. Think "notecard on the table" not "deck of cards to sort through."

### GPS Gating: Approach with Extreme Caution

**The research on geofencing accuracy** ([source](https://pmc.ncbi.nlm.nih.gov/articles/PMC11362315/)):

- Enter event notifications averaged **87 metres** from the geofence centre
- Exit event notifications averaged **234 metres** away
- True sensitivity was only **70% for enter events** on iOS, worse on Android
- Forest/urban canyon environments significantly reduced accuracy
- 10-metre radius geofences are unreliable; 50-100 metre radii work better

**Privacy concerns are significant:**
- Location tracking creates detailed profiles that can reveal sensitive information about lifestyles
- Geofencing surveys attract a specific demographic comfortable with technology, creating selection bias
- GPS spoofing is trivial -- all tested geofencing apps were vulnerable to third-party GPS spoofing tools
- Low-income and ethnically diverse communities already underuse civic platforms (FixMyStreet Brussels found significant socio-demographic inequality in 30,041 reports)

**Recommendation: Do NOT require GPS. Use it as optional enrichment.**

- **Ask, don't demand:** "Would you like to tag this recording with your current location? This helps us map voices to areas." (Opt-in, not gating.)
- **Accept manual area selection:** Let users choose "Beckton" from a list or type a postcode. Trust them.
- **If GPS is shared, use it lightly:** Show approximate area (ward level), never exact coordinates. Store coarsened location only.
- **The alternative to GPS gating:** Use the URL itself as the area indicator. If someone is on `frank.community/beckton` and records, tag it as Beckton. Simple.

The philosophical issue: requiring GPS to "prove" you are in an area sends a message of distrust. Frank should be about *inviting* voices, not *verifying* them. A resident who records from their sofa about their neighbourhood is just as valid as someone recording on the high street.

---

## 3. Area Page Structure (frank.community/beckton)

### What Users Should See FIRST

**Research from real estate and neighbourhood platforms:**

**Zillow** ([source](https://www.protopie.io/blog/zillow-design-real-state-future-with-protopie)): Map-first design. "Before users care about finishes or square footage, they care about *where*." Price-based pins on maps with live-updating filters create immediate spatial understanding.

**Nextdoor** ([source](https://meganhewittux.com/nextdoor-community-builder)): Hyper-local social feed. Users verify addresses to join neighbourhood networks. The primary interface is a news feed of local activity. User frustration comes from content that is not within their immediate neighbourhood.

**StreetCheck (UK)**: Provides area profiles with crime stats, demographics, school ratings, and house prices. The structure is: summary header with key stats, then expandable sections for each data category.

### What Frank's Area Page Should Prioritise

The first screen (above the fold) must answer: **"What is this place, and what are people saying about it?"**

Not raw data. Not charts. Human signal first, data second.

```
+------------------------------------------+
| BECKTON                                  |
| Newham, East London                      |
| [Mini map]                               |
|                                          |
| "47 voices recorded"                     |
| "Last recording: 2 days ago"            |
|                                          |
| TOP THEMES                               |
| +--------------------------------------+ |
| | Housing        ████████████  23      | |
| | Safety         ████████     18       | |
| | Transport      ██████       14       | |
| +--------------------------------------+ |
|                                          |
| LATEST VOICE                             |
| "The new builds look nice but nobody     |
|  from round here can afford them..."     |
|  -- Recorded 2 days ago, DLR station    |
|                                          |
| [Add Your Voice]  [See All Voices]       |
|                                          |
| --- scroll for more ---                  |
+------------------------------------------+
```

### Information Hierarchy (Scroll Order)

1. **Area identity** (name, location, mini-map) -- orients the user
2. **Voice count + recency** -- signals this is alive, not a dead page
3. **Top themes from interviews** -- the human signal, not government data
4. **Featured voice excerpt** -- a real quote that draws you in
5. **Call to action** -- "Add your voice" appears early, not buried at the bottom
6. **Data section** -- census stats, deprivation index, housing data (expandable)
7. **Proposals section** -- community-generated ideas linked to voice themes
8. **Full voices section** -- all recordings, filterable by theme
9. **Recording CTA (repeated)** -- second chance to contribute after seeing the full picture

### What Invites Participation vs What Feels Read-Only

**Read-only signals (avoid):**
- Dense tables of statistics with no context
- Government-style language ("indices of multiple deprivation")
- No visible human contribution (just data, no voices)
- No clear action the user can take
- Passive language ("this area has..." rather than "residents say...")

**Participation signals (use):**
- Real quotes from real people (even anonymised)
- A visible count of contributors that grows ("47 voices and counting")
- Clear, prominent recording CTA that appears multiple times
- Language that addresses the user directly ("What would you tell the council?")
- Showing that voices lead to outcomes ("This theme was raised with Newham Council on [date]")

### Making Data Actionable

Harvard's Ash Center research on civic data ([source](https://ash.harvard.edu/resources/a-framework-for-digital-civic-infrastructure/)) found that governments respond to suggestions perceived as actionable. The "Beyond Transparency" book ([source](https://beyondtransparency.org/part-3/making-a-habit-out-of-engagement-how-the-culture-of-open-data-is-reframing-civic-life/)) found that open data produces good civic habits when it helps people "visualize and augment the world around them so as to make better, more informed decisions."

**Design principle for Frank:** Every data point should answer "so what?" Connect statistics to voice themes. If housing costs are up 40%, show that next to the interview theme card about housing affordability. Data without human context is inert. Data alongside lived experience becomes evidence.

---

## 4. The "Come Back and Contribute" Loop

### What the Research Shows About Civic Platform Retention

**FixMyStreet** ([source](https://www.tandfonline.com/doi/abs/10.1080/10630732.2016.1270047)): The ability to "be heard and actively shape urban spaces" provides strong intrinsic motivation. But the platform reveals significant engagement gaps -- low-income and ethnically diverse communities are systematically underrepresented.

**Boston Citizens Connect** ([source](https://beyondtransparency.org/part-3/making-a-habit-out-of-engagement-how-the-culture-of-open-data-is-reframing-civic-life/)): 38% of users never checked others' reports. Only 9% consistently engaged with map visualisations. The critical finding: "mere design availability doesn't guarantee adoption." The solution is not adding features -- it is redesigning interaction to make reflection necessary rather than optional.

**OpenStreetMap**: Retains contributors through visible impact (your edit appears on a map used by millions), community events (mapping parties), and social recognition. The key is that contribution has *immediate visible effect*.

### What Makes Civic Participation Habit-Forming Without Being Manipulative

The distinction is between **intrinsic motivation** (I contribute because I see impact and feel ownership) and **extrinsic manipulation** (dark patterns, FOMO, artificial urgency).

**Ethical engagement strategies for Frank:**

1. **Show impact, not just activity.** "Your recording about housing in Beckton was grouped with 22 similar voices. This theme has been included in the community brief sent to Newham Council." This is not manipulation -- it is genuine feedback about genuine impact.

2. **Social proof through community presence.** "12 new voices were recorded in Beckton this week." This normalises participation without creating FOMO. The framing is "your community is active" not "you're missing out."

3. **Periodic digests, not push notifications.** Research on community platforms ([source](https://bettermode.com/blog/how-bettermode-notification-tools-boost-member-retention)) shows that daily digest emails delivered based on the user's time zone, covering content based on their interests, bring members back effectively. For Frank:
   - Weekly email: "This week in Beckton: 8 new voices, 'transport' is the rising theme, your recording was listened to 14 times"
   - Monthly area brief: "Beckton Community Brief -- March 2026" summarising all voice themes with data context
   - NOT: "You haven't recorded in 3 weeks!" (guilt-based re-engagement)

4. **Contribution streaks and milestones (used gently).** "You've contributed 5 recordings to Beckton. You're one of 12 regular voices." This creates identity ("I'm a regular voice") without gamification pressure. No leaderboards. No points.

5. **The "StreetCred" model** from Boston: Badges, campaigns, and location-based rewards frame reporting within community goals, converting participation metrics into visible social standing. For Frank, this could mean: "Beckton Voice" badge after 3 recordings, "First Voice" badge for recording in an area with no previous recordings.

### The Re-engagement Funnel

```
Visit frank.community/beckton (first time)
  --> See voices, data, themes
  --> Optionally record (low barrier: no signup required)
  --> Optionally leave email for updates

1 week later: Email digest
  "3 new voices in Beckton this week. Housing remains #1 theme."
  [Listen to latest voice] [Add yours]

1 month later: Area brief
  "Beckton Community Brief: 47 voices, 5 themes, sent to
   Newham Council planning committee"
  [Read the brief] [Record a response]

Ongoing: Area page always shows fresh content
  Latest voice timestamp visible
  Theme trends update weekly
  "Beckton needs more voices on [transport]" -- targeted gaps
```

---

## 5. How People Will FEEL Using Each Page

### Landing Page (Search): frank.community

**Likely emotions:** Curiosity mixed with uncertainty. "What is this? What am I supposed to do?"

**Negative emotion to design against:** Confusion. If the landing page looks like a government site or a data portal, users will bounce. If it looks like social media, they will not take it seriously.

**Design choices to amplify positive emotions:**

- **Clarity over cleverness.** One sentence: "Find out what your community is saying. Add your voice." No jargon, no mission statements.
- **Search bar as the primary action.** Like Google -- one input, one action. "Enter your area, postcode, or neighbourhood." The simplicity communicates: this is easy, this is for you.
- **Social proof below the search.** "1,247 voices recorded across 23 areas." Signals legitimacy without overwhelming.
- **Warm, human imagery.** Not stock photos. Not data visualisations. If possible, illustrated figures or real community photography.
- **Emotional tone:** Calm confidence. "This exists. It works. You can use it."

**Wireframe:**
```
+------------------------------------------+
|                                          |
|         frank                            |
|         community voices that matter     |
|                                          |
|  +------------------------------------+  |
|  | Search your area or postcode...    |  |
|  +------------------------------------+  |
|                                          |
|  1,247 voices across 23 areas            |
|                                          |
|  ACTIVE AREAS:                           |
|  [Beckton] [Barking] [Custom House]      |
|                                          |
+------------------------------------------+
```

### Area Page (Data): frank.community/beckton

**Likely emotions:** Potentially overwhelmed by data. Potentially impressed. Potentially sceptical ("who collected this? is it real?").

**Negative emotion to design against:** Overwhelm. Civic data dashboards routinely fail because they present too much information with too little context. The UK Government Analysis Function warns against this explicitly.

**Design choices:**

- **Lead with human signal, not statistics.** The first thing users see should be a quote from a real interview, not a deprivation index score. This grounds the data in lived experience.
- **Use progressive disclosure aggressively.** Show 3 key stats, not 30. Expand for more. This matches USAFacts' drill-down model.
- **Contextualise every number.** Not "IMD Score: 7.2" but "Beckton ranks in the 15% most deprived areas in England." Not "median income: GBP 28,400" but "Household income here is 23% below the London average."
- **Source transparency.** Like USAFacts, every data point should cite its source. This builds trust with sceptical users.
- **Emotional tone:** Informed empowerment. "Now you know. Now you can speak."

### Recording Page: frank.community/beckton/record

**Likely emotions:** Nervousness. Self-consciousness. "What if I say the wrong thing?" "Is my voice good enough?" "Who will hear this?"

This is the most emotionally charged page. Research on emotional UX design ([source](https://ixdf.org/literature/topics/emotional-design)) identifies that the new-user journey involves "initial curiosity, a bit of anxiety during account creation, maybe frustration if something is confusing, followed by relief when it works and hopefully a sense of accomplishment upon first success."

**Negative emotions to design against:** Performance anxiety. Uncertainty about what to say. Privacy fear.

**Design choices:**

- **Reassurance before the mic button.** "There are no wrong answers. Just say what matters to you about Beckton." This is more important than any UI element.
- **Privacy statement visible.** "Your recording is anonymous. We never share your identity." One line, always visible, not buried in terms.
- **Suggested prompts reduce blank-page anxiety.** "What's changed most here?" gives people a starting point without dictating what they say.
- **The mic button should feel inviting, not clinical.** Large, warm colour (not red -- red signals danger/stop), with a gentle pulsing animation when idle that says "I'm ready when you are."
- **Post-recording affirmation.** "Thank you. Your voice has been added to Beckton. 48 voices and counting." Immediate positive feedback. The feeling of contribution.
- **Emotional tone:** Gentle encouragement. "Your experience matters. We're listening."

**Wireframe:**
```
+------------------------------------------+
|                                          |
| RECORD YOUR VOICE                        |
| Beckton, Newham                          |
|                                          |
| There are no wrong answers.              |
| Say what matters to you about this area. |
|                                          |
| PROMPTS (optional):                      |
| - What's changed most here?              |
| - What do you wish the council knew?     |
| - What works well in this area?          |
|                                          |
|                                          |
|              (  MIC  )                   |
|           Tap to start recording         |
|                                          |
| Your recording is anonymous.             |
| We never share your identity.            |
|                                          |
+------------------------------------------+
```

### Results/Community Brief Page

**Likely emotions:** Satisfaction if their voice appears. Scepticism about whether anyone in power will actually see this. Desire to share if the brief validates their experience.

**Negative emotion to design against:** Futility. "I contributed but nothing will happen."

**Design choices:**

- **Show the chain of impact.** "47 voices --> 5 themes identified --> Community brief generated --> Sent to Newham Council planning committee on [date]." The user needs to see that their voice entered a process, not a void.
- **Make sharing effortless.** "Share the Beckton brief" with pre-written social text. People share things that validate their experience.
- **Acknowledge contributors.** "This brief was built from 47 anonymous voices including yours." (If they contributed.)
- **Next step is always clear.** "The next brief will be generated on [date]. Record more voices to strengthen it."
- **Emotional tone:** Validated agency. "Your voice mattered. Here's the proof."

---

## 6. Accessibility and Inclusion

### Low Digital Literacy Users

Research on designing for elderly and low-literacy users ([source](https://pmc.ncbi.nlm.nih.gov/articles/PMC12350549/)) identifies these essential elements:

- **Simplified navigation** to reduce cognitive strain
- **Enlarged touch targets** (minimum 48x48px, ideally 56x56px for elderly users)
- **Step-by-step instructions** rather than complex multi-action interfaces
- **Contextualised help** accessible at every step
- **Error-tolerant interfaces** that allow recovery from mistakes
- **Avoid jargon** -- no "indices of deprivation," use "how deprived the area is"

**Specific recommendations for Frank:**

1. **The recording page must work for someone who has never used a recording app.** One button. One action. "Tap the circle to start talking. Tap again to stop." Test this with users aged 65+ and non-native English speakers.

2. **Language level.** Write all interface text at a reading age of 11 or below. Use the Hemingway Editor to check. Government language ("indices of multiple deprivation") must be translated into plain English throughout.

3. **Non-English speakers.** Consider: Can the area page display in multiple languages? At minimum, the recording page should work without reading -- the mic button icon and recording animation should be universally understood. The prompts could have audio versions ("Tap to hear this question in Bengali").

4. **Font size.** Minimum 16px body text. All text must be scalable via browser zoom to 400% without horizontal scrolling (WCAG 2.1 requirement). Line height 1.5 minimum.

### Screen Readers

**ARIA best practices** ([source](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)): The first rule of ARIA is "if you can use a native HTML element with the semantics you require already built in, do so." Bad ARIA is worse than no ARIA -- sites with ARIA present averaged 41% more detected errors than those without.

**Specific requirements for Frank:**

1. **Recording button:** Use a native `<button>` element with `aria-label="Start recording your voice"`. When recording, update to `aria-label="Stop recording. Currently recording for 2 minutes 34 seconds."` Use `aria-live="polite"` for the timer.

2. **Theme charts:** Bar charts showing interview themes must have text alternatives. Use `aria-describedby` linking to a hidden data table. Screen reader users should hear "Housing: 23 mentions, Safety: 18 mentions, Transport: 14 mentions."

3. **Area page sections:** Use proper heading hierarchy (h1 for area name, h2 for each section, h3 for subsections). The sticky nav should use `<nav aria-label="Page sections">`.

4. **Audio playback:** All interview recordings must have text transcripts available. Use `<track>` elements for any audio players. Provide a "Read transcript" alternative for every "Listen" button.

### Colour Blindness

Approximately 8% of men and 0.5% of women have some form of colour vision deficiency ([source](https://venngage.com/blog/color-blind-friendly-palette/)). The most common problematic combinations: red/green, green/brown, blue/gray, blue/purple.

**Specific recommendations for Frank's palette:**

1. **Never use colour alone to encode information.** Every coloured element should also have a text label, icon, or pattern. Theme bars should have labels ("Housing: 23") not just coloured bars.

2. **Safe colour combinations:**
   - Blue (#2563EB) and Orange (#EA580C) -- distinguishable by all common types of colour blindness
   - Dark blue (#1E3A5F) and Yellow (#F59E0B) -- high contrast, universally distinguishable
   - Avoid: red/green distinctions for any positive/negative or good/bad encoding

3. **Contrast ratios:** All text must meet WCAG 2.1 AA standards -- 4.5:1 for normal text, 3:1 for large text and non-text elements. Use tools like WebAIM Contrast Checker.

4. **Test with simulators:** Run the entire interface through Coblis (colour blindness simulator) or Color Oracle for all four types: protanopia, deuteranopia, tritanopia, and achromatopsia.

### Mobile-First Design

Most field use will be on phones. This is not a "responsive" afterthought -- mobile is the primary design target.

**Key mobile requirements:**

1. **Touch targets:** 48x48px minimum for all interactive elements. The mic button should be at least 80x80px.

2. **One-handed operation:** Critical actions (record, stop, navigate sections) must be reachable by thumb. Place the mic button in the bottom third of the screen. Place navigation in the thumb zone.

3. **Offline capability:** Field interviews often happen where signal is poor. The recording page must work offline, saving recordings locally and syncing when connectivity returns. This is how Hindenburg Field Recorder works and it is essential for field use.

4. **Bandwidth awareness:** Area pages with data visualisations should lazy-load charts. Provide text-first layouts that work on 3G. Compress images aggressively. Consider a "low bandwidth mode" toggle.

5. **Viewport considerations:** No horizontal scrolling. Sticky nav should be thin (40-48px). Data tables should reformat to card layouts on mobile, not just shrink.

---

## Summary of Key Decisions

| Decision | Recommendation | Confidence |
|----------|---------------|------------|
| Tabs vs scroll for area page | Scrollable page with sticky section nav | High |
| Question cards on recording page | Static collapsible list, NOT swipeable cards | High |
| GPS gating for recordings | Do NOT gate. Optional opt-in location tagging | High |
| Area page first impression | Human voices and themes first, data second | High |
| Retention mechanism | Weekly email digest + monthly community brief | Medium |
| Mobile vs desktop priority | Mobile-first, desktop enhanced | High |
| Progressive disclosure | Yes -- 3-level depth for all data sections | High |
| Recording UX minimum | Big mic + timer + waveform + stop. Nothing else on first release | High |

---

## Sources

- [Tabs, Used Right -- Nielsen Norman Group](https://www.nngroup.com/articles/tabs-used-right/)
- [Progressive Disclosure -- Nielsen Norman Group](https://www.nngroup.com/articles/progressive-disclosure/)
- [USAFacts Case Study -- Artefact](https://www.artefactgroup.com/case-studies/usafacts/)
- [UK Government Analysis Function -- Dashboard Design](https://analysisfunction.civilservice.gov.uk/policy-store/top-tips-for-designing-dashboards/)
- [UK Government Analysis Function -- Dashboard Accessibility](https://analysisfunction.civilservice.gov.uk/policy-store/data-visualisation-testing-dashboards-for-design-and-accessibility/)
- [Designing Sticky Menus -- Smashing Magazine](https://www.smashingmagazine.com/2023/05/sticky-menus-ux-guidelines/)
- [What Makes Swipe Right Compelling -- Built In](https://builtin.com/articles/tinder-swipe-design)
- [Psychology of Swiping -- App Partner Academy](https://medium.com/app-partner-academy/the-psychology-of-swiping-in-apps-464895b2b485)
- [Geofencing in Behavioral Research -- PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC11362315/)
- [FixMyStreet Brussels -- Socio-Demographic Inequality](https://www.tandfonline.com/doi/abs/10.1080/10630732.2016.1270047)
- [Making a Habit Out of Engagement -- Beyond Transparency](https://beyondtransparency.org/part-3/making-a-habit-out-of-engagement-how-the-culture-of-open-data-is-reframing-civic-life/)
- [Framework for Digital Civic Infrastructure -- Harvard Ash Center](https://ash.harvard.edu/resources/a-framework-for-digital-civic-infrastructure/)
- [Emotional Design -- Interaction Design Foundation](https://ixdf.org/literature/topics/emotional-design)
- [Mobile App Design for Older Adults -- PMC](https://pmc.ncbi.nlm.nih.gov/articles/PMC12350549/)
- [ARIA Accessibility -- MDN](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA)
- [Colorblind-Friendly Palettes -- Venngage](https://venngage.com/blog/color-blind-friendly-palette/)
- [Nextdoor UX Case Study -- Megan Hewitt](https://meganhewittux.com/nextdoor-community-builder)
- [Zillow Design -- ProtoPie](https://www.protopie.io/blog/zillow-design-real-state-future-with-protopie)
- [Tabs UX Best Practices -- LogRocket](https://blog.logrocket.com/ux-design/tabs-ux-best-practices/)
- [Otter.ai Recording Guide](https://help.otter.ai/hc/en-us/articles/360048269733-Record-a-conversation)
- [Notification Tools and Retention -- Bettermode](https://bettermode.com/blog/how-bettermode-notification-tools-boost-member-retention)
- [Dashboard UX Principles 2025 -- Medium](https://medium.com/@allclonescript/20-best-dashboard-ui-ux-design-principles-you-need-in-2025-30b661f2f795)
