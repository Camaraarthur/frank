// ============================================================================
// Frank — Beckton, London demo seed data
// Derived from real field interviews conducted by Arthur Camara (UCL Bartlett)
// at Beckton, West Ham Foundation pitch, shopping centre, and local pub
// ============================================================================

import type { AnalysisResult, AreaBriefing, PolicyProposal } from "@/lib/api";

export const BECKTON_BRIEFING: AreaBriefing = {
  area: "Beckton, London",
  summary:
    "Beckton is a residential suburb in the Royal Docks area of the London Borough of Newham (E6/E16), built in the 1980s on land formerly occupied by the Beckton Gas Works. It sits between the A13, the Royal Docks waterfront, and Barking. The area has a large retail park, a DLR station, and several major employers including Britvic's soft drinks factory and the Beckton Sewage Works (the largest in Europe). Since the 2012 Olympics, property prices have surged across Newham, driving out many long-term residents and bringing successive waves of new arrivals from Eastern Europe, South Asia, and the Middle East. The population turns over rapidly — one resident described it as a 'conveyor belt of changing people.' Community infrastructure has not kept pace: old community centres have closed, the former dry ski slope on the slag heap is derelict, and people describe a car-dependent neighbourhood where you shop and leave without talking to anyone.",
  governingBodies: [
    // === THIS AREA ===
    {
      level: "This area",
      name: "Beckton Ward Councillors",
      representative: "Cllr Zuber Sheraji, Cllr Nareser Sheraji, Cllr Mumtaz Khan",
      party: "Labour",
      keyPolicies: [
        "Housing, community safety, local environment",
        "src: https://democracy.newham.gov.uk",
      ],
    },
    // === GOVERNS THIS AREA ===
    {
      level: "Borough",
      name: "London Borough of Newham",
      representative: "Mayor Rokhsana Fiaz",
      party: "Labour",
      keyPolicies: [
        "Community Wealth Building, Royal Docks regeneration",
        "src: https://www.newham.gov.uk",
      ],
    },
    // === ABOVE ===
    {
      level: "City",
      name: "Greater London Authority",
      representative: "Mayor Sadiq Khan",
      party: "Labour",
      keyPolicies: [
        "Royal Docks Enterprise Zone, GLA Good Growth Fund",
        "src: https://www.london.gov.uk/who-we-are/mayor-london",
      ],
    },
    {
      level: "City (Assembly)",
      name: "London Assembly — City and East",
      representative: "Unmesh Desai AM",
      party: "Labour",
      keyPolicies: [
        "Policing, community safety, housing oversight",
        "src: https://www.london.gov.uk/who-we-are/london-assembly",
      ],
    },
    {
      level: "National",
      name: "UK Parliament — West Ham and Beckton",
      representative: "James Asser MP",
      party: "Labour",
      keyPolicies: [
        "Housing and cost of living",
        "src: https://members.parliament.uk/member/5211/contact",
      ],
    },
  ],
  contestedIssues: [
    {
      title: "Loss of community identity and social cohesion",
      description:
        "Long-term residents describe a 'conveyor belt' of demographic change — successive waves of immigration combined with an exodus of original residents selling property at high prices and moving out. Community centres have closed. People describe the area as solitary and atomised.",
      severity: "high",
      sources: ["Field interviews — Beckton area, 2024", "Newham Community Strategy"],
    },
    {
      title: "Property price exodus and gentrification pressure",
      description:
        "Post-Olympics property price inflation has radiated outward from Stratford into Beckton. Original residents sell at inflated prices and move 30+ km away, pocketing the difference. New builds along the waterfront target investors and higher-income buyers, not existing communities.",
      severity: "high",
      sources: ["Field interviews — Long-term worker, Britvic worker", "ONS House Price Index — Newham"],
    },
    {
      title: "Closed community facilities and derelict ski slope",
      description:
        "Beckton dry ski slope — a beloved local landmark built on the old gas works slag heap — is closed and derelict. Community centres in the surrounding area (including Carpenters Road, Stratford) have shut as demographics shifted and usage declined.",
      severity: "medium",
      sources: ["Field interviews 2024", "Newham Council asset register"],
    },
    {
      title: "Car-dependent, isolated neighbourhood",
      description:
        "Residents and workers describe an area where almost everyone arrives by car, does their business, and leaves. The shopping centre and industrial estates generate traffic but no community. Public transport links exist but the area feels disconnected.",
      severity: "medium",
      sources: ["Field interviews — shopping centre and football pitch", "TfL accessibility data"],
    },
    {
      title: "Traffic congestion and undisciplined driving",
      description:
        "Multiple residents cite heavy congestion, undisciplined drivers, and the impact of ongoing regeneration construction traffic. The industrial road network was not designed for the residential density now building up.",
      severity: "medium",
      sources: ["Field interviews 2024", "Newham Highways data"],
    },
  ],
  demographics: {
    population: 15800,
    highlights: [
      "One of the most ethnically diverse wards in the UK — no single ethnic group is a majority",
      "Rapid demographic turnover: successive waves of Eastern European, South Asian, Middle Eastern, and Afghan communities in the past decade",
      "Median household income below London average — significant pockets of deprivation",
      "High proportion of new-build housing along the Royal Docks waterfront",
      "Large transient population — many residents are recent arrivals to the UK",
    ],
  },
  suggestedLocations: [
    {
      name: "Beckton (former ski slope)",
      reason: "Derelict local landmark — triggers memories and opinions about loss, identity, and what the area used to be",
    },
    {
      name: "West Ham Foundation football pitch",
      reason: "Active community hub — charity football, memorial events, draws people back to the area even after moving away",
    },
    {
      name: "Beckton retail park / shopping centre",
      reason: "High footfall but atomised — specialised ethnic shops, Home Bargains, Iceland; people come by bus from 45 minutes away for specific stores",
    },
    {
      name: "Britvic factory and industrial road",
      reason: "Major stable employer — long-term workers can speak to decades of change in the area's workforce and demographics",
    },
    {
      name: "Local pub (near shopping centre)",
      reason: "Remaining space for candid conversation — older residents with strong opinions surface here",
    },
    {
      name: "Galleons Reach / Royal Docks waterfront",
      reason: "New-build zone with historic hotel building still standing — gentrification frontier, contrast between old docks heritage and luxury development",
    },
  ],
  interviewThemes: [
    "Loss of community identity — who lives here now vs. who used to",
    "Property prices and the decision to stay or sell up and leave",
    "The closed ski slope — memories, attachment, what should replace it",
    "Factory work and industrial employment — stability vs. change",
    "Immigration waves and integration — what works, what doesn't",
    "Isolation and atomisation — do you know your neighbours?",
    "What would bring people together in this area?",
  ],
};

export const BECKTON_ANALYSIS: AnalysisResult = {
  issues: [
    {
      id: "beckton-issue-1",
      title: "Loss of community identity and demographic conveyor belt",
      description:
        "Long-term residents describe Beckton as an area that has lost its original identity through successive waves of demographic change. The people who built the community — dockworkers, factory workers, their families — have largely sold up and moved out, replaced by constantly changing populations who don't integrate with each other or with what remains of the original community. Community centres have closed. The area changes 'almost daily'.",
      compositeScore: 42,
      frequency: 8,
      severity: 5,
      score: {
        severity: 5,
        frequency: 8,
        costToFix: 4,
        timeToResolve: 5,
        complexity: 5,
        isSystemic: true,
        systemicNote:
          "Driven by national immigration patterns, housing market dynamics, and the post-industrial transition of East London. No single council intervention can reverse the trend — but community infrastructure can help integration.",
      },
      quotes: [
        {
          text: "The area loses its identity. It changes like every day. It's a conveyor belt of changing people.",
          speakerDescription: "Factory worker, 50s, Britvic factory worker, grew up in Stratford, 10+ years working in Beckton",
          sessionId: "session-beckton-1",
        },
        {
          text: "He's lived here twenty years and doesn't know anyone anymore. Too many people coming and going — nobody stays long enough to become neighbours.",
          speakerDescription: "Long-term resident, met near the shopping centre",
          sessionId: "session-beckton-2",
        },
        {
          text: "I've been at Britvic now for just over ten years, and the people that work there have changed so much. It's gone from English and Asian, to English and Eastern European, to now a lot of Middle Eastern, Afghan people coming into the area.",
          speakerDescription: "Long-term worker, Britvic factory worker, describing workforce demographic shifts",
          sessionId: "session-beckton-1",
        },
      ],
      relatedIssues: ["Property price exodus", "Closed community centres", "Integration barriers"],
    },
    {
      id: "beckton-issue-2",
      title: "Property price exodus — original residents priced into leaving",
      description:
        "Since the 2012 Olympics, property prices in and around Beckton have risen sharply as the ripple effect of Stratford's regeneration spread outward. Long-term homeowners discovered they could sell for half a million, buy for three hundred thousand thirty kilometres away, and pocket the difference. The result is a systematic outflow of the people who knew the area, replaced by buyers and renters with no historical connection.",
      compositeScore: 35,
      frequency: 7,
      severity: 4,
      score: {
        severity: 4,
        frequency: 7,
        costToFix: 5,
        timeToResolve: 5,
        complexity: 5,
        isSystemic: true,
        systemicNote:
          "Root cause is London-wide housing inflation driven by undersupply, speculative investment, and the Olympics regeneration effect. Council can mitigate through affordable housing policy but cannot control the market.",
      },
      quotes: [
        {
          text: "People sell their property here for maybe half a million, then buy something where I live now for three hundred thousand. They end up with money in their pocket. It's almost like a natural exodus.",
          speakerDescription: "Resident, moved 35km away after wife was assaulted, now commutes to Britvic",
          sessionId: "session-beckton-1",
        },
        {
          text: "For people that were renting, it made it hard. The property prices went sky high up after the Olympics announcement.",
          speakerDescription: "Resident, describing the Stratford-to-Beckton price ripple",
          sessionId: "session-beckton-1",
        },
        {
          text: "All those new builds on the waterside — they weren't there before. The property has become so expensive because developments around it push everything up.",
          speakerDescription: "Resident, pointing to Royal Docks new-builds on map",
          sessionId: "session-beckton-1",
        },
      ],
      relatedIssues: ["Loss of community identity", "New-build gentrification", "Rental affordability"],
    },
    {
      id: "beckton-issue-3",
      title: "Closed community centres and derelict Beckton ski slope",
      description:
        "Beckton dry ski slope — built on the slag heap from the old gas works, once a beloved local amenity — is closed and derelict. The broader pattern is the same: community centres that served the original population shut down as demographics shifted and new residents didn't use them. The Carpenters Road community centre in Stratford followed the same trajectory. There is no replacement.",
      compositeScore: 30,
      frequency: 6,
      severity: 5,
      score: {
        severity: 5,
        frequency: 6,
        costToFix: 3,
        timeToResolve: 3,
        complexity: 3,
        isSystemic: false,
        systemicNote: "",
      },
      quotes: [
        {
          text: "It's such a shame. I used the ski slope several times. You're the first person that knew the ski slope.",
          speakerDescription: "Resident, recalling Beckton when it was open",
          sessionId: "session-beckton-1",
        },
        {
          text: "The community centre was wonderful when I grew up. But as the people that moved into the area changed, they weren't interested. It wasn't used as much and eventually it closed down.",
          speakerDescription: "Resident, describing the Carpenters Road community centre closure in Stratford",
          sessionId: "session-beckton-1",
        },
        {
          text: "The people that replaced them didn't want to take part in the activities — whether it's a cultural thing or not, it just closed.",
          speakerDescription: "Resident, on why community centres die when demographics shift",
          sessionId: "session-beckton-1",
        },
      ],
      relatedIssues: ["Loss of community identity", "Integration barriers", "Lack of amenities"],
    },
    {
      id: "beckton-issue-4",
      title: "Atomisation and isolation — a car-dependent, pass-through neighbourhood",
      description:
        "Beckton functions more as a place people drive through than a place people live in together. Workers commute to the industrial estates by car. Shoppers drive in from East Ham, Barking, and further afield for specialised ethnic grocery stores. Almost nobody walks, lingers, or encounters neighbours. The area feels solitary — people come, do their business, and leave without talking to anyone.",
      compositeScore: 25,
      frequency: 7,
      severity: 3,
      score: {
        severity: 3,
        frequency: 7,
        costToFix: 3,
        timeToResolve: 4,
        complexity: 4,
        isSystemic: true,
        systemicNote:
          "Product of car-dependent suburban planning, industrial land use patterns, and the failure to build social infrastructure alongside housing. Requires integrated placemaking, not just buildings.",
      },
      quotes: [
        {
          text: "People come here by car. They come from far away. They enter the market, do their thing, come back, don't talk to anyone, and go back. Very, very solitary.",
          speakerDescription: "Interviewer, summarising pattern observed across all conversations",
          sessionId: "session-beckton-3",
        },
        {
          text: "I would say the majority of people probably come by their own car and drive in. We've got quite a big car park at Britvic.",
          speakerDescription: "Resident, on how people access the area",
          sessionId: "session-beckton-1",
        },
        {
          text: "I come by bus — forty-five minutes. I come for the shops, Home Bargains and the Lithuanian shop.",
          speakerDescription: "Shopper at Beckton retail park, commutes from north of the A406",
          sessionId: "session-beckton-4",
        },
      ],
      relatedIssues: ["Traffic congestion", "Loss of community identity", "Lack of public spaces"],
    },
    {
      id: "beckton-issue-5",
      title: "Integration barriers — language, culture, and parallel communities",
      description:
        "Multiple interviewees described parallel communities living side by side without interaction. Shops in the retail park cater to specific ethnic groups — Polish, Lithuanian, Bangladeshi, Muslim — drawing customers from across East London but not creating shared space. Parents rely on children to translate in shops. Communities 'prefer to live in their own communities, speak their own language' rather than integrate.",
      compositeScore: 22,
      frequency: 5,
      severity: 4,
      score: {
        severity: 4,
        frequency: 5,
        costToFix: 3,
        timeToResolve: 4,
        complexity: 5,
        isSystemic: true,
        systemicNote:
          "Integration is a national policy challenge. Local interventions — ESOL provision, shared community spaces, cross-cultural programming — can help but cannot resolve structural barriers to belonging.",
      },
      quotes: [
        {
          text: "I went into the shopping centre and there were people getting their children to speak for them. The girls in the shop were saying 'I'm speaking to you' — and the parent couldn't understand. The child had to translate.",
          speakerDescription: "Resident, describing a scene in the Beckton retail park",
          sessionId: "session-beckton-1",
        },
        {
          text: "They prefer to live in their own communities, speak their own language. When the children go to school they learn English, but at home, their parents' native language is still the one spoken.",
          speakerDescription: "Resident, reflecting on integration challenges",
          sessionId: "session-beckton-1",
        },
        {
          text: "A lot of the shops in that retail park now are all Polish or Asian. Iceland is the only general supermarket left.",
          speakerDescription: "Resident, on the ethnic specialisation of Beckton's retail",
          sessionId: "session-beckton-1",
        },
      ],
      relatedIssues: ["Loss of community identity", "Closed community centres", "Atomisation"],
    },
    {
      id: "beckton-issue-6",
      title: "Traffic congestion, unsafe driving, and construction disruption",
      description:
        "Residents and visitors consistently report heavy traffic congestion, undisciplined driving, and disruption from ongoing construction and regeneration works. The road network — designed for industrial access — now carries residential traffic, delivery vehicles, and construction lorries simultaneously. The experience of moving through the area is stressful and hostile to pedestrians.",
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
          text: "It's very congested. They're regenerating some of this, and the drivers are very undisciplined.",
          speakerDescription: "Passer-by near the shopping centre, visibly frustrated",
          sessionId: "session-beckton-5",
        },
        {
          text: "There's a lot of traffic. The building that's going on — it's gone up everywhere. Never used to be there.",
          speakerDescription: "Resident, pointing to new developments along the access roads",
          sessionId: "session-beckton-1",
        },
      ],
      relatedIssues: ["Car-dependent neighbourhood", "New-build construction", "Pedestrian safety"],
    },
  ],
  voices: [
    {
      sessionId: "session-beckton-1",
      positioningOneLiner: "Factory worker, 50s, Britvic factory worker — grew up in Stratford, moved 35km away, witnessed decades of change",
      mainIssue: "Loss of community identity and demographic conveyor belt",
      keyQuote: "The area loses its identity. It's a conveyor belt of changing people.",
      demographics: { ageRange: "51-65", gender: "male", postcode: "E6 6LP" },
    },
    {
      sessionId: "session-beckton-2",
      positioningOneLiner: "Long-term resident, 60s, near shopping centre — lived here 20 years, knows nobody anymore",
      mainIssue: "Loss of community identity and demographic conveyor belt",
      keyQuote: "He's lived here twenty years and doesn't know anyone. Too many people coming and going.",
      demographics: { ageRange: "51-65", gender: "male", postcode: "E6 5BE" },
    },
    {
      sessionId: "session-beckton-3",
      positioningOneLiner: "Footballer, 20s, West Ham Foundation footballer — came back for a memorial tournament despite moving away",
      mainIssue: "Community through sport — the football pitch as last social anchor",
      keyQuote: "I used to play with the team. I came only for this event — a memorial for someone who passed away. They raised money for his family and for charity.",
      demographics: { ageRange: "18-25", gender: "male", postcode: "E6 6LT" },
    },
    {
      sessionId: "session-beckton-4",
      positioningOneLiner: "Shopper, 40s, commutes 45 minutes by bus — comes for Home Bargains and the Lithuanian shop",
      mainIssue: "Atomisation and isolation — the area as transactional space",
      keyQuote: "I come by bus — forty-five minutes. Home Bargains and the Lithuanian shop. Then I go home.",
      demographics: { ageRange: "36-50", gender: "female", postcode: "E6 5RS" },
    },
    {
      sessionId: "session-beckton-5",
      positioningOneLiner: "Resident, 7 years, loves the area — supermarkets, greenery, builder's shops, Asian grocers",
      mainIssue: "Retail diversity as community asset",
      keyQuote: "We got supermarkets, shops, builder shops, the Asian shop. We go bargain-buying everything necessary. It's really quite a nice place.",
      demographics: { ageRange: "36-50", gender: "male", postcode: "E6 5NR" },
    },
    {
      sessionId: "session-beckton-6",
      positioningOneLiner: "Pub regular, Beckton — blunt about the area's decline",
      mainIssue: "General dissatisfaction with neighbourhood decline",
      keyQuote: "Everything is messed up in Beckton. No strippers, no gas — smelling rubbish everywhere.",
      demographics: { ageRange: "51-65", gender: "male", postcode: "E6 5QB" },
    },
    {
      sessionId: "session-beckton-7",
      positioningOneLiner: "Passer-by, near shopping centre — frustrated by traffic and construction",
      mainIssue: "Traffic congestion and unsafe driving",
      keyQuote: "It's very congested. The drivers are very undisciplined.",
      demographics: { ageRange: "36-50", gender: "male", postcode: "E6 5BE" },
    },
    {
      sessionId: "session-beckton-8",
      positioningOneLiner: "Group of residents near football pitch — recent arrivals, limited English, know only the shopping centre",
      mainIssue: "Integration barriers and limited local knowledge",
      keyQuote: "We know the Beckton shopping centre and that's it. Here is nothing, I think.",
      demographics: { ageRange: "26-35", gender: "male", postcode: "E6 5RG" },
    },
  ],
};

export const BECKTON_PROPOSALS: PolicyProposal[] = [
  {
    id: "beckton-policy-1",
    title: "Beckton Community Hub — new shared space on the former ski slope",
    issuesAddressed: [
      { id: "beckton-issue-3", title: "Closed community centres and derelict Beckton ski slope" },
      { id: "beckton-issue-1", title: "Loss of community identity and demographic conveyor belt" },
      { id: "beckton-issue-5", title: "Integration barriers — language, culture, and parallel communities" },
    ],
    summary:
      "Reuse the derelict Beckton ski slope site as a new cross-cultural community hub, incorporating ESOL classes, a community cafe, youth sport facilities, and multi-faith meeting space. The design should acknowledge the site's industrial heritage (gas works slag heap) and the ski slope that once stood there — preserving local memory while serving the area's current, diverse population.",
    councilAction:
      "Commission a feasibility study for the Beckton site. Apply for GLA Good Growth Fund and Royal Docks Enterprise Zone community investment. Partner with UCL Bartlett (existing student research on the site) and West Ham Foundation for youth sport programming.",
    responsibleDepartment: "Newham Council Regeneration & Royal Docks Team",
    contactPath:
      "Royal Docks ward councillors via Newham Council. GLA Royal Docks Enterprise Zone team. West Ham Foundation for sports programming partnership.",
    feasibility: "Medium",
    feasibilityReason:
      "The site is council-controlled and currently derelict — no displacement required. Capital funding is the main constraint, but the Royal Docks Enterprise Zone has dedicated community investment budgets. UCL student research provides free design development.",
    pathToImplementation: [
      "Commission heritage and environmental assessment of the slag heap site (3 months)",
      "Community consultation — multilingual outreach to Beckton's diverse communities (4 months)",
      "Apply for GLA Good Growth Fund and Royal Docks Enterprise Zone community investment",
      "Design competition or UCL Bartlett partnership for architectural design (6 months)",
      "Planning application and phased construction — community cafe and ESOL first, sports facilities second",
      "Programming partnership with West Ham Foundation, local mosques, and ESOL providers",
    ],
    estimatedCost: {
      range: "£3-8M",
      basis: "Comparable community hub projects in Newham and Tower Hamlets. GLA Good Growth Fund typically covers 50-70% of community projects in Enterprise Zones.",
      category: "high",
    },
    timeToImplement: {
      range: "3-6 years",
      phasing: "Feasibility and design 1-2 years; first phase (cafe + ESOL) 2-3 years; full build-out 4-6 years.",
    },
    drawbacks: [
      {
        title: "Demographic turnover may continue regardless",
        description:
          "If the 'conveyor belt' of changing residents continues, a community hub may struggle to build a stable user base. Programming must be designed for constant onboarding of new arrivals, not a fixed community.",
      },
      {
        title: "Environmental remediation risk",
        description:
          "The slag heap contains gas works waste. Environmental assessment may reveal contamination requiring expensive remediation before building.",
      },
    ],
    isSystemicFix: false,
    systemicNote:
      "A community hub is a local intervention. The underlying drivers of demographic churn — housing market dynamics, immigration patterns, industrial decline — require national policy.",
    publicSupport:
      "Multiple interviewees expressed nostalgia for the ski slope and desire for community space. Ian: 'Community centres were good — the one where I grew up was wonderful.' The question is whether new communities will use it.",
    residentQuotes: [
      "It's such a shame to see the ski slope go. Something should be there for people.",
      "Community centres were good when I grew up. The trouble is — will the people that live here now actually use it?",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote:
      "Aligns with Newham's Community Wealth Building strategy and the Royal Docks Enterprise Zone placemaking objectives.",
    sources: [
      "Newham Community Wealth Building Strategy",
      "GLA Royal Docks Enterprise Zone Framework",
      "GLA Good Growth Fund guidance",
      "UCL Bartlett student research — Beckton site analysis",
    ],
  },
  {
    id: "beckton-policy-2",
    title: "Cross-cultural market and shared social space at Beckton retail park",
    issuesAddressed: [
      { id: "beckton-issue-4", title: "Atomisation and isolation — a car-dependent, pass-through neighbourhood" },
      { id: "beckton-issue-5", title: "Integration barriers — language, culture, and parallel communities" },
    ],
    summary:
      "Transform part of the Beckton retail park into a weekly cross-cultural market and social space — drawing on the area's existing strength (diverse ethnic retail) while creating a reason for people to linger, meet, and interact rather than drive in and drive out. Include free ESOL conversation sessions, a children's play area, and food stalls representing all the communities now living in Beckton.",
    councilAction:
      "Negotiate with retail park landlord for weekly market use of underutilised parking/forecourt space. Provide subsidised stall rates for community organisations. Fund an ESOL outreach coordinator based at the market one day per week.",
    responsibleDepartment: "Newham Council Communities & Markets Service",
    contactPath:
      "Newham Markets Service. Royal Docks ward councillors. ESOL providers (Newham Adult Learning Service).",
    feasibility: "High",
    feasibilityReason:
      "Low capital cost — uses existing underutilised space. Beckton's ethnic retail diversity means stallholders already exist. Proven model at Queen's Market (Upton Park) and other Newham markets.",
    pathToImplementation: [
      "Approach retail park management with market proposal and community benefit case (2 months)",
      "Expression of interest from community stallholders and ESOL providers (3 months)",
      "Pilot 4 monthly markets — evaluate footfall, dwell time, cross-cultural mixing (6 months)",
      "If successful, move to weekly and add permanent children's play/seating area",
      "Connect with West Ham Foundation for youth sport taster sessions at the market",
    ],
    estimatedCost: {
      range: "£40-120K per year",
      basis: "Market coordinator: £35K. Stall subsidies and equipment: £20-40K. ESOL outreach: £15-30K. Fundable through UKSPF and Newham community budgets.",
      category: "low",
    },
    timeToImplement: {
      range: "6-12 months",
      phasing: "Pilot markets within 6 months. Permanent weekly market within 12 months.",
    },
    drawbacks: [
      {
        title: "Private landlord dependency",
        description:
          "The retail park is privately owned. The landlord may refuse or demand commercial rent, making the model unviable without council subsidy.",
      },
      {
        title: "May replicate existing ethnic silos rather than bridging them",
        description:
          "Without intentional cross-cultural programming, a market could simply create adjacent ethnic stalls without actual integration — Lithuanian shoppers at Lithuanian stalls, Bangladeshi at Bangladeshi, and so on.",
      },
    ],
    isSystemicFix: false,
    systemicNote: "",
    publicSupport:
      "The retail park already draws people from across East London for its ethnic shops. A resident of 7 years described the diversity as an asset: 'supermarkets, builder shops, the Asian shop — it's really quite a nice place.' The question is turning transactional visits into social ones.",
    residentQuotes: [
      "We got supermarkets, shops, builder shops, the Asian shop. It's really quite a nice place — but nobody talks to each other.",
      "People come from forty-five minutes away for the shops. If there was something more, they might stay longer.",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote:
      "Aligns with Newham's Social Integration Strategy and the GLA's All of Us social integration framework.",
    sources: [
      "Newham Social Integration Strategy",
      "GLA All of Us — Social Integration Framework",
      "UKSPF Community Investment guidance",
      "Queen's Market (Upton Park) case study",
    ],
  },
  {
    id: "beckton-policy-3",
    title: "Industrial employer community compact — anchoring Britvic and others as neighbourhood stakeholders",
    issuesAddressed: [
      { id: "beckton-issue-1", title: "Loss of community identity and demographic conveyor belt" },
      { id: "beckton-issue-4", title: "Atomisation and isolation — a car-dependent, pass-through neighbourhood" },
    ],
    summary:
      "Establish a formal 'community compact' between Newham Council and major industrial employers in Beckton (Britvic, Thames Water/Beckton Sewage Works, logistics companies) — committing employers to local hiring targets, ESOL support for workers, and open-days connecting factories to the surrounding community. Britvic employs hundreds of workers from dozens of nationalities — the factory is already a site of integration, but that social mixing stays behind the factory gates.",
    councilAction:
      "Convene a Beckton Employers Forum. Negotiate voluntary community compacts with anchor employers. Offer business rates relief or planning support in exchange for local hiring, ESOL, and community engagement commitments.",
    responsibleDepartment: "Newham Council Economic Development & Community Wealth Building",
    contactPath:
      "Newham Economic Development team. Britvic site management. Thames Water community relations. Royal Docks Enterprise Zone team.",
    feasibility: "Medium",
    feasibilityReason:
      "Britvic is described as a long-term, well-managed employer that invests in its sites. Voluntary compacts are politically achievable. The challenge is getting employers to commit resources beyond their fence line.",
    pathToImplementation: [
      "Map all major employers in the Beckton industrial zone — size, workforce demographics, existing CSR (2 months)",
      "Convene Beckton Employers Forum with council, GLA Enterprise Zone team, and employers (4 months)",
      "Draft voluntary community compact — local hiring targets, ESOL provision, annual open days (6 months)",
      "Pilot with Britvic — they already have a diverse workforce and stable long-term presence",
      "Evaluate and expand to other employers in the zone",
    ],
    estimatedCost: {
      range: "£80-200K council contribution",
      basis: "Forum coordination and compact administration: £60K/year. ESOL subsidy for employer programmes: £30-80K. Majority of cost borne by employers through in-kind commitments.",
      category: "low",
    },
    timeToImplement: {
      range: "1-3 years",
      phasing: "Employers Forum within 6 months. First compact signed within 12 months. Measurable outcomes within 2-3 years.",
    },
    drawbacks: [
      {
        title: "Voluntary compacts have no enforcement mechanism",
        description:
          "Without statutory teeth, employers can sign compacts and ignore them. Effectiveness depends entirely on sustained political pressure and genuine employer buy-in.",
      },
      {
        title: "Factory integration doesn't equal neighbourhood integration",
        description:
          "Workers may mix inside the factory but still retreat to separate ethnic enclaves after their shift. The compact addresses workplace integration, not residential community building.",
      },
    ],
    isSystemicFix: false,
    systemicNote:
      "A local compact cannot address the structural forces driving demographic churn. But it can anchor stable employers as community stakeholders, providing continuity even as the residential population turns over.",
    publicSupport:
      "Ian's testimony about Britvic's stability — 'they do not invest their money lightly, they're long-term' — suggests employer engagement is achievable. The factory is already the most stable institution in the area.",
    residentQuotes: [
      "Britvic is expanding. They're long-term investors. At least this is staying here for a good few years.",
      "We've got a lot of cultures working there now — Muslims, Eastern Europeans, Italians. The factory is more diverse than the neighbourhood.",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote:
      "Directly aligns with Newham's Community Wealth Building strategy, which prioritises anchor institution engagement and local procurement.",
    sources: [
      "Newham Community Wealth Building Strategy",
      "Royal Docks Enterprise Zone Social Value Framework",
      "CLES Community Wealth Building toolkit",
      "Britvic PLC Annual Report — site investment data",
    ],
  },
  {
    id: "beckton-policy-4",
    title: "Free ESOL pop-ups at existing community venues",
    issuesAddressed: [
      { id: "beckton-issue-5", title: "Integration barriers — language, culture, and parallel communities" },
      { id: "beckton-issue-4", title: "Atomisation and isolation — a car-dependent, pass-through neighbourhood" },
    ],
    summary:
      "Deploy weekly free ESOL (English for Speakers of Other Languages) drop-in sessions at three existing Beckton venues: the West Ham Foundation football pitch pavilion, the shopping centre cafe area, and a local mosque. No new buildings needed. Meet people where they already go. Sessions run by trained volunteers from Newham Adult Learning Service, with childcare provided.",
    councilAction:
      "Extend Newham Adult Learning Service's ESOL programme to three Beckton venues. Recruit volunteer conversation partners. Provide DBS checks and basic training materials.",
    responsibleDepartment: "Newham Adult Learning Service",
    contactPath:
      "Newham Adult Learning Service manager. West Ham Foundation for venue access. Local mosque committee.",
    feasibility: "High",
    feasibilityReason:
      "Uses existing venues and an existing council service. Only incremental cost is volunteer coordination and materials. Can launch within weeks.",
    pathToImplementation: [
      "Identify three willing venue partners in Beckton (2 weeks)",
      "Recruit 6 volunteer ESOL conversation partners via Newham volunteering network (4 weeks)",
      "Launch weekly drop-in sessions — no registration required, just show up (6 weeks)",
      "Add childcare provision to remove the biggest barrier for parents (8 weeks)",
      "Track attendance, language progress, and social connections formed (ongoing)",
    ],
    estimatedCost: {
      range: "£8-15K per year",
      basis: "Volunteer coordinator part-time: £8K. Materials: £2K. Childcare: £3-5K. Venue costs: £0 (donated). Fundable through existing Newham ESOL budget or ward community fund.",
      category: "low",
    },
    timeToImplement: {
      range: "6-8 weeks",
      phasing: "First session within 6 weeks. Sustained weekly programme within 3 months.",
    },
    drawbacks: [
      {
        title: "Volunteer retention",
        description: "Volunteer-run programmes depend on sustained commitment. Turnover means inconsistent quality.",
      },
    ],
    isSystemicFix: false,
    systemicNote: "",
    publicSupport:
      "Ian described parents who can't speak English relying on their children to translate in shops. ESOL is the most direct intervention for this specific barrier.",
    residentQuotes: [
      "People were getting their children to speak for them in the shop. The girls kept saying 'I'm speaking to you' and the parent couldn't understand.",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote: "Directly supports Newham's ESOL strategy and the GLA's social integration targets.",
    sources: ["Newham Adult Learning Service", "GLA Social Integration Strategy"],
  },
  {
    id: "beckton-policy-5",
    title: "Beckton walking map and local history trail",
    issuesAddressed: [
      { id: "beckton-issue-3", title: "Closed community centres and derelict Beckton ski slope" },
      { id: "beckton-issue-1", title: "Loss of community identity and demographic conveyor belt" },
    ],
    summary:
      "Commission a hand-illustrated walking map and local history trail connecting Beckton's landmarks: the slag heap (Beckton), the gas works heritage, the Royal Docks, Galleons Reach, the Victorian toilets that disappeared, Britvic, the West Ham Foundation pitch. Physical maps distributed free at shops and bus stops. QR codes at each stop link to audio stories from long-term residents. Cost: almost nothing. Effect: make invisible history visible and give new residents a reason to walk the area.",
    councilAction:
      "Commission a local artist/historian. Print and distribute maps. Install 8-10 small QR code plaques at points of interest.",
    responsibleDepartment: "Newham Culture & Heritage",
    contactPath:
      "Newham Culture team. Royal Docks Heritage network. Local history societies.",
    feasibility: "High",
    feasibilityReason:
      "Extremely low cost, no planning permission needed, can be done entirely by the council's culture team with a small grant. Proven model in dozens of London boroughs.",
    pathToImplementation: [
      "Commission local artist/historian to research and illustrate the trail (4 weeks, ~£2K)",
      "Record audio stories from long-term residents like Ian (2 weeks, volunteer effort)",
      "Print 1,000 maps, distribute at shops, library, GP surgery, bus stops (2 weeks, ~£500)",
      "Install QR code plaques at 8-10 locations (4 weeks, ~£800)",
      "Launch with a guided walk event — invite new and old residents (1 day)",
    ],
    estimatedCost: {
      range: "£3-5K one-off",
      basis: "Artist commission: £2K. Printing: £500. QR plaques: £800. Launch event: £500. Total under £5K.",
      category: "low",
    },
    timeToImplement: {
      range: "2-3 months",
      phasing: "Research and illustration 4-6 weeks. Production and installation 2-4 weeks.",
    },
    drawbacks: [
      {
        title: "May be ignored by new residents",
        description: "People who commute to Beckton for shopping may not care about local history. The trail serves residents, not visitors.",
      },
    ],
    isSystemicFix: false,
    systemicNote: "",
    publicSupport:
      "Ian's detailed knowledge of the ski slope, the gas works, the docks, the Lesney toy car factory, the Victorian toilets — there is rich local history that is completely invisible to current residents. Making it visible costs almost nothing.",
    residentQuotes: [
      "That hill is a slag heap — all the waste from the gas works. I used the ski slope several times. You're the first person that knew it existed.",
      "There used to be the oldest Victorian toilet in London outside that pub. It disappeared and no one ever knew where it went.",
    ],
    alignedWithStatedPolicy: true,
    alignmentNote: "Aligns with Newham Heritage Strategy and Royal Docks placemaking objectives.",
    sources: ["Newham Heritage Strategy", "Royal Docks Enterprise Zone placemaking guidance"],
  },
];

export function isBecktonSlug(slug: string): boolean {
  const decoded = decodeURIComponent(slug).toLowerCase().replace(/[\s,.-]+/g, "");
  return (
    decoded === "beckton" ||
    decoded === "becktonalps" ||
    decoded === "becktonalpslondon" ||
    decoded === "becktone6" ||
    decoded === "becktonlondon"
  );
}
