// Beat design system — civic aesthetic
// Navy background, amber accent, institutional feel

export const colors = {
  // Background layers
  navy900: "#0D1B2A",  // page background
  navy800: "#1B2A3B",  // surface (cards, panels)
  navy700: "#253447",  // surface-2 (elevated elements)
  navy600: "#2E4057",  // border

  // Primary action color
  amber500: "#D4840A",  // primary buttons, active states
  amber400: "#E8960F",  // hover / pressed
  amber200: "#FFC857",  // accent highlights, wordmark

  // Text
  slate100: "#F0F4F8",  // primary text
  slate300: "#B8C5D1",  // secondary text
  slate500: "#6B7F8E",  // disabled / muted

  // Status
  recordingRed: "#E53E3E",
  consentGreen: "#00B894",

  // Severity (issue cards)
  high: "#E53E3E",     // red
  medium: "#D4840A",   // amber
  low: "#4299E1",      // blue
} as const;

export type ColorKey = keyof typeof colors;
