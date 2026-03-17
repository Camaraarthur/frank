/**
 * === OVERLAY RECOMMENDATIONS FOR THE BECKTON MAP ===
 *
 * The Beckton map currently shows ~30 coloured dots (interview quotes by location).
 * Based on research docs 24 and 25, here is what ELSE it should show NOW,
 * using data sources that are already working or already downloaded:
 *
 * PRIORITY 1 — Add immediately (data already available):
 *
 *   1. IMD Deprivation by LSOA (choropleth)
 *      - LSOA boundary GeoJSON already downloaded for Beckton
 *      - IMD deprivation CSV already cached
 *      - Shows each ~1,500-person area coloured by deprivation decile
 *      - WHY: Instantly contextualises every quote. When someone says "here is
 *        nothing," showing they live in the most deprived 10% grounds anecdote
 *        in statistical reality. This is the single most powerful civic overlay.
 *
 *   2. Air Quality heatmap tiles (Google Air Quality API — already working)
 *      - Google AQ API provides ready-made heatmap tiles as a tile layer
 *      - On-click at any point fetches live AQI, dominant pollutant, health advice
 *      - WHY: Residents mentioned pollution from A13, sewage works, industrial
 *        sites. Turns "it smells bad" into "PM2.5 is 3x WHO guideline."
 *        Especially relevant: Europe's largest sewage works is here with no
 *        hyperlocal air monitoring station.
 *
 *   3. Community places via Google Places API (already working)
 *      - Show mosques, community centres, parks, cafes, GP surgeries as icons
 *      - WHY: Multiple interviewees said "here is nothing." Showing what IS here
 *        (or confirming the gaps) makes the map a civic audit tool. The 7-year
 *        resident listed shops; the newcomers saw nothing. Both are right —
 *        the map should show why.
 *
 * PRIORITY 2 — Add next (GIS backend on port 4742 has the endpoints):
 *
 *   4. Transit stops + 15-min walking isochrone
 *      - Bus/rail stops from Overpass API (transit.py), isochrone from OSMnx
 *      - WHY: One person travels 45 minutes by bus for Home Bargains. Ian says
 *        most Britvic workers drive. The "solitary" feeling is partly a transit
 *        problem. Show where the transit deserts are.
 *
 *   5. Green space accessibility (distance-to-park heatmap)
 *      - Parks from Overpass (green_space.py), distance calculation built in
 *      - WHY: The Alps are fenced off. Central Park was mentioned nostalgically.
 *        Show whether residents can actually reach green space on foot.
 *
 *   6. Land use / zoning (landuse.py)
 *      - Colour by residential / commercial / industrial / green
 *      - WHY: The Britvic factory corridor is "socially invisible" but
 *        economically dominant. Showing 32% industrial land next to residential
 *        explains the civic tension residents feel but can't articulate.
 *
 * WHAT NOT TO SHOW YET:
 *   - Heat maps implying geographic coverage (we interviewed at 2 locations)
 *   - Word clouds or sentiment pie charts (8 conversations is not statistics)
 *   - Noise/flood/elevation overlays (useful but not urgent for Beckton story)
 *
 * DISPLAY RULE: Max 2-3 overlays active at once. Each overlay gets a legend.
 * The quote dots (this file) are always visible as the base narrative layer.
 */

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  name: string;
  type: "issue" | "landmark" | "positive" | "memory" | "service";
  quote: string;
  speaker: string;
  sentiment: "positive" | "negative" | "neutral" | "nostalgic";
  issue?: string;
}

export const BECKTON_MAP_POINTS: MapPoint[] = [
  // =====================================================================
  // FOOTBALLER WHO CAME FOR THE MEMORIAL (Sahib)
  // Came from outside the area for a charity football memorial tournament
  // =====================================================================
  {
    id: "whf-memorial-footballer",
    lat: 51.5133,
    lng: 0.0572,
    name: "West Ham Foundation pitch",
    type: "positive",
    quote:
      "I used to play with the team. That's their home ground, but this pitch is used for renting as well. There's a big community that comes to play over here, especially in the Newham area.",
    speaker: "Former local footballer, came back for memorial event",
    sentiment: "positive",
    issue: "community sports",
  },
  {
    id: "whf-came-back",
    lat: 51.5133,
    lng: 0.0572,
    name: "West Ham Foundation pitch",
    type: "positive",
    quote:
      "Today there was a memorial about someone who passed away a long time ago. They raised some money for his family and for a charity. I live far away now. I came only for this event.",
    speaker: "Former local footballer, came back for memorial event",
    sentiment: "nostalgic",
    issue: "community belonging",
  },

  // =====================================================================
  // PERSON VISITING THEIR MUM (at bus stop near football pitch)
  // Brief encounter — waiting for a bus, passing through
  // =====================================================================
  {
    id: "visiting-mum-bus",
    lat: 51.5133,
    lng: 0.0572,
    name: "Bus stop near football pitches",
    type: "landmark",
    quote: "I'm going to visit my mum. I'm waiting for the bus. Do I like it? It's okay.",
    speaker: "Passer-by, does not live locally",
    sentiment: "neutral",
    issue: "passing through",
  },

  // =====================================================================
  // 15-YEAR RESIDENT — loves the area, goes to Asda
  // One of the few long-term residents who is unambiguously positive
  // =====================================================================
  {
    id: "fifteen-year-loves-it",
    lat: 51.5155,
    lng: 0.0597,
    name: "Beckton area (near shopping centre)",
    type: "positive",
    quote:
      "I like everything. You like the area in general? Yeah. How long have you been living here? Fifteen years.",
    speaker: "Long-term resident, 15 years in area",
    sentiment: "positive",
    issue: "area satisfaction",
  },
  {
    id: "fifteen-year-asda",
    lat: 51.5088,
    lng: 0.0617,
    name: "Asda Beckton",
    type: "positive",
    quote: "It's a nice drive. It's good.",
    speaker: "Long-term resident, 15 years in area",
    sentiment: "positive",
    issue: "local amenities",
  },

  // =====================================================================
  // 7-YEAR RESIDENT — enthusiastic about shops and greenery
  // Lists multiple shops, says "really quite nice place"
  // =====================================================================
  {
    id: "seven-year-shops",
    lat: 51.5155,
    lng: 0.0597,
    name: "Beckton shopping centre",
    type: "positive",
    quote:
      "We like everything about this place. I got supermarkets, I got shops, builder shops, big supermarket, the Asian shop. We go bargain, buying everything necessary. It's really quite a nice place.",
    speaker: "Local resident, 7 years in area",
    sentiment: "positive",
    issue: "local amenities",
  },
  {
    id: "seven-year-greenery",
    lat: 51.5155,
    lng: 0.0597,
    name: "Beckton area",
    type: "positive",
    quote:
      "Old greenery. Old place is very big. You've got construction, you've got greenery. I've been living here for seven years. I love it here.",
    speaker: "Local resident, 7 years in area",
    sentiment: "positive",
    issue: "green space / character",
  },

  // =====================================================================
  // GROUP WHO ONLY KNOW THE SHOPPING CENTRE
  // Could not identify anything else on the map
  // =====================================================================
  {
    id: "group-nothing-here",
    lat: 51.5155,
    lng: 0.0597,
    name: "Beckton shopping centre",
    type: "issue",
    quote:
      "We know the Beckton shopping. And the Galleon Street Shopping Centre as well. Here is nothing, I think. Here is nothing.",
    speaker: "Group of residents (non-English speaking)",
    sentiment: "negative",
    issue: "lack of local knowledge / amenities",
  },
  {
    id: "group-not-right-person",
    lat: 51.5155,
    lng: 0.0597,
    name: "Beckton shopping centre",
    type: "issue",
    quote:
      "I'm not using that one because there is not a lot of shops. I never use that. We are not the right person. Sorry. You have to find someone else.",
    speaker: "Resident from the group, limited English",
    sentiment: "negative",
    issue: "disengagement / lack of shops",
  },

  // =====================================================================
  // BUS COMMUTER — 45 minutes each way for Home Bargains
  // Comes from far away specifically for ethnic food shops
  // =====================================================================
  {
    id: "bus-commuter-home-bargains",
    lat: 51.5155,
    lng: 0.0597,
    name: "Home Bargains, Beckton",
    type: "positive",
    quote:
      "What shops do you like the most? Home Bargains. And the Lithuanian shop, and the Bangladeshi one. There is food in it.",
    speaker: "Shopper, commutes 45 min by bus",
    sentiment: "positive",
    issue: "ethnic food retail",
  },
  {
    id: "bus-commuter-45min",
    lat: 51.5155,
    lng: 0.0597,
    name: "Beckton shopping centre",
    type: "issue",
    quote:
      "Do you live around here or do you come by bus? I'm coming by bus. From far? How long does it take? Forty-five minutes.",
    speaker: "Shopper, commutes 45 min by bus",
    sentiment: "neutral",
    issue: "transit / catchment area",
  },

  // =====================================================================
  // CONGESTION / TRAFFIC PERSON
  // Brief encounter — mentioned congestion and undisciplined drivers
  // =====================================================================
  {
    id: "beckton-congestion",
    lat: 51.515,
    lng: 0.06,
    name: "Beckton roads (near A13)",
    type: "issue",
    quote:
      "Very congested. And the drivers are very undisciplined. You're developing, regenerating some of this, and there's a lot of traffic.",
    speaker: "Passer-by / commuter",
    sentiment: "negative",
    issue: "traffic congestion",
  },

  // =====================================================================
  // SHOPPING CENTRE CASUAL USER — "not bad"
  // =====================================================================
  {
    id: "shopping-not-bad",
    lat: 51.5155,
    lng: 0.0597,
    name: "Beckton shopping centre",
    type: "positive",
    quote: "It's good. Not bad. Shopping centre? Yeah, I use the shop.",
    speaker: "Local resident, brief encounter",
    sentiment: "positive",
    issue: "local amenities",
  },

  // =====================================================================
  // SECOND FOOTBALLER (Malaga) — just comes for football
  // Only knows the area through the pitch
  // =====================================================================
  {
    id: "footballer-just-football",
    lat: 51.5133,
    lng: 0.0572,
    name: "West Ham Foundation pitch",
    type: "positive",
    quote:
      "Do you know something else around here, or you just come for football? Just come for football.",
    speaker: "Footballer visiting for memorial tournament",
    sentiment: "neutral",
    issue: "single-purpose visit",
  },

  // =====================================================================
  // LONG-TERM RESIDENT (20 years) — knows nobody anymore
  // Brief but significant — speaks to community dissolution
  // =====================================================================
  {
    id: "twenty-year-knows-nobody",
    lat: 51.515,
    lng: 0.06,
    name: "Beckton (general)",
    type: "issue",
    quote:
      "Lived here for twenty years, doesn't know anyone anymore. The people he knew have all moved out.",
    speaker: "Long-term resident, 20+ years in area",
    sentiment: "negative",
    issue: "community disconnection",
  },

  // =====================================================================
  // PUB PATRONS (Transcript 2)
  // =====================================================================
  {
    id: "beckton-pub-shithole",
    lat: 51.5148,
    lng: 0.0632,
    name: "Beckton pub",
    type: "issue",
    quote: "It's a shit hole. Everything is fucked up in Beckton.",
    speaker: "Pub patron",
    sentiment: "negative",
    issue: "general dissatisfaction",
  },
  {
    id: "beckton-pub-nothing-to-do",
    lat: 51.5148,
    lng: 0.0632,
    name: "Beckton pub",
    type: "issue",
    quote: "No entertainment. Gas smelling shit everywhere.",
    speaker: "Pub patron",
    sentiment: "negative",
    issue: "lack of entertainment / environmental quality",
  },

  // =====================================================================
  // RESEARCHER FIELD OBSERVATION (Arthur)
  // Not a resident quote but a pattern observed across multiple encounters
  // =====================================================================
  {
    id: "beckton-solitary-observation",
    lat: 51.515,
    lng: 0.06,
    name: "Beckton (general)",
    type: "issue",
    quote:
      "Everything is closed off. People come here by car from far away. They enter the market, do their thing, come back. They don't talk to anyone. Very, very solitary.",
    speaker: "Researcher field observation",
    sentiment: "negative",
    issue: "social isolation",
  },

  // =====================================================================
  // IAN — FACTORY WORKER, 50s, 10+ YEARS IN AREA
  // Best 11 quotes selected from the deep 20-minute interview
  // Covering: industry, heritage, identity loss, community centres, housing
  // =====================================================================
  {
    id: "ian-britvic-stable",
    lat: 51.5143,
    lng: 0.0655,
    name: "Britvic soft drinks factory",
    type: "positive",
    quote:
      "This whole thing is Britvic. They make Pepsi, Tango, Seven Up, Robinsons, J2O, Fruit Shoots. They're expanding. They do not invest their money lightly. If they spend money on a site, it's for long-term investment.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "positive",
    issue: "local industry / economic stability",
  },
  {
    id: "ian-ski-slope-memory",
    lat: 51.5192,
    lng: 0.0648,
    name: "Beckton Alps (former ski slope)",
    type: "memory",
    quote:
      "That hill is a slag heap. All the waste from the gas works was piled there. It used to be a ski slope. I used it several times. It's a shame to see it go.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "nostalgic",
    issue: "industrial heritage / lost amenity",
  },
  {
    id: "ian-sewage-biggest-europe",
    lat: 51.5191,
    lng: 0.0485,
    name: "Beckton sewage works",
    type: "landmark",
    quote: "You got the sewage works, which is the biggest in Europe.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "neutral",
    issue: "infrastructure",
  },
  {
    id: "ian-victorian-toilet",
    lat: 51.5075,
    lng: 0.0475,
    name: "Connaught Crossing (Fox pub)",
    type: "memory",
    quote:
      "That used to have the oldest Victorian toilet in London outside it. A cast iron circular toilet. When they refurbished the pub, it disappeared. No one knows what happened to it.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "nostalgic",
    issue: "lost heritage",
  },
  {
    id: "ian-galleons-hotel",
    lat: 51.507,
    lng: 0.075,
    name: "Galleons Reach (old hotel)",
    type: "memory",
    quote:
      "It used to be a hotel many years ago when the docks were open, and the building is still there. A really old building that sort of sits there. I don't know what they use it for now.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "nostalgic",
    issue: "derelict heritage",
  },
  {
    id: "ian-conveyor-belt",
    lat: 51.515,
    lng: 0.06,
    name: "Beckton (general)",
    type: "issue",
    quote:
      "This area is still changing almost daily. It's a conveyor belt of changing people. The area loses its identity.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "negative",
    issue: "identity loss / transient population",
  },
  {
    id: "ian-property-exodus",
    lat: 51.515,
    lng: 0.06,
    name: "Beckton (general)",
    type: "issue",
    quote:
      "People sell their property for maybe half a million and buy something 35km away for 300,000. They end up with money in their pocket. An almost natural exodus.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "negative",
    issue: "housing / population exodus",
  },
  {
    id: "ian-whf-youth-charity",
    lat: 51.5133,
    lng: 0.0572,
    name: "West Ham Foundation",
    type: "service",
    quote:
      "Foundation means they get funded by charities that West Ham support. For youth projects and things. Football and other stuff.",
    speaker: "Factory worker, 50s, 10+ years in area",
    sentiment: "positive",
    issue: "youth services",
  }
];

// --- Summary ---

const positiveCount = BECKTON_MAP_POINTS.filter(
  (p) => p.sentiment === "positive"
).length;
const negativeCount = BECKTON_MAP_POINTS.filter(
  (p) => p.sentiment === "negative"
).length;
const nostalgicCount = BECKTON_MAP_POINTS.filter(
  (p) => p.sentiment === "nostalgic"
).length;
const neutralCount = BECKTON_MAP_POINTS.filter(
  (p) => p.sentiment === "neutral"
).length;

// Count by speaker category
const speakerCounts: Record<string, number> = {};
for (const p of BECKTON_MAP_POINTS) {
  let key = "other";
  if (p.speaker.includes("Factory worker")) key = "Ian (factory worker)";
  else if (p.speaker.includes("memorial") || p.speaker.includes("footballer"))
    key = "Footballers / memorial";
  else if (p.speaker.includes("15 years")) key = "15-year resident";
  else if (p.speaker.includes("7 years")) key = "7-year resident";
  else if (p.speaker.includes("bus") || p.speaker.includes("45 min"))
    key = "Bus commuter";
  else if (p.speaker.includes("Pub")) key = "Pub patrons";
  else if (p.speaker.includes("Group") || p.speaker.includes("group"))
    key = "Group (limited English)";
  else if (p.speaker.includes("Researcher")) key = "Researcher observation";
  speakerCounts[key] = (speakerCounts[key] || 0) + 1;
}

// Count location frequency
const locationCounts: Record<string, number> = {};
for (const p of BECKTON_MAP_POINTS) {
  const key = p.name.replace(/ \(.*\)/, "");
  locationCounts[key] = (locationCounts[key] || 0) + 1;
}
const topLocations = Object.entries(locationCounts)
  .sort((a, b) => b[1] - a[1])
  .slice(0, 8)
  .map(([name, count]) => ({ name, count }));

export const BECKTON_MAP_SUMMARY = {
  totalMentions: BECKTON_MAP_POINTS.length,
  positiveCount,
  negativeCount,
  nostalgicCount,
  neutralCount,
  speakerCounts,
  topLocations,
};
