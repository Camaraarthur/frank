import type { Metadata, Viewport } from "next";
import "./globals.css";
import { FeedbackButton } from "@/components/FeedbackButton";

export const metadata: Metadata = {
  title: "Frank — Civic intelligence powered by real conversations",
  description: "Your community, frank about what it needs. Free, open source, works in 190+ countries. Research any area, listen to people, surface issues, generate evidence-based policy proposals.",
  openGraph: {
    title: "Frank — Civic intelligence powered by real conversations",
    description: "Your community, frank about what it needs. Research any area, listen to people, surface issues.",
    url: "https://frank.community",
    siteName: "Frank",
    images: [{ url: "https://frank.community/og-image.png", width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Frank — Civic intelligence",
    description: "Your community, frank about what it needs.",
    images: ["https://frank.community/og-image.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: "#FFFFFF", color: "#1A1A1A" }}>
        {children}
        <FeedbackButton />
      </body>
    </html>
  );
}
