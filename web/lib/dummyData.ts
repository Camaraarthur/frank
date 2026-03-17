// ============================================================================
// Frank — Shadwell, London demo seed data
// Realistic civic field intelligence data for demo/Mozilla grant purposes
// ============================================================================

import type { AnalysisResult, AreaBriefing, PolicyProposal } from "@/lib/api";

export const SHADWELL_BRIEFING: AreaBriefing = {
  area: "Shadwell, London",
  summary:
    "Shadwell is a dense inner-city neighbourhood in the London Borough of Tower Hamlets (E1/E1W), between Whitechapel and Wapping. It sits at the intersection of historic working-class East End identity and acute gentrification pressure from the adjacent City of London and Canary Wharf. The area has one of the highest population densities in England, a large Bangladeshi-British community (44–49% of residents), and persistent challenges around housing, air quality, and youth safety. Note: Tower Hamlets Council has been under statutory government intervention since November 2024 following a failed Best Value Duty review.",
  governingBodies: [
    {
      level: "Local",
      name: "London Borough of Tower Hamlets",
      representative: "Mayor Lutfur Rahman",
      party: "Aspire",
      keyPolicies: [
        "Housing first strategy — 1,000 new affordable homes target",
        "Community wealth building — local procurement and CLT support",
        "Air Quality Action Plan 2023–2028",
      ],
    },
    {
      level: "Local (Ward)",
      name: "Shadwell Ward — Tower Hamlets Council",
      representative: "Cllr Suluk Ahmed (Lead), Cllr Ahmodur Khan, Cllr Shahina Khatun",
      party: "Aspire",
      keyPolicies: [
        "Watney Market regeneration",
        "Community safety partnership with Met Police",
      ],
    },
    {
      level: "Regional",
      name: "Greater London Authority",
      representative: "Mayor Sadiq Khan; GLA Member Unmesh Desai (City & East)",
      party: "Labour",
      keyPolicies: [
        "Healthy Streets programme",
        "GLA Affordable Homes Programme",
        "ULEZ expansion and air quality targets",
      ],
    },
    {
      level: "National",
      name: "UK Parliament — Bethnal Green and Stepney",
      representative: "Rushanara Ali MP",
      party: "Labour",
      keyPolicies: [
        "Social housing investment advocacy",
        "Renters' Rights Bill",
      ],
    },
  ],
  contestedIssues: [
    {
      title: "Housing overcrowding and affordability",
      description:
        "41% of households in Shadwell are overcrowded vs 8% national average. The social housing waiting list has over 19,000 households across Tower Hamlets. Private rents rose 34% 2019–2024.",
      severity: "high",
      sources: ["Tower Hamlets Housing Strategy 2022", "ONS Census 2021"],
    },
    {
      title: "Air quality along The Highway (A1203)",
      description:
        "NO2 levels along The Highway persistently exceed WHO limits. The road physically severs Shadwell from the Thames, and residents — especially children — report above-average respiratory illness.",
      severity: "high",
      sources: ["DEFRA Air Quality monitoring", "Tower Hamlets Air Quality Action Plan 2023"],
    },
    {
      title: "Youth knife crime and county lines",
      description:
        "Tower Hamlets has above-London-average knife crime rates. Young people describe county lines recruiters as visible from age 12. Youth facilities have been cut significantly since 2010.",
      severity: "high",
      sources: ["Met Police Borough statistics 2024", "Tower Hamlets Youth Strategy"],
    },
    {
      title: "Watney Market decline",
      description:
        "60% of pitches now vacant after decades of decline. The market was the social and commercial heart of the Bangladeshi community — its emptiness is widely seen as a symbol of neighbourhood loss.",
      severity: "medium",
      sources: ["Tower Hamlets Markets Service data", "Resident consultation 2023"],
    },
    {
      title: "Green space deficit",
      description:
        "0.6m² accessible green space per resident vs 27m² London average and 9m² recommended minimum. Heat island effects increasingly severe in summer.",
      severity: "medium",
      sources: ["GLA Open Space Survey", "Tower Hamlets Parks Strategy"],
    },
  ],
  demographics: {
    population: 14200,
    highlights: [
      "55% Bangladeshi-British — one of the highest concentrations in the UK",
      "Median household income £23,400 vs £36,000 London average",
      "42% of children in poverty (after housing costs)",
      "68% of housing stock is social or council-owned",
      "Significant elderly population with limited English, isolated since COVID",
    ],
  },
  suggestedLocations: [
    {
      name: "Watney Market",
      reason: "Long-term traders and Bengali elders — housing, community loss, intergenerational issues surface here",
    },
    {
      name: "Shadwell DLR Station",
      reason: "High footfall — mix of residents and incoming workers, good for gentrification and displacement experiences",
    },
    {
      name: "Shadwell Basin / Glamis Adventure Playground",
      reason: "Families and young people — housing stress, green space, youth safety",
    },
    {
      name: "Cable Street Community Garden",
      reason: "Community activists and long-term residents — political consciousness, history, green space",
    },
    {
      name: "Shadwell Mosque (Maryam Centre)",
      reason: "Bengali community elders — housing, youth safety, elderly isolation, intergenerational issues",
    },
  ],
  interviewThemes: [
    "Housing security and rent affordability",
    "Experiences of displacement or knowing someone who has left",
    "Children's safety and outdoor space",
    "Air quality and health",
    "Connection to the neighbourhood — sense of belonging",
    "Use of public services — what works, what doesn't",
    "Experiences with police and community safety",
  ],
};

export const SHADWELL_ANALYSIS: AnalysisResult = {
  issues: [
    {
      id: "issue-1",
      title: "Housing overcrowding and unaffordable rents",
      description:
        "Multiple families sharing two-bedroom flats is routine in Shadwell. The social housing waiting list has over 19,000 households in Tower Hamlets. Private rents have risen 34% since 2019 while incomes have stagnated, pushing long-term Bengali residents into impossible choices between overcrowding and displacement.",
      compositeScore: 45,
      frequency: 9,
      severity: 5,
      score: {
        severity: 5,
        frequency: 9,
        costToFix: 5,
        timeToResolve: 5,
        complexity: 5,
        isSystemic: true,
        systemicNote:
          "Root cause is national housing policy — Right to Buy depleted social stock, planning policy favours luxury development. Council can mitigate but cannot resolve without central government action.",
      },
      quotes: [
        {
          text: "There are seven of us in a three-bed. My kids share a room with their grandmother. I've been on the waiting list eleven years.",
          speakerDescription: "Bangladeshi mother, 38, Watney Market",
          sessionId: "session-demo-1",
        },
        {
          text: "My landlord wants £1,800 for a one-bed. I've lived here thirty years. Where am I supposed to go?",
          speakerDescription: "Retired dockworker, 67, Cable Street",
          sessionId: "session-demo-2",
        },
        {
          text: "The new builds on the Wapping side are all luxury — none of it is for us. They put a Waitrose in, that told you everything.",
          speakerDescription: "Community organiser, 44, Shadwell Basin",
          sessionId: "session-demo-3",
        },
      ],
      relatedIssues: ["Gentrification displacement", "Youth wellbeing", "Mental health"],
    },
    {
      id: "issue-2",
      title: "Youth knife crime and county lines",
      description:
        "Tower Hamlets has above-London-average knife crime rates. In Shadwell, young people describe county lines recruiters as visible from age 12. The combination of poverty, cuts to youth facilities, and social isolation creates the conditions. Police responses are seen as reactive and criminalising rather than preventative.",
      compositeScore: 30,
      frequency: 6,
      severity: 5,
      score: {
        severity: 5,
        frequency: 6,
        costToFix: 3,
        timeToResolve: 4,
        complexity: 5,
        isSystemic: true,
        systemicNote:
          "County lines is a national organised crime phenomenon. Local interventions can interrupt recruitment pathways and provide alternatives, but cannot address the underlying drug supply chain without national enforcement.",
      },
      quotes: [
        {
          text: "My nephew got stabbed last year. He's okay but he won't go out after dark. He's sixteen.",
          speakerDescription: "Aunt, 40s, Shadwell Basin",
          sessionId: "session-demo-4",
        },
        {
          text: "There's nowhere to go. The youth club closed in the cuts. The park is fine in summer but what about winter?",
          speakerDescription: "Youth worker, 33, Shadwell community centre",
          sessionId: "session-demo-6",
        },
        {
          text: "Police stop and search my son constantly. He's never done anything. It makes him angry, it doesn't make him safe.",
          speakerDescription: "Father, 48, Watney Market",
          sessionId: "session-demo-7",
        },
      ],
      relatedIssues: ["Lack of youth facilities", "Housing stress", "Police relations"],
    },
    {
      id: "issue-3",
      title: "Air quality along The Highway (A1203)",
      description:
        "The Highway is one of London's most polluted arterial roads, with NO2 concentrations persistently above WHO limits. Residents report respiratory illness particularly in children and the elderly. The road creates a physical barrier between Shadwell and the Thames, cutting off riverside access.",
      compositeScore: 28,
      frequency: 7,
      severity: 4,
      score: {
        severity: 4,
        frequency: 7,
        costToFix: 4,
        timeToResolve: 4,
        complexity: 4,
        isSystemic: true,
        systemicNote:
          "TfL and the GLA have jurisdiction over A1203 — Tower Hamlets council alone cannot close or reroute it.",
      },
      quotes: [
        {
          text: "My son has had an inhaler since he was two. The doctor said the air is the problem. We can't afford to move.",
          speakerDescription: "Mother, 31, lives on Dellow Street",
          sessionId: "session-demo-4",
        },
        {
          text: "The monitoring station shows illegal levels and nothing changes. It's environmental racism — if this was Chelsea it would've been fixed.",
          speakerDescription: "Environmental campaigner, 29, Shadwell DLR",
          sessionId: "session-demo-5",
        },
      ],
      relatedIssues: ["Housing overcrowding", "Green space deficit", "Child health"],
    },
    {
      id: "issue-4",
      title: "Acute green space deficit",
      description:
        "Shadwell has 0.6m² of accessible green space per resident — against a 27m² London average and 9m² recommended minimum. Children grow up without safe outdoor space. Heat island effects in summer are increasingly severe and the riverside is cut off by The Highway.",
      compositeScore: 20,
      frequency: 5,
      severity: 4,
      score: {
        severity: 4,
        frequency: 5,
        costToFix: 4,
        timeToResolve: 4,
        complexity: 3,
        isSystemic: false,
        systemicNote: "",
      },
      quotes: [
        {
          text: "In the summer my kids can't sleep because the flat is 35 degrees and there's nowhere outside to go that isn't the pavement.",
          speakerDescription: "Father of three, 36, Shadwell Basin area",
          sessionId: "session-demo-8",
        },
        {
          text: "I refer people to green social prescribing and then have to tell them there's nowhere in Shadwell to go.",
          speakerDescription: "Local GP, Cable Street surgery",
          sessionId: "session-demo-9",
        },
      ],
      relatedIssues: ["Air quality", "Youth knife crime", "Mental health"],
    },
    {
      id: "issue-5",
      title: "Watney Market decline and economic emptiness",
      description:
        "60% of Watney Market pitches are vacant. The market was the social and commercial heart of the Bangladeshi community for decades. Traders cite online retail, the pandemic, and the loss of the working-class resident base. Its emptiness has become a symbol of neighbourhood decline.",
      compositeScore: 15,
      frequency: 5,
      severity: 3,
      score: {
        severity: 3,
        frequency: 5,
        costToFix: 3,
        timeToResolve: 3,
        complexity: 3,
        isSystemic: false,
        systemicNote: "",
      },
      quotes: [
        {
          text: "My family had a stall here for twenty years. Now I'm the only one left from the old traders. It's heartbreaking.",
          speakerDescription: "Market trader, 55, Watney Market",
          sessionId: "session-demo-8",
        },
        {
          text: "This used to be the heart of the community. You'd come here to shop but also to meet people. Now it's just empty concrete.",
          speakerDescription: "Bangladeshi grandmother, 68, Watney Market",
          sessionId: "session-demo-10",
        },
      ],
      relatedIssues: ["Gentrification displacement", "Elderly isolation"],
    },
    {
      id: "issue-6",
      title: "Elderly isolation — Bengali community",
      description:
        "A significant portion of Shadwell's elderly Bangladeshi residents have limited English and limited digital access, relying entirely on family or mosque networks. Since COVID, isolation has worsened. Many are unaware of council services they qualify for.",
      compositeScore: 12,
      frequency: 4,
      severity: 4,
      score: {
        severity: 4,
        frequency: 4,
        costToFix: 2,
        timeToResolve: 2,
        complexity: 2,
        isSystemic: false,
        systemicNote: "",
      },
      quotes: [
        {
          text: "My mother-in-law doesn't know there are home care services she qualifies for. She doesn't read English and nobody told her.",
          speakerDescription: "Daughter-in-law, 42, Shadwell",
          sessionId: "session-demo-10",
        },
        {
          text: "After my husband died I didn't leave the flat for three months. The mosque was the only place that found me.",
          speakerDescription: "Widow, 74, Watney Street area",
          sessionId: "session-demo-10",
        },
      ],
      relatedIssues: ["Housing overcrowding", "Mental health"],
    },
  ],
  voices: [
    {
      sessionId: "session-demo-1",
      positioningOneLiner: "Bangladeshi mother, 38, Watney Market — on the housing list 11 years",
      mainIssue: "Housing overcrowding and unaffordable rents",
      keyQuote: "There are seven of us in a three-bed. My kids share a room with their grandmother.",
      demographics: { ageRange: "36-50", gender: "female", postcode: "E1 2LA" },
    },
    {
      sessionId: "session-demo-2",
      positioningOneLiner: "Retired dockworker, 67, Cable Street — 30-year resident facing displacement",
      mainIssue: "Housing overcrowding and unaffordable rents",
      keyQuote: "My landlord wants £1,800 for a one-bed. I've lived here thirty years.",
      demographics: { ageRange: "65+", gender: "male", postcode: "E1W 2PN" },
    },
    {
      sessionId: "session-demo-3",
      positioningOneLiner: "Community organiser, 44, Shadwell Basin — long-term activist",
      mainIssue: "Housing and gentrification",
      keyQuote: "The new builds on the Wapping side are all luxury — none of it is for us.",
      demographics: { ageRange: "36-50", gender: "female", postcode: "E1 2PR" },
    },
    {
      sessionId: "session-demo-4",
      positioningOneLiner: "Mother, 31, Dellow Street — son with asthma since age 2",
      mainIssue: "Air quality along The Highway",
      keyQuote: "My son has had an inhaler since he was two. The doctor said the air is the problem.",
      demographics: { ageRange: "26-35", gender: "female", postcode: "E1W 1JN" },
    },
    {
      sessionId: "session-demo-5",
      positioningOneLiner: "Environmental campaigner, 29, Shadwell DLR — clean air activist",
      mainIssue: "Air quality along The Highway",
      keyQuote: "The monitoring station shows illegal levels and nothing changes.",
      demographics: { ageRange: "26-35", gender: "male", postcode: "E1 2HR" },
    },
    {
      sessionId: "session-demo-6",
      positioningOneLiner: "Youth worker, 33, Shadwell community centre — frontline safeguarding",
      mainIssue: "Youth knife crime and county lines",
      keyQuote: "There's nowhere to go. The youth club closed in the cuts.",
      demographics: { ageRange: "26-35", gender: "male", postcode: "E1 2HR" },
    },
    {
      sessionId: "session-demo-7",
      positioningOneLiner: "Father, 48, Watney Market — son repeatedly stop and searched",
      mainIssue: "Police relations and youth safety",
      keyQuote: "Police stop and search my son constantly. He's never done anything.",
      demographics: { ageRange: "36-50", gender: "male", postcode: "E1 2NF" },
    },
    {
      sessionId: "session-demo-8",
      positioningOneLiner: "Market trader, 55 — family had stall at Watney Market 20 years",
      mainIssue: "Watney Market decline",
      keyQuote: "My family had a stall here for twenty years. Now I'm the only one left.",
      demographics: { ageRange: "51-65", gender: "male", postcode: "E1 2LB" },
    },
    {
      sessionId: "session-demo-9",
      positioningOneLiner: "Local GP, Cable Street surgery — green social prescribing advocate",
      mainIssue: "Green space deficit",
      keyQuote: "I refer people to green social prescribing and then have to tell them there's nowhere to go.",
      demographics: { ageRange: "36-50", gender: "female", postcode: "E1W 3AB" },
    },
    {
      sessionId: "session-demo-10",
      positioningOneLiner: "Widow, 74, Watney Street — isolated after husband's death, reached by mosque",
      mainIssue: "Elderly isolation",
      keyQuote: "After my husband died I didn't leave the flat for three months. The mosque was the only place that found me.",
      demographics: { ageRange: "65+", gender: "female", postcode: "E1 2NP" },
    },
  ],
};

export const SHADWELL_PROPOSALS: PolicyProposal[] = [
  {
    id: "policy-1",
    title: "Community Land Trust — permanently affordable homes on council-owned sites",
    issuesAddressed: [
      { id: "issue-1", title: "Housing overcrowding and unaffordable rents" },
      { id: "issue-5", title: "Watney Market decline and economic emptiness" },
    ],
    summary:
      "Tower Hamlets Council transfers three underused council-owned sites (including land adjacent to Watney Market) to a Community Land Trust, delivering permanently affordable homes at social rent — removing units from the speculative market for good.",
    councilAction:
      "Identify and transfer suitable council-owned land to a CLT at nil or peppercorn lease. Commission a housing association partner. Use Community Housing Fund and GLA Affordable Homes Programme for capital.",
    responsibleDepartment: "Tower Hamlets Housing & Regeneration",
    contactPath:
      "Cllr Kabir Ahmed (Cabinet Member for Housing) via Tower Hamlets Council. GLA Housing team for AHP funding.",
    feasibility: "Medium",
    feasibilityReason:
      "Tower Hamlets has the legal powers and has supported CLT models before. Main constraint is political will and upfront development financing.",
    pathToImplementation: [
      "Commission feasibility study on three shortlisted sites (3 months)",
      "Establish CLT governance with community board — majority local residents (6 months)",
      "Apply to GLA Affordable Homes Programme for capital grant",
      "Begin planning applications — target 60+ permanently affordable units on first site",
      "Launch pre-let process prioritising households currently on Shadwell ward waiting list",
    ],
    estimatedCost: {
      range: "£8–15M per site",
      basis: "Comparable East London CLT developments in Bow and Hackney. GLA grant typically covers 40–60%.",
      category: "high",
    },
    timeToImplement: {
      range: "3–7 years",
      phasing: "Planning and funding 1–2 years; construction 2–4 years. First residents in year 4–5.",
    },
    drawbacks: [
      {
        title: "Scale mismatch",
        description:
          "CLT delivers dozens of units against a waiting list of 19,000+ households. This stabilises a small number of families while systemic pressures continue.",
      },
      {
        title: "Long delivery timeline",
        description: "Households in acute need now face a 5+ year wait for any new unit.",
      },
    ],
    isSystemicFix: false,
    systemicNote:
      "The housing crisis requires national Right to Buy reform and large-scale social housing investment — beyond any council's capacity alone.",
    publicSupport:
      "A 2023 Tower Hamlets resident survey found 78% supported CLTs over private developer-led schemes.",
    residentQuotes: [
      "We don't want luxury flats with 10% affordable — we want our homes back.",
      "If the council owns the land, why are they letting developers build flats we can't afford?",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote: "Tower Hamlets' 2022 housing strategy explicitly supports CLT and co-operative housing models.",
    sources: ["Tower Hamlets Housing Strategy 2022–2027", "GLA Affordable Homes Programme", "UK CLT Network"],
  },
  {
    id: "policy-2",
    title: "The Highway traffic reduction and riverside greenway",
    issuesAddressed: [
      { id: "issue-3", title: "Air quality along The Highway (A1203)" },
      { id: "issue-4", title: "Acute green space deficit" },
    ],
    summary:
      "Work with TfL to pilot timed traffic restrictions on The Highway during peak pollution hours, combined with converting the northern pavement into a continuous greenway connecting Shadwell Basin to Wapping — creating riverside green space while reducing NOx exposure.",
    councilAction:
      "Pass a formal council motion calling on TfL and the GLA to implement timed traffic restrictions. Commission independent air quality monitoring and publish results publicly. Apply for Active Travel England funding for greenway design.",
    responsibleDepartment: "Tower Hamlets Highways & Environment + TfL (joint)",
    contactPath:
      "Cllr Maium Talukdar (Cabinet Member for Environment). TfL Network Development. GLA member Unmesh Desai.",
    feasibility: "Low",
    feasibilityReason:
      "A1203 is a TfL road — Tower Hamlets cannot close or reroute it unilaterally. Requires TfL partnership and GLA Mayoral backing.",
    pathToImplementation: [
      "Commission independent NO2 monitoring at five points along The Highway — publish results (3 months)",
      "Council formally petitions TfL for a pilot traffic reduction scheme (6 months)",
      "Engage GLA member Unmesh Desai and Mayor's office for mayoral support",
      "Apply for Active Travel England funds for greenway design feasibility",
      "Pilot timed restriction on one stretch — monitor and evaluate (12 month trial)",
    ],
    estimatedCost: {
      range: "£500K–£2M (council contribution)",
      basis: "Monitoring and advocacy: £150K. Greenway design and infrastructure: £1.5–2M over 500m stretch.",
      category: "medium",
    },
    timeToImplement: {
      range: "2–5 years",
      phasing: "Monitoring and advocacy 1–2 years; pilot if approved 2–3 years; full implementation 4–5 years.",
    },
    drawbacks: [
      {
        title: "Freight and logistics opposition",
        description:
          "The Highway carries significant HGV traffic serving East London logistics. Restrictions would face organised opposition from freight operators.",
      },
      {
        title: "Traffic displacement risk",
        description:
          "Restricting The Highway risks displacing traffic onto Cable Street and other residential roads.",
      },
    ],
    isSystemicFix: true,
    systemicNote: "",
    publicSupport:
      "Air quality is consistently the top environmental concern in Tower Hamlets surveys. Walking and cycling infrastructure has 65%+ support when framed as a health measure.",
    residentQuotes: [
      "They put a cycle lane in Hackney in six months. We've been asking for this for twenty years.",
      "I can't let my kids play outside because of that road.",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote: "Aligns with Tower Hamlets' Air Quality Action Plan and the GLA's Healthy Streets programme.",
    sources: ["DEFRA Air Quality Index — Shadwell data", "TfL Road Network Strategy", "Tower Hamlets AQAP 2023"],
  },
  {
    id: "policy-3",
    title: "Watney Market as a community enterprise and wellbeing hub",
    issuesAddressed: [
      { id: "issue-5", title: "Watney Market decline and economic emptiness" },
      { id: "issue-6", title: "Elderly isolation — Bengali community" },
    ],
    summary:
      "Repurpose 40% of vacant Watney Market pitches as subsidised community enterprise units — anchored by a weekly social market day, a free community café, and a bilingual drop-in advice service for elderly residents.",
    councilAction:
      "Designate 40% of pitches as community-rate lets at £25/week (vs commercial £150/week). Partner with East London Cares and local mosque networks for bilingual advice drop-in. Commission a community enterprise coordinator for 18 months.",
    responsibleDepartment: "Tower Hamlets Markets Service + Communities",
    contactPath:
      "Tower Hamlets Markets Manager. Cllr Rachel Blake (Culture & Communities). East London Cares as delivery partner.",
    feasibility: "High",
    feasibilityReason:
      "Tower Hamlets Council owns the market. Partial repurposing requires only a council decision. Proven model in Brixton, Roman Road, and Maltby Street.",
    pathToImplementation: [
      "Council conducts expression of interest from community organisations (2 months)",
      "Establish market steering group — 50% community representation (3 months)",
      "Designate and refurbish 6 community-rate pitches (4 months)",
      "Launch bilingual advice drop-in with Tower Hamlets Homes and Citizens Advice (6 months)",
      "Weekly community market day — subsidised food, cultural stalls, activities for elderly residents",
    ],
    estimatedCost: {
      range: "£120–250K",
      basis: "Coordinator post 18 months: £80K. Pitch refurbishment: £40–80K. UKSPF and Lottery funding available.",
      category: "low",
    },
    timeToImplement: {
      range: "6–18 months",
      phasing: "First community pitches can launch within 6 months. Full programme 12–18 months.",
    },
    drawbacks: [
      {
        title: "Doesn't restore commercial viability",
        description:
          "Community use doesn't solve the underlying collapse in market footfall or generate rent revenue needed for long-term maintenance.",
      },
    ],
    isSystemicFix: false,
    systemicNote: "",
    publicSupport:
      "Tower Hamlets 2022 consultation found 84% wanted the market to serve community functions, not just retail.",
    residentQuotes: [
      "If they put a drop-in there for older people, my mum would actually leave the house.",
      "Bring the market back to life — not with hipster food, with our food, our people.",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote: "Aligns with Mayor Rahman's community wealth building agenda and Social Cohesion Strategy.",
    sources: ["Tower Hamlets Market Services", "East London Cares Annual Report", "UKSPF guidance"],
  },
];

export function isShadwellSlug(slug: string): boolean {
  const decoded = decodeURIComponent(slug).toLowerCase().replace(/[\s,.-]+/g, "");
  return decoded === "shadwell" || decoded === "shadwelllondon" || decoded === "shadwelle1";
}
